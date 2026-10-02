import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import SectionHeader from "./SectionHeader";
import Sticker from "./Sticker";
import { STICKER } from "./event";

/* -------------------------------------------------------------------------- */
/*  Prizes as an old CD player (theme pitch: "old CD player interface",        */
/*  "2000s streaming websites"). Picking a track plays it; the disc spins and  */
/*  the player walks the tracklist until you pause.                            */
/* -------------------------------------------------------------------------- */

/* Categories from the team's draft. Amounts stay TBD until the budget is set. */
const TRACKLIST = [
    { title: "first place", kind: "grand prize", prize: "TBD" },
    { title: "second place", kind: "grand prize", prize: "TBD" },
    { title: "third place", kind: "grand prize", prize: "TBD" },
    { title: "best design", kind: "track prize", prize: "TBD" },
    { title: "best beginner", kind: "track prize", prize: "TBD" },
    { title: "best solo", kind: "track prize", prize: "TBD" },
];

const TRACK_MS = 6000;
const pad = (n: number) => String(n).padStart(2, "0");
const clock = (ms: number) => `0:${pad(Math.floor(ms / 1000))}`;

const Icon = ({ d }: { d: string }) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path d={d} fill="currentColor" />
    </svg>
);

const PATHS = {
    prev: "M6 5h2.5v14H6zM20 5v14L9.5 12z",
    next: "M15.5 5H18v14h-2.5zM4 5l10.5 7L4 19z",
    play: "M7 4.5v15L19.5 12z",
    pause: "M6.5 5h4v14h-4zM13.5 5h4v14h-4z",
    repeat: "M7 7h9.5V4.5L21 8.5l-4.5 4V10H8.5v3H6V8a1 1 0 0 1 1-1zm10 10H7.5v2.5L3 15.5l4.5-4V14h8v-3H18v5a1 1 0 0 1-1 1z",
};

const Prizes = () => {
    const reduce = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [liked, setLiked] = useState<Set<number>>(() => new Set());

    // Progress is painted straight onto the DOM each frame; routing it
    // through state would re-render the whole section at 60fps.
    const progressRef = useRef(0);
    const barRef = useRef<HTMLSpanElement>(null);
    const elapsedRef = useRef<HTMLSpanElement>(null);
    const remainRef = useRef<HTMLSpanElement>(null);
    const repeatRef = useRef(repeat);
    repeatRef.current = repeat;

    const paint = useCallback(() => {
        const p = progressRef.current;
        if (barRef.current) barRef.current.style.setProperty("--p", String(p));
        if (elapsedRef.current) elapsedRef.current.textContent = clock(p * TRACK_MS);
        if (remainRef.current) remainRef.current.textContent = `-${clock((1 - p) * TRACK_MS)}`;
    }, []);

    useEffect(() => {
        if (!playing) return;
        let raf = 0;
        let last = performance.now();
        const step = (t: number) => {
            progressRef.current += (t - last) / TRACK_MS;
            last = t;
            if (progressRef.current >= 1) {
                progressRef.current = 0;
                if (!repeatRef.current) setIndex((i) => (i + 1) % TRACKLIST.length);
            }
            paint();
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [playing, paint]);

    const cue = (i: number, autoplay = true) => {
        setIndex((i + TRACKLIST.length) % TRACKLIST.length);
        progressRef.current = 0;
        paint();
        if (autoplay) setPlaying(true);
    };

    const toggleLike = () =>
        setLiked((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });

    const track = TRACKLIST[index];
    const spinning = playing && !reduce;

    return (
        <section id="prizes" className="section bg-shade-100">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    track="04"
                    file="prizes.cda"
                    title="the prizes"
                    dek="six tracks on the album. press play, or pick one. amounts drop closer to the day."
                />

                <div className="mt-16 grid items-start gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
                    {/* ------------------------------------------ player -- */}
                    <div className="relative">
                        <div className="player">
                            <div className="disc">
                                <div className={`disc__spin ${spinning ? "is-spinning" : ""}`}>
                                    <svg className="disc__ring" viewBox="0 0 200 200" aria-hidden="true">
                                        <defs>
                                            <path
                                                id="disc-arc"
                                                d="M100,100 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0"
                                            />
                                        </defs>
                                        <text>
                                            <textPath href="#disc-arc" xlinkHref="#disc-arc">
                                                tidalBYTE &apos;26 ✦ the prizes ✦ side a ✦ 12:00:00 ✦
                                            </textPath>
                                        </text>
                                    </svg>
                                    <img
                                        src={STICKER("bunny")}
                                        alt=""
                                        aria-hidden="true"
                                        className="disc__sticker"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="disc__hub" aria-hidden="true" />
                            </div>

                            <div className="lcd" aria-live="polite">
                                <span className="lcd__row">
                                    <span>TRK {pad(index + 1)}</span>
                                    <span>{playing ? "▶ PLAY" : "❚❚ PAUSE"}</span>
                                </span>
                                <span className="lcd__title">{track.title}</span>
                            </div>

                            <div className="player__progress" aria-hidden="true">
                                <span ref={elapsedRef}>0:00</span>
                                <span ref={barRef} className="player__bar">
                                    <span className="player__fill" />
                                    <span className="player__knob" />
                                </span>
                                <span ref={remainRef}>-0:06</span>
                            </div>

                            <div className="player__controls">
                                <button
                                    type="button"
                                    className={`player__btn ${repeat ? "is-on" : ""}`}
                                    aria-pressed={repeat}
                                    aria-label="Repeat track"
                                    onClick={() => setRepeat((r) => !r)}
                                >
                                    <Icon d={PATHS.repeat} />
                                </button>
                                <button
                                    type="button"
                                    className="player__btn"
                                    aria-label="Previous prize"
                                    onClick={() => cue(index - 1, playing)}
                                >
                                    <Icon d={PATHS.prev} />
                                </button>
                                <button
                                    type="button"
                                    className="player__btn player__btn--main"
                                    aria-label={playing ? "Pause" : "Play"}
                                    onClick={() => setPlaying((p) => !p)}
                                >
                                    <Icon d={playing ? PATHS.pause : PATHS.play} />
                                </button>
                                <button
                                    type="button"
                                    className="player__btn"
                                    aria-label="Next prize"
                                    onClick={() => cue(index + 1, playing)}
                                >
                                    <Icon d={PATHS.next} />
                                </button>
                                <button
                                    type="button"
                                    className={`player__btn ${liked.has(index) ? "is-on" : ""}`}
                                    aria-pressed={liked.has(index)}
                                    aria-label={`Like ${track.title}`}
                                    onClick={toggleLike}
                                >
                                    {liked.has(index) ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
                                </button>
                            </div>
                        </div>

                        <Sticker
                            src={STICKER("pebble-headphones")}
                            width={120}
                            rotate={-12}
                            delay={0.3}
                            className="absolute -left-4 -top-12 z-10 md:-left-10 md:[--sticker-w:150px]"
                        />
                    </div>

                    {/* --------------------------------------- tracklist -- */}
                    <div>
                        <div className="tracklist__head label" aria-hidden="true">
                            <span>#</span>
                            <span>title</span>
                            <span>prize</span>
                        </div>
                        <ol className="tracklist">
                            {TRACKLIST.map((t, i) => {
                                const active = i === index;
                                return (
                                    <li key={t.title}>
                                        <button
                                            type="button"
                                            className={`tracklist__row ${active ? "is-active" : ""}`}
                                            aria-current={active ? "true" : undefined}
                                            onClick={() => cue(i)}
                                        >
                                            <span className="tracklist__no">
                                                {active && playing && !reduce ? (
                                                    <span className="eq" aria-hidden="true">
                                                        <i />
                                                        <i />
                                                        <i />
                                                    </span>
                                                ) : (
                                                    pad(i + 1)
                                                )}
                                            </span>
                                            <span className="tracklist__title">
                                                {t.title}
                                                <small>{t.kind}</small>
                                            </span>
                                            <span className="tracklist__prize">
                                                {liked.has(i) && (
                                                    <FaHeart aria-label="liked" className="mr-2 inline text-[10px]" />
                                                )}
                                                {t.prize}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                        <p className="mt-6 text-[12px] leading-relaxed text-shade-600">
                            ✦ prize amounts are announced closer to the event. sponsor challenges may
                            add bonus tracks.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Prizes;
