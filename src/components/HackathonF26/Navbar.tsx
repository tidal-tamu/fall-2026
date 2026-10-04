import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EVENT, TRACKS } from "./event";

/* -------------------------------------------------------------------------- */
/*  The docked mini player: site navigation once the hero is out of view.      */
/*  prev / next walk the page's "tracks", the LCD shows the section you're on  */
/*  plus a countdown to doors, and the bar under it is scroll progress.        */
/*  The middle button pauses every CSS animation on the page (marquee, disc,   */
/*  caret) for anyone who'd rather it sat still.                               */
/* -------------------------------------------------------------------------- */

const START = Date.parse(EVENT.startsAt);
const END = Date.parse(EVENT.endsAt);
const MOTION_KEY = "f26-motion";
const pad = (n: number) => String(n).padStart(2, "0");

function useCountdown() {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    if (now >= END) return "THAT'S A WRAP";
    const live = now >= START;
    const ms = live ? END - now : START - now;
    const h = Math.floor(ms / 3.6e6);
    const hms = `${pad(h % 24)}:${pad(Math.floor(ms / 6e4) % 60)}:${pad(Math.floor(ms / 1e3) % 60)}`;
    if (live) return `LIVE -${hms}`;
    return `-${Math.floor(h / 24)}D ${hms}`;
}

function readMotionPref() {
    try {
        return localStorage.getItem(MOTION_KEY) === "paused";
    } catch {
        return false;
    }
}

const Glyph = ({ d }: { d: string }) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
        <path d={d} fill="currentColor" />
    </svg>
);

const G = {
    prev: "M6 5h2.5v14H6zM20 5v14L9.5 12z",
    next: "M15.5 5H18v14h-2.5zM4 5l10.5 7L4 19z",
    play: "M7 4.5v15L19.5 12z",
    pause: "M6.5 5h4v14h-4zM13.5 5h4v14h-4z",
    list: "M4 6h16v2.2H4zM4 11h16v2.2H4zM4 16h10v2.2H4z",
};

const Navbar = () => {
    const reduce = useReducedMotion();
    const countdown = useCountdown();
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(0);
    const [open, setOpen] = useState(false);
    const [paused, setPaused] = useState(readMotionPref);
    const fillRef = useRef<HTMLSpanElement>(null);
    const navRef = useRef<HTMLElement>(null);

    /* show once the hero is mostly gone; paint scroll progress directly.
       Re-runs on `visible` so the bar is painted the moment the dock mounts. */
    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                setVisible(window.scrollY > window.innerHeight * 0.6);
                if (fillRef.current) {
                    fillRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
                }
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [visible]);

    /* which track is under the middle of the viewport */
    useEffect(() => {
        const els = TRACKS.map((t) => document.getElementById(t.id)).filter(
            (el): el is HTMLElement => el !== null,
        );
        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (!e.isIntersecting) continue;
                    const i = TRACKS.findIndex((t) => t.id === e.target.id);
                    if (i >= 0) setCurrent(i);
                }
            },
            { rootMargin: "-45% 0px -54% 0px" },
        );
        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        document.documentElement.dataset.motion = paused ? "paused" : "playing";
        try {
            localStorage.setItem(MOTION_KEY, paused ? "paused" : "playing");
        } catch {
            // storage blocked (private mode): the toggle still works this visit
        }
    }, [paused]);

    /* tracklist popover: close on Escape or a click outside the dock */
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        const onDown = (e: PointerEvent) => {
            if (!navRef.current?.contains(e.target as Node)) setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("pointerdown", onDown);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("pointerdown", onDown);
        };
    }, [open]);

    const go = (i: number) => {
        const t = TRACKS[Math.max(0, Math.min(TRACKS.length - 1, i))];
        document.getElementById(t.id)?.scrollIntoView({ block: "start" });
    };

    const track = TRACKS[current];
    const doorsLabel = `Doors open ${EVENT.day}, ${EVENT.date}`;

    return (
        <AnimatePresence>
            {visible && (
                <motion.nav
                    ref={navRef}
                    aria-label="Page sections"
                    className="dock"
                    initial={reduce ? { opacity: 0 } : { y: 110 }}
                    animate={reduce ? { opacity: 1 } : { y: 0 }}
                    exit={reduce ? { opacity: 0 } : { y: 110 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="dock__controls">
                        <button
                            type="button"
                            className="dock__btn"
                            aria-label="Previous section"
                            disabled={current === 0}
                            onClick={() => go(current - 1)}
                        >
                            <Glyph d={G.prev} />
                        </button>
                        <button
                            type="button"
                            className="dock__btn dock__btn--main"
                            aria-pressed={paused}
                            aria-label={paused ? "Resume page animations" : "Pause page animations"}
                            title={paused ? "resume animations" : "pause animations"}
                            onClick={() => setPaused((p) => !p)}
                        >
                            <Glyph d={paused ? G.play : G.pause} />
                        </button>
                        <button
                            type="button"
                            className="dock__btn"
                            aria-label="Next section"
                            disabled={current === TRACKS.length - 1}
                            onClick={() => go(current + 1)}
                        >
                            <Glyph d={G.next} />
                        </button>
                    </div>

                    <div className="dock__lcd">
                        <span className="dock__line">
                            <span className="dock__trk">TRK {pad(current)}</span>
                            <span className="dock__title">{track.title}</span>
                            <span className="dock__count" aria-hidden="true">
                                {countdown}
                            </span>
                            <span className="sr-only">{doorsLabel}</span>
                        </span>
                        <span className="dock__progress" aria-hidden="true">
                            <span ref={fillRef} className="dock__fill" />
                        </span>
                    </div>

                    <button
                        type="button"
                        className="dock__btn"
                        aria-label="Tracklist"
                        aria-expanded={open}
                        aria-controls="dock-tracklist"
                        onClick={() => setOpen((o) => !o)}
                    >
                        <Glyph d={G.list} />
                    </button>

                    <AnimatePresence>
                        {open && (
                            <motion.ol
                                id="dock-tracklist"
                                className="dock__list"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.18 }}
                            >
                                {TRACKS.map((t, i) => (
                                    <li key={t.id}>
                                        <a
                                            href={`#${t.id}`}
                                            aria-current={i === current ? "location" : undefined}
                                            onClick={() => setOpen(false)}
                                        >
                                            <span>{pad(i)}</span>
                                            {t.title}
                                        </a>
                                    </li>
                                ))}
                            </motion.ol>
                        )}
                    </AnimatePresence>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};

export default Navbar;
