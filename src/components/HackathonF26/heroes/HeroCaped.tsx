import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { EVENT, NAV } from "../event";
import RegisterButton from "../RegisterButton";
import CapedPenguin, { type CapeHandle } from "./caped/CapedPenguin";
import { Fog } from "./caped/fog";
import { GiantPenguin, SkyGrid, Sparkles } from "./caped/scenery";
import { FAR, HEART, NEAR } from "./caped/skyline";
import "./hero-caped.css";

/* -------------------------------------------------------------------------- */
/*  Caped: a pastel comic city at dusk. A giant penguin looms, still, in the   */
/*  mist (move the cursor and the mist parts), sparkles twinkle, and           */
/*  on the lowest roof our caped penguin stands guard with a fish for a sword. */
/*  Hover it and the cape billows: no powers needed.                          */
/*                                                                            */
/*  One animation loop drives the parallax, the cape and the mist, and only    */
/*  while the hero is on screen. Touch gets no parallax, reduced motion gets   */
/*  a still frame.                                                            */
/* -------------------------------------------------------------------------- */

const IDLE = 0.14; // the cape's resting billow
const TILT = [-3, 2, -2, 3, -1, 2, -3, 1, -2, 0, 3, -2];
const NOISE = "#%&$@/*+=?01<>";
const WORD = [..."tidalBYTE"];
const YEAR = [..."'26"];

const holdStill = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.motion === "paused";

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

/* Hovering the title sets off short glitch bursts: a few letters split into
   blue and peach, nudge, or flip to a stray glyph, then snap back. */
function useTitleGlitch(title: RefObject<HTMLHeadingElement>) {
    useEffect(() => {
        const el = title.current;
        if (!el) return;
        const chars = [...el.querySelectorAll<HTMLElement>(".caped-ch")];
        const orig = chars.map((c) => c.textContent ?? "");
        let interval = 0, frame = 0, busy = false;
        const restore = () => {
            chars.forEach((c, i) => {
                c.classList.remove("is-g1", "is-g2");
                if (c.textContent !== orig[i]) c.textContent = c.dataset.c = orig[i];
            });
            el.style.translate = "";
        };
        const burst = () => {
            if (busy) return;
            busy = true;
            let f = 0;
            const frames = 5 + Math.floor(Math.random() * 3);
            const step = () => {
                restore();
                if (f++ >= frames) return void (busy = false);
                for (let k = 1 + Math.floor(Math.random() * 3); k > 0; k--) {
                    const c = pick(chars);
                    c.classList.add(Math.random() < 0.6 ? "is-g1" : "is-g2");
                    if (Math.random() < 0.28) c.textContent = c.dataset.c = pick([...NOISE]);
                }
                if (Math.random() < 0.3) el.style.translate = `${((Math.random() - 0.5) * 0.07).toFixed(3)}em 0`;
                frame = window.setTimeout(step, 55 + Math.random() * 45);
            };
            step();
        };
        const enter = () => {
            if (holdStill()) return;
            burst();
            clearInterval(interval);
            interval = window.setInterval(burst, 2000 + Math.random() * 600);
        };
        const leave = () => clearInterval(interval);
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        return () => {
            el.removeEventListener("pointerenter", enter);
            el.removeEventListener("pointerleave", leave);
            clearInterval(interval);
            clearTimeout(frame);
            restore();
        };
    }, [title]);
}

const Letter = ({ c, i }: { c: string; i: number }) => (
    <span className="caped-ch" aria-hidden="true" data-c={c} style={{ "--i": i, "--r": `${TILT[i]}deg` } as CSSProperties}>
        {c}
    </span>
);

const HeroCaped = ({ shouldAnimate = false }: { shouldAnimate?: boolean }) => {
    const rootRef = useRef<HTMLElement>(null);
    const fogRef = useRef<HTMLCanvasElement>(null);
    const capeRef = useRef<CapeHandle>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const layers = useRef(new Map<HTMLElement, number>());
    const billowTarget = useRef(IDLE);
    const [heroOn, setHeroOn] = useState(false);

    useTitleGlitch(titleRef);

    const depth = (d: number) => (el: HTMLElement | null) => {
        if (el) layers.current.set(el, d);
    };

    const setOn = (on: boolean) => {
        billowTarget.current = on ? 1 : IDLE;
        setHeroOn(on);
    };

    // touch has no hover: a tap suits up for a couple of seconds
    const tapTimer = useRef(0);
    const tap = () => {
        setOn(true);
        clearTimeout(tapTimer.current);
        tapTimer.current = window.setTimeout(() => setOn(false), 2400);
    };

    useEffect(() => {
        const root = rootRef.current;
        const canvas = fogRef.current;
        if (!root || !canvas) return;
        const fog = new Fog(canvas);
        const fit = () => {
            const r = root.getBoundingClientRect();
            fog.layout(r.width, r.height);
        };
        fit();
        const sized = new ResizeObserver(fit);
        sized.observe(root);

        /* Parallax eases toward the pointer; the mist opens wherever it goes. */
        let tx = 0, ty = 0, cx = 0, cy = 0, billow = IDLE;
        const poke = (e: PointerEvent) => {
            const r = root.getBoundingClientRect();
            fog.poke(e.clientX - r.left, e.clientY - r.top, performance.now());
        };
        const onMove = (e: PointerEvent) => {
            if (e.pointerType === "mouse") {
                tx = (e.clientX / window.innerWidth - 0.5) * -2;
                ty = (e.clientY / window.innerHeight - 0.5) * -2;
            }
            poke(e);
        };
        root.addEventListener("pointermove", onMove, { passive: true });
        root.addEventListener("pointerdown", poke, { passive: true });

        let raf = 0;
        const frame = (now: number) => {
            const still = holdStill();
            const t = still ? 0 : now / 1000;
            billow += (billowTarget.current - billow) * 0.06;
            if (!still) {
                cx += (tx - cx) * 0.04;
                cy += (ty - cy) * 0.04;
                layers.current.forEach((d, el) => {
                    el.style.translate = `${(cx * d).toFixed(2)}px ${(cy * d * 0.5).toFixed(2)}px`;
                });
            }
            capeRef.current?.draw(t, billow);
            fog.draw(t, now, still);
            raf = requestAnimationFrame(frame);
        };
        const run = () => {
            if (!raf) raf = requestAnimationFrame(frame);
        };
        const halt = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };
        const seen = new IntersectionObserver(([e]) => (e.isIntersecting ? run() : halt()));
        seen.observe(root);

        return () => {
            halt();
            seen.disconnect();
            sized.disconnect();
            root.removeEventListener("pointermove", onMove);
            root.removeEventListener("pointerdown", poke);
            clearTimeout(tapTimer.current);
        };
    }, []);

    return (
        <section ref={rootRef} className={`caped ${shouldAnimate ? "is-in" : ""}`} aria-label="tidalBYTE '26">
            <svg width="0" height="0" className="absolute" aria-hidden="true">
                <defs>
                    <path id="caped-spark" d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
                </defs>
            </svg>

            <div className="caped-sky">
                <SkyGrid />
            </div>

            <header className="caped-nav">
                <a className="caped-logo caped-rv" style={{ "--d": ".05s" } as CSSProperties} href="#top">
                    tidalBYTE
                </a>
                <nav className="caped-links caped-rv" style={{ "--d": ".12s" } as CSSProperties} aria-label="Sections">
                    {NAV.map((item) => (
                        <a key={item.href} className="caped-link" href={item.href}>
                            {item.label.toUpperCase()}
                        </a>
                    ))}
                    <RegisterButton
                        className="caped-register"
                        soonTag={false}
                        icon={
                            <svg viewBox="0 0 7 7" aria-hidden="true">
                                <path fill="#5b8fc4" d={HEART} />
                            </svg>
                        }
                    />
                </nav>
            </header>

            <div ref={depth(4)} className="caped-layer caped-layer--sparkles" aria-hidden="true">
                <Sparkles />
            </div>
            {/* no parallax: the giant stays put while the city moves */}
            <div className="caped-giant-wrap" aria-hidden="true">
                <GiantPenguin />
            </div>
            <canvas ref={fogRef} className="caped-fog" aria-hidden="true" />

            <div className="caped-city caped-city--far" aria-hidden="true">
                <svg viewBox="-400 0 2400 420" preserveAspectRatio="xMidYMax slice">
                    {FAR}
                </svg>
            </div>
            <div className="caped-city caped-city--near">
                <svg
                    viewBox="-400 0 2400 420"
                    preserveAspectRatio="xMidYMax slice"
                    role="img"
                    aria-label="A small caped penguin hero holding a fish, standing on a rooftop"
                >
                    <defs>
                        <pattern id="caped-dots" width="5" height="5" patternUnits="userSpaceOnUse">
                            <circle cx="2.5" cy="2.5" r="1.05" fill="#262c32" opacity=".3" />
                        </pattern>
                        <pattern id="caped-cape-dots" width="5" height="5" patternUnits="userSpaceOnUse">
                            <circle cx="2.5" cy="2.5" r="1" fill="#7aa9d3" />
                        </pattern>
                    </defs>
                    <g strokeLinejoin="round" strokeLinecap="round">
                        {NEAR}
                    </g>
                    <CapedPenguin
                        ref={capeRef}
                        x={800}
                        y={311}
                        on={heroOn}
                        onEnter={() => setOn(true)}
                        onLeave={() => setOn(false)}
                        onTap={tap}
                    />
                </svg>
            </div>

            <div className="caped-content">
                <h1 ref={titleRef} className="caped-title">
                    <span className="sr-only">tidalBYTE &apos;26</span>
                    {WORD.map((c, i) => (
                        <Letter key={i} c={c} i={i} />
                    ))}
                    <span className="caped-year" aria-hidden="true">
                        {YEAR.map((c, j) => (
                            <Letter key={j} c={c} i={WORD.length + j} />
                        ))}
                    </span>
                </h1>
                <div className="caped-pills">
                    {[EVENT.date.toUpperCase(), EVENT.room, `${EVENT.hours} HOURS`].map((pill, i) => (
                        <span key={pill} className="caped-pill caped-rv" style={{ "--d": `${0.95 + i * 0.1}s` } as CSSProperties}>
                            {pill}
                        </span>
                    ))}
                </div>
                <div className="caped-cta caped-rv" style={{ "--d": "1.35s" } as CSSProperties}>
                    <RegisterButton className="caped-apply" label="APPLY" soonTag={false} />
                </div>
            </div>

            <div className="caped-sidewalk" />
            <div className="caped-road" />
        </section>
    );
};

export default HeroCaped;
