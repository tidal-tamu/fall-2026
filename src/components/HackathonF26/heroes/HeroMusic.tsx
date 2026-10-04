import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EVENT, STICKER, TRACKS } from "../event";
import RegisterButton from "../RegisterButton";
import StickerTitle from "../StickerTitle";
import { Chiptune, LOOP_SECONDS } from "./chiptune";
import { rise } from "./variants";
import "./hero-music.css";

/* -------------------------------------------------------------------------- */
/*  Music: the hero as the album's now-playing screen. Pebble on the sleeve,   */
/*  a record half out of it, the sticker title, a player and the tracklist.    */
/*  Play starts a chiptune synthesised on the spot; the record slides out and  */
/*  spins, Pebble bops on every kick and the EQ reads the real spectrum.       */
/* -------------------------------------------------------------------------- */

const FILES: Record<string, string> = {
    invite: "invite.tix",
    about: "about.html",
    schedule: "schedule.rcpt",
    prizes: "prizes.cda",
    sponsors: "liner-notes.txt",
    faq: "b-sides.faq",
};

const TRACK_LIST = TRACKS.filter((t) => t.id !== "top");
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const LENGTH = fmt(LOOP_SECONDS);

const holdStill = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.motion === "paused";

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z" fill="currentColor" />
    </svg>
);

const SkipIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M15.5 5H18v14h-2.5zM4 5l10.5 7L4 19z" fill="currentColor" />
    </svg>
);

/* The sleeve's cloud bank, drawn the diary hero's way: outline, shade, then
   raised white puffs. */
const PUFFS: [number, number, number][] = [
    [30, 120, 50], [95, 100, 55], [165, 110, 50], [235, 95, 60], [305, 108, 52], [370, 118, 48],
    [60, 155, 60], [200, 145, 72], [340, 155, 60],
];

const SleeveClouds = () => (
    <svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMax slice" className="music-sleeve__clouds" aria-hidden="true">
        <g fill="none" stroke="#3d4a57" strokeWidth="4">
            {PUFFS.map(([cx, cy, r]) => (
                <circle key={`o${cx}`} cx={cx} cy={cy} r={r} />
            ))}
        </g>
        <g fill="#d9e4ef">
            {PUFFS.map(([cx, cy, r]) => (
                <circle key={`s${cx}`} cx={cx} cy={cy} r={r} />
            ))}
        </g>
        <g fill="#ffffff">
            {PUFFS.map(([cx, cy, r]) => (
                <circle key={`w${cx}`} cx={cx - 3} cy={cy - 9} r={r - 9} />
            ))}
        </g>
    </svg>
);

const HeroMusic = ({ shouldAnimate = false }: { shouldAnimate?: boolean }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLSpanElement>(null);
    const elapsedRef = useRef<HTMLSpanElement>(null);
    const remainRef = useRef<HTMLSpanElement>(null);
    const synth = useRef<Chiptune | null>(null);
    const [playing, setPlaying] = useState(false);

    /* While playing, read the analyser every frame and hand the levels to CSS
       as custom properties; nothing re-renders. Stopped, everything settles. */
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const paint = (pulse: number, bands: number[], p: number) => {
            root.style.setProperty("--beat", pulse.toFixed(3));
            bands.forEach((b, i) => root.style.setProperty(`--eq${i}`, b.toFixed(3)));
            if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
            if (elapsedRef.current) elapsedRef.current.textContent = fmt(p * LOOP_SECONDS);
            if (remainRef.current) remainRef.current.textContent = `-${fmt((1 - p) * LOOP_SECONDS)}`;
        };
        if (!playing) {
            paint(0, [0, 0, 0, 0, 0], 0);
            return;
        }
        let raf = 0;
        const tick = () => {
            const s = synth.current;
            if (s) {
                const { pulse, bands } = s.read();
                const still = holdStill();
                paint(still ? 0 : pulse, still ? bands.map(() => 0.35) : bands, s.progress());
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [playing]);

    /* Stop when the hero scrolls away or the tab hides; close the audio
       context when this version unmounts. */
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const pause = () => {
            synth.current?.stop();
            setPlaying(false);
        };
        const seen = new IntersectionObserver(([e]) => !e.isIntersecting && pause(), { threshold: 0.15 });
        seen.observe(root);
        const onHide = () => document.hidden && pause();
        document.addEventListener("visibilitychange", onHide);
        return () => {
            seen.disconnect();
            document.removeEventListener("visibilitychange", onHide);
            synth.current?.dispose();
            synth.current = null;
        };
    }, []);

    const toggle = async () => {
        const s = (synth.current ??= new Chiptune());
        if (s.playing) {
            s.stop();
            setPlaying(false);
        } else {
            await s.play();
            setPlaying(true);
        }
    };

    return (
        <div ref={rootRef} className={`music-page relative h-screen w-full overflow-hidden ${playing ? "is-playing" : ""}`}>
            <div className="music-wrap">
                <motion.div className="music-art" aria-hidden="true" {...rise(shouldAnimate, 0.2)}>
                    <div className="music-record">
                        <div className="music-record__disc">
                            <div className="music-record__label">
                                <img src={STICKER("pebble-bow")} alt="" decoding="async" draggable={false} />
                            </div>
                        </div>
                        <span className="music-record__shine" />
                    </div>
                    <div className="music-sleeve">
                        <SleeveClouds />
                        <span className="music-sleeve__brand font-pixel">tidalBYTE</span>
                        <span className="music-sleeve__year font-pixel">&apos;26</span>
                        <img
                            className="music-sleeve__pebble"
                            src={STICKER("pebble-headphones")}
                            alt=""
                            decoding="async"
                            draggable={false}
                        />
                        <span className="music-advisory">
                            <b>beginner</b>
                            <i>advisory</i>
                            <small>no experience needed</small>
                        </span>
                    </div>
                </motion.div>

                <div className="music-info">
                    <motion.p className="music-eyebrow" {...rise(shouldAnimate, 0.3)}>
                        <span className="music-eq" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </span>
                        {playing ? "now playing · intro" : "side a · intro"}
                    </motion.p>

                    <motion.h1 className="music-title" {...rise(shouldAnimate, 0.38)}>
                        <span className="sr-only">tidalBYTE &apos;26</span>
                        <StickerTitle />
                    </motion.h1>

                    <motion.p className="music-meta" {...rise(shouldAnimate, 0.46)}>
                        {EVENT.date} · {EVENT.room} · {EVENT.hours} hours
                    </motion.p>

                    <motion.div className="music-player" {...rise(shouldAnimate, 0.54)}>
                        <div className="music-progress" aria-hidden="true">
                            <span ref={elapsedRef} className="music-time">
                                0:00
                            </span>
                            <span className="music-bar">
                                <span ref={fillRef} className="music-bar__fill" />
                            </span>
                            <span ref={remainRef} className="music-time">
                                -{LENGTH}
                            </span>
                        </div>
                        <div className="music-controls">
                            <button
                                type="button"
                                className="music-play"
                                onClick={toggle}
                                aria-pressed={playing}
                                aria-label={playing ? "Pause the tidalBYTE theme" : "Play the tidalBYTE theme"}
                            >
                                {playing ? <PauseIcon /> : <PlayIcon />}
                            </button>
                            <a href="#invite" className="music-skip">
                                <SkipIcon />
                                skip intro
                            </a>
                            <RegisterButton />
                        </div>
                    </motion.div>

                    <motion.ol className="music-tracks" {...rise(shouldAnimate, 0.62)}>
                        {TRACK_LIST.map((t, i) => (
                            <li key={t.id}>
                                <a href={`#${t.id}`} className="music-track">
                                    <span className="music-track__no">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="music-track__title">{t.title}</span>
                                    <span className="music-track__file">{FILES[t.id]}</span>
                                </a>
                            </li>
                        ))}
                    </motion.ol>
                </div>
            </div>
        </div>
    );
};

export default HeroMusic;
