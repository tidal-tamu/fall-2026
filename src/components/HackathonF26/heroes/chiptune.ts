/* -------------------------------------------------------------------------- */
/*  A tiny chiptune for the music hero, synthesised live with Web Audio, so    */
/*  there are no audio files to ship. Square-wave lead, octave-hopping         */
/*  triangle bass and noise drums, looping Am-F-C-G at 112 bpm. An analyser    */
/*  taps the output for the EQ, and every kick is logged so the page can bop   */
/*  exactly on the beat.                                                       */
/* -------------------------------------------------------------------------- */

const BPM = 112;
const STEP = 60 / BPM / 2; // one eighth note
const STEPS = 32; // four bars of eighths
const LOOKAHEAD = 0.12; // seconds of notes kept queued ahead of the clock
const VOLUME = 0.55;

export const LOOP_SECONDS = STEP * STEPS;

const SEMITONE: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
const hz = (note: string) => {
    const [, letter, octave] = /^([A-G])(\d)$/.exec(note) ?? ["", "A", "4"];
    return 440 * 2 ** ((SEMITONE[letter] + (Number(octave) - 4) * 12) / 12);
};

/* [step, note, length in steps]. Bar by bar: Am, F, C, G. */
const LEAD: [number, string, number][] = [
    [0, "E5", 1], [2, "A5", 1], [4, "G5", 1], [5, "E5", 1], [6, "C5", 1], [7, "E5", 1],
    [8, "F5", 1], [10, "A5", 1], [12, "G5", 1], [13, "F5", 1], [14, "C5", 1], [15, "A4", 1],
    [16, "E5", 1], [18, "G5", 1], [20, "C6", 2], [22, "G5", 1], [23, "E5", 1],
    [24, "D5", 1], [26, "G5", 1], [28, "B4", 1], [29, "D5", 1], [30, "G5", 2],
];
const LEAD_AT = new Map(LEAD.map(([step, note, len]) => [step, { freq: hz(note), len }]));
const ROOTS = ["A2", "F2", "C3", "G2"].map(hz);

type Levels = { bands: number[]; pulse: number };
const SILENT: Levels = { bands: [0, 0, 0, 0, 0], pulse: 0 };

export class Chiptune {
    playing = false;

    private ctx: AudioContext | null = null;
    private master: GainNode | null = null;
    private analyser: AnalyserNode | null = null;
    private noise: AudioBuffer | null = null;
    private bins: Uint8Array<ArrayBuffer> | null = null;
    private kicks: number[] = []; // scheduled kick times, oldest first
    private timer = 0;
    private step = 0;
    private nextTime = 0;
    private startTime = 0;

    /* Built on the first press: browsers only let audio start from a gesture. */
    private ensure() {
        if (this.ctx) return this.ctx;
        const AC =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AC();

        const master = ctx.createGain();
        const squash = ctx.createDynamicsCompressor();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.5;
        master.connect(squash);
        squash.connect(analyser);
        analyser.connect(ctx.destination);

        // one second of white noise, shared by every drum hit
        const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

        this.ctx = ctx;
        this.master = master;
        this.analyser = analyser;
        this.noise = noise;
        return ctx;
    }

    async play() {
        const ctx = this.ensure();
        if (ctx.state === "suspended") await ctx.resume();
        if (this.playing || !this.master) return;
        this.playing = true;
        const t = ctx.currentTime + 0.06;
        this.master.gain.cancelScheduledValues(ctx.currentTime);
        this.master.gain.setValueAtTime(VOLUME, ctx.currentTime);
        this.step = 0;
        this.startTime = this.nextTime = t;
        this.schedule();
        this.timer = window.setInterval(() => this.schedule(), 25);
    }

    stop() {
        if (!this.playing || !this.ctx || !this.master) return;
        this.playing = false;
        this.kicks = [];
        clearInterval(this.timer);
        // fade out whatever is already queued instead of cutting it with a click
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
    }

    dispose() {
        this.stop();
        void this.ctx?.close();
        this.ctx = null;
    }

    /* Where in the loop we are, 0 to 1. */
    progress() {
        if (!this.ctx || !this.playing) return 0;
        const into = (this.ctx.currentTime - this.startTime) % LOOP_SECONDS;
        return Math.max(0, into) / LOOP_SECONDS;
    }

    /* Five spectrum bands, each 0 to 1, plus a pulse that snaps to 1 on every
       kick and decays before the next. The bass sits under the kick on every
       eighth, so the raw low end never dips far enough to show a beat. */
    read(): Levels {
        if (!this.ctx || !this.analyser || !this.playing) return SILENT;
        const bins = (this.bins ??= new Uint8Array(this.analyser.frequencyBinCount));
        this.analyser.getByteFrequencyData(bins);
        const now = this.ctx.currentTime;
        while (this.kicks.length > 1 && this.kicks[1] <= now) this.kicks.shift();
        const last = this.kicks[0] <= now ? this.kicks[0] : -Infinity;
        return {
            bands: [1, 3, 6, 12, 24].map((i) => bins[i] / 255),
            pulse: Math.exp(-(now - last) / 0.11),
        };
    }

    private schedule() {
        const ctx = this.ctx;
        if (!ctx) return;
        while (this.nextTime < ctx.currentTime + LOOKAHEAD) {
            this.playStep(this.step, this.nextTime);
            this.nextTime += STEP;
            this.step = (this.step + 1) % STEPS;
        }
    }

    private playStep(step: number, t: number) {
        const bar = Math.floor(step / 8);
        const beat = step % 8;

        const lead = LEAD_AT.get(step);
        if (lead) this.tone("square", lead.freq, t, lead.len * STEP * 0.95, 0.09, 2600);

        // octave-hopping eighths on the chord root
        this.tone("triangle", ROOTS[bar] * (beat % 2 ? 2 : 1), t, STEP * 0.9, 0.32);

        if (beat === 0 || beat === 4 || (bar === 3 && beat === 7)) {
            this.kick(t);
            this.kicks.push(t);
        }
        if (beat === 2 || beat === 6) {
            this.hiss(t, 0.14, 0.3, "highpass", 1400);
            this.tone("triangle", 190, t, 0.09, 0.16);
        }
        if (beat % 2 === 1) this.hiss(t, 0.04, 0.08, "highpass", 7500);
    }

    private tone(type: OscillatorType, freq: number, t: number, dur: number, peak: number, lowpass?: number) {
        const { ctx, master } = this;
        if (!ctx || !master) return;
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, t);
        env.gain.exponentialRampToValueAtTime(peak, t + 0.008);
        env.gain.exponentialRampToValueAtTime(peak * 0.55, t + Math.min(0.08, dur * 0.6));
        env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        let out: AudioNode = osc;
        if (lowpass) {
            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = lowpass;
            osc.connect(filter);
            out = filter;
        }
        out.connect(env);
        env.connect(master);
        osc.start(t);
        osc.stop(t + dur + 0.02);
    }

    private kick(t: number) {
        const { ctx, master } = this;
        if (!ctx || !master) return;
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, t);
        env.gain.exponentialRampToValueAtTime(0.9, t + 0.004);
        env.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        osc.connect(env);
        env.connect(master);
        osc.start(t);
        osc.stop(t + 0.2);
    }

    private hiss(t: number, dur: number, peak: number, type: BiquadFilterType, freq: number) {
        const { ctx, master, noise } = this;
        if (!ctx || !master || !noise) return;
        const src = ctx.createBufferSource();
        src.buffer = noise;
        const filter = ctx.createBiquadFilter();
        filter.type = type;
        filter.frequency.value = freq;
        const env = ctx.createGain();
        env.gain.setValueAtTime(peak, t);
        env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(filter);
        filter.connect(env);
        env.connect(master);
        src.start(t, Math.random() * 0.5);
        src.stop(t + dur + 0.02);
    }
}
