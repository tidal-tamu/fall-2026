import { rng } from "./skyline";

/* -------------------------------------------------------------------------- */
/*  The mist wrapped around the giant penguin. Soft radial puffs on a canvas   */
/*  rendered at half resolution; the cursor punches springy holes that hold    */
/*  open for a moment, then ease shut.                                         */
/* -------------------------------------------------------------------------- */

const SCALE = 0.5; // the mist is soft, so half resolution is plenty
const HOLD = 2600;
const CLOSE = 1100;

type Puff = { x: number; y: number; rad: number; a: number; ph: number; sp: number };
type Hole = { x: number; y: number; t0: number; until: number; R: number };

/* A spring that overshoots a touch before settling. */
const spring = (e: number) => 1 - Math.exp(-7 * e) * Math.cos(10 * e);

export class Fog {
    private ctx: CanvasRenderingContext2D | null;
    private W = 0;
    private H = 0;
    private R = 160;
    private puffs: Puff[] = [];
    private holes: Hole[] = [];

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d");
    }

    /* Puffs follow the giant's silhouette (it is 1.18x the hero's height wide),
       veil its crown, and hug the skyline in a low band. */
    layout(width: number, height: number) {
        this.W = width;
        this.H = height;
        this.canvas.width = Math.max(1, Math.round(width * SCALE));
        this.canvas.height = Math.max(1, Math.round(height * SCALE));
        this.R = Math.max(110, Math.min(height * 0.17, 190));
        const r = rng(41), H = height, W = width, gw = H * 1.18;
        const puffs: Puff[] = [];
        for (let i = 0; i < 14; i++) {
            const f = i / 13, y = H * (0.1 + f * 0.6), half = gw * (0.15 + 0.3 * Math.pow(f, 0.7));
            for (const side of [-1, 1])
                puffs.push({
                    x: W / 2 + side * (half + (r() - 0.35) * H * 0.07), y: y + (r() - 0.5) * H * 0.04,
                    rad: H * (0.11 + r() * 0.08), a: 0.4 + r() * 0.22, ph: r() * 6.28, sp: 0.05 + r() * 0.08,
                });
        }
        for (let i = 0; i < 5; i++) {
            const ang = Math.PI * (1.15 + i * 0.175);
            puffs.push({
                x: W / 2 + Math.cos(ang) * gw * 0.24, y: H * 0.17 + Math.sin(ang) * H * 0.15,
                rad: H * (0.1 + r() * 0.05), a: 0.28 + r() * 0.12, ph: r() * 6.28, sp: 0.06,
            });
        }
        for (let i = 0; i < 12; i++)
            puffs.push({
                x: W * (i / 11) + (r() - 0.5) * 60, y: H * (0.58 + r() * 0.12),
                rad: H * (0.13 + r() * 0.08), a: 0.45 + r() * 0.2, ph: r() * 6.28, sp: 0.04 + r() * 0.05,
            });
        this.puffs = puffs;
    }

    /* Open a hole at (x, y), or keep an open one nearby from closing. */
    poke(x: number, y: number, now: number) {
        for (const h of this.holes)
            if (now < h.until && Math.hypot(h.x - x, h.y - y) < h.R * 0.45) {
                h.until = Math.max(h.until, now + HOLD);
                return;
            }
        this.holes.push({ x, y, t0: now, until: now + HOLD, R: this.R * (0.9 + Math.random() * 0.2) });
        if (this.holes.length > 40) this.holes.shift();
    }

    private holeRadius(h: Hole, now: number, still: boolean) {
        const grown = still ? 1 : spring((now - h.t0) / 1000);
        if (now < h.until) return h.R * grown;
        const c = (now - h.until) / CLOSE;
        if (c >= 1) return 0;
        const k = 1 - c;
        return h.R * Math.min(grown, 1.05) * k * k * (3 - 2 * k);
    }

    /* t drives the drift (pass 0 to hold still); now is performance.now(). */
    draw(t: number, now: number, still: boolean) {
        const c = this.ctx;
        if (!c) return;
        const { W, H } = this;
        c.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        c.globalCompositeOperation = "source-over";
        c.clearRect(0, 0, W, H);

        const floor = c.createLinearGradient(0, H * 0.42, 0, H * 0.86);
        floor.addColorStop(0, "rgba(226,233,239,0)");
        floor.addColorStop(1, "rgba(226,233,239,.85)");
        c.fillStyle = floor;
        c.fillRect(0, H * 0.42, W, H * 0.58);

        for (const p of this.puffs) {
            const x = p.x + Math.sin(t * p.sp + p.ph) * 24;
            const y = p.y + Math.cos(t * p.sp * 0.8 + p.ph) * 10;
            const g = c.createRadialGradient(x, y, 0, x, y, p.rad);
            g.addColorStop(0, `rgba(238,243,247,${p.a})`);
            g.addColorStop(0.55, `rgba(238,243,247,${p.a * 0.6})`);
            g.addColorStop(1, "rgba(238,243,247,0)");
            c.fillStyle = g;
            c.beginPath();
            c.arc(x, y, p.rad, 0, 7);
            c.fill();
        }

        c.globalCompositeOperation = "destination-out";
        for (let i = this.holes.length - 1; i >= 0; i--) {
            const h = this.holes[i];
            const rr = this.holeRadius(h, now, still);
            if (rr <= 0 && now > h.until) {
                this.holes.splice(i, 1);
                continue;
            }
            if (rr < 1) continue;
            const g = c.createRadialGradient(h.x, h.y, 0, h.x, h.y, rr);
            g.addColorStop(0, "rgba(0,0,0,1)");
            g.addColorStop(0.5, "rgba(0,0,0,.92)");
            g.addColorStop(1, "rgba(0,0,0,0)");
            c.fillStyle = g;
            c.beginPath();
            c.arc(h.x, h.y, rr, 0, 7);
            c.fill();
        }
    }
}
