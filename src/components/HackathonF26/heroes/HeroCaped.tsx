import { cn, ui, pixelOutline } from "../ui";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { EVENT, NAV, fmtCentral } from "../event";
import RegisterButton from "../RegisterButton";
import CapedPenguin, { type CapeHandle } from "./caped/CapedPenguin";
import { Fog } from "./caped/fog";
import { Clouds, GiantPenguin, Plane, SkyGrid, Sparkles } from "./caped/scenery";
import { FAR, HEART, NEAR } from "./caped/skyline";
const skyBackground: CSSProperties = {
    "backgroundImage": "radial-gradient(55% 45% at 94% 2%, rgba(238, 245, 250, .95), rgba(238, 245, 250, 0) 70%), linear-gradient(180deg, #bcc8d2 0%, #c6d2dc 45%, #dce7f0 80%)"
};

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

const titleStyle = {
    "--ink-sh": pixelOutline("#3d4a52", ".045em"),
    textShadow: "var(--ink-sh)",
    "--glitch-one": ["var(--ink-sh)", "-0.12em 0 0 rgba(118, 163, 212, 0.95)", "0.12em 0 0 rgba(240, 192, 148, 0.95)"].join(", "),
    "--glitch-two": ["var(--ink-sh)", "0.08em 0.02em 0 rgba(242, 201, 160, 0.95)"].join(", "),
} as CSSProperties;

const IDLE = 0.14; // the cape's resting billow
const TILT = [-3, 2, -2, 3, -1, 2, -3, 1, -2, 0, 3, -2];
const NOISE = "#%&$@/*+=?01<>";
const WORD = [..."tidalBYTE"];
const YEAR = [..."'26"];
const STATIC_SCENE_QUERY = "(max-width: 760px), (prefers-reduced-motion: reduce)";
const prefersStaticScene = () => window.matchMedia(STATIC_SCENE_QUERY).matches;

const holdStill = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.motion === "paused";

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

/* Hovering the title sets off short glitch bursts: a few letters split into
   blue and peach, nudge, or flip to a stray glyph, then snap back. */
function useTitleGlitch(title: RefObject<HTMLHeadingElement>, staticScene: boolean) {
    useEffect(() => {
        const el = title.current;
        if (!el || staticScene) return;
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
    }, [title, staticScene]);
}

const Letter = ({ c, i }: { c: string; i: number }) => (
    <span className={cn(
        "group-[.is-in]/hero:animate-hero-letter group-[.is-in]/hero:[filter:blur(10px)]",
        "group-[.is-in]/hero:[transform:translateY(.28em)_scale(.9)]",
        "[&.is-g1]:[translate:.07em_-0.03em] [&.is-g1]:[text-shadow:var(--glitch-one)]",
        "[&.is-g2]:opacity-75 [&.is-g2]:[translate:-0.06em_.03em] [&.is-g2]:[text-shadow:var(--glitch-two)]",
        "motion-reduce:!opacity-100 motion-reduce:!filter-none motion-reduce:!transform-none",
        "caped-ch relative inline-block isolate [rotate:var(--r,_0deg)] opacity-0",
        "before:content-[attr(data-c)] before:absolute before:top-0 before:left-0 before:z-[-1]",
        "before:text-white before:[-webkit-text-stroke:0.27em_#ffffff] before:[text-shadow:none]",
        "before:[filter:drop-shadow(0_0.07em_0.05em_rgba(38,_48,_58,_0.22))] max-[760px]:!opacity-100",
        "max-[760px]:!filter-none max-[760px]:!transform-none",
    )} aria-hidden="true" data-c={c} style={{ "--i": i, "--r": `${TILT[i]}deg` } as CSSProperties}>
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
    const [staticScene, setStaticScene] = useState(prefersStaticScene);

    useTitleGlitch(titleRef, staticScene);

    useEffect(() => {
        const query = window.matchMedia(STATIC_SCENE_QUERY);
        const update = () => setStaticScene(query.matches);
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

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
        if (!root || !canvas || staticScene) return;
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
    }, [staticScene]);

    return (
        <section ref={rootRef} className={cn(ui.heroMotion, `caped group/hero ${shouldAnimate ? "is-in" : ""}`, "[--H:max(100vh,_680px)] supports-[height:100svh]:[--H:max(100svh,_680px)] [--ink:#333f48] [--ink-soft:#53616b] [--pastel:#bfd2dd]",
            "[--pastel-deep:#a2b8c6] relative h-full overflow-hidden isolate bg-[#bcc8d2] text-game-ink",
            "font-mono")} aria-label="tidalBYTE '26">
            <svg width="0" height="0" className="absolute" aria-hidden="true">
                <defs>
                    <path id="caped-spark" d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
                </defs>
            </svg>

            <div className={cn(
                "caped-sky absolute top-0 right-0 bottom-0 left-0 z-0",
            )} style={skyBackground}>
                <SkyGrid />
            </div>

            <header className={cn(
                "caped-nav py-6 px-[clamp(20px,_4vw,_56px)] absolute top-0 right-0 left-0 z-20 flex items-center",
                "justify-between",
            )}>
                <a className={cn(
                    ui.heroReveal,
                    "caped-logo caped-rv text-game-ink font-pixel text-[19px] tracking-[0.02em] opacity-0",
                    "max-[760px]:!opacity-100 max-[760px]:!filter-none max-[760px]:!transform-none",
                    "max-[760px]:text-[15px]",
                )} style={{ "--d": ".05s" } as CSSProperties} href="#top">
                    tidalBYTE
                </a>
                <nav className={cn(
                    ui.heroReveal,
                    "caped-links caped-rv gap-[clamp(18px,_3vw,_52px)] flex items-center opacity-0 max-[760px]:gap-3",
                    "max-[760px]:!opacity-100 max-[760px]:!filter-none max-[760px]:!transform-none",
                    "min-[761px]:max-[1200px]:gap-[18px]",
                )} style={{ "--d": ".12s" } as CSSProperties} aria-label="Sections">
                    {NAV.map((item) => (
                        <a key={item.href} className={cn(
                            "caped-link py-3 px-0 text-[#34404a] text-[13px] tracking-[0.3em] hover:text-game-ink",
                            "hover:[text-decoration:underline_wavy] hover:[text-decoration-thickness:1px]",
                            "hover:[text-underline-offset:7px] max-[760px]:hidden min-[761px]:max-[1200px]:text-[11px]",
                            "min-[761px]:max-[1200px]:tracking-[.12em]",
                        )} href={item.href}>
                            {item.label.toUpperCase()}
                        </a>
                    ))}
                    <details className="caped-mobile-menu hidden max-[760px]:block">
                        <summary className={cn(
                            "max-[760px]:py-3 max-[760px]:px-0 max-[760px]:cursor-pointer max-[760px]:text-[11px]",
                            "max-[760px]:tracking-[.08em] max-[760px]:focus-visible:[outline:2px_dashed_#333f48]",
                            "max-[760px]:focus-visible:[outline-offset:3px]",
                        )}>MENU</summary>
                        <nav className={cn(
                            "max-[760px]:p-2.5 max-[760px]:absolute max-[760px]:right-5 max-[760px]:top-[72px]",
                            "max-[760px]:grid max-[760px]:min-w-[180px] max-[760px]:border-2 max-[760px]:border-solid",
                            "max-[760px]:border-game-ink max-[760px]:rounded-xl max-[760px]:bg-[#f6f9fb]",
                            "max-[760px]:shadow-[4px_4px_0_#a2b8c6] max-[760px]:focus-visible:[outline:2px_dashed_#333f48]",
                            "max-[760px]:focus-visible:[outline-offset:3px]",
                        )} aria-label="Mobile sections">
                            {NAV.map((item) => (
                                <a className={cn(
                                    "max-[760px]:py-3 max-[760px]:px-4 max-[760px]:text-[13px]",
                                    "max-[760px]:focus-visible:[outline:2px_dashed_#333f48]",
                                    "max-[760px]:focus-visible:[outline-offset:3px]",
                                )} key={item.href} href={item.href}
                                    onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </details>
                    <RegisterButton
                        variant="nav"
                        soonTag={false}
                        icon={
                            <svg className="w-3.5 h-3.5 [shape-rendering:crispEdges]" viewBox="0 0 7 7" aria-hidden="true">
                                <path fill="#5b8fc4" d={HEART} />
                            </svg>
                        }
                    />
                </nav>
            </header>

            <div ref={depth(3)} className={cn(
                "caped-layer caped-layer--clouds-back absolute top-0 right-0 bottom-0 left-0 pointer-events-none",
                "z-[1]",
            )} aria-hidden="true">
                <Clouds />
            </div>
            <div ref={depth(4)} className={cn(
                "caped-layer caped-layer--sparkles absolute top-0 right-0 bottom-0 left-0 pointer-events-none",
                "z-[1]",
            )} aria-hidden="true">
                <Sparkles />
            </div>
            {/* no parallax: the giant stays put while the city moves */}
            <div className={cn(
                "group-[.is-in]/hero:animate-hero-giant motion-reduce:!opacity-100 motion-reduce:!filter-none motion-reduce:!transform-none",
                "caped-giant-wrap absolute top-[calc(var(--H)_*_-0.03)] left-1/2 z-[2] w-[calc(var(--H)_*_1.18)]",
                "ml-[calc(var(--H)_*_-0.59)] opacity-0 max-[760px]:!opacity-100 max-[760px]:!filter-none",
                "max-[760px]:!transform-none",
            )} aria-hidden="true">
                <GiantPenguin />
            </div>
            <canvas ref={fogRef} className={cn(
                "group-[.is-in]/hero:animate-hero-fog motion-reduce:!opacity-100 motion-reduce:!filter-none motion-reduce:!transform-none",
                "caped-fog absolute top-0 right-0 bottom-0 left-0 z-[3] w-full h-full opacity-0",
                "pointer-events-none max-[760px]:hidden",
            )} aria-hidden="true" />
            <div ref={depth(8)} className={cn(
                "caped-layer caped-layer--clouds-front absolute top-0 right-0 bottom-0 left-0",
                "pointer-events-none z-[4] opacity-[.92]",
            )} aria-hidden="true">
                <Clouds front />
            </div>
            <div ref={depth(6)} className="caped-layer caped-layer--plane absolute top-0 right-0 bottom-0 left-0 pointer-events-none z-[4]" aria-hidden="true">
                <Plane />
            </div>

            <div className={cn(
                "caped-city caped-city--far absolute bottom-[58px] left-0 w-full h-[calc(var(--H)_*_0.4)]",
                "pointer-events-none z-[5]",
            )} aria-hidden="true">
                <svg className="block w-full h-full overflow-visible" viewBox="-400 0 2400 420" preserveAspectRatio="xMidYMax slice">
                    {FAR}
                </svg>
            </div>
            <div className={cn(
                "caped-city caped-city--near absolute bottom-[58px] left-0 w-full h-[calc(var(--H)_*_0.4)]",
                "pointer-events-none z-[7]",
            )}>
                <svg className="block w-full h-full overflow-visible"
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

            <div className={cn(
                "caped-content py-0 px-5 absolute top-[calc(var(--H)_*_0.31)] right-0 left-0 z-10 flex flex-col",
                "items-center text-center pointer-events-none",
            )}>
                {/* <p className="caped-eyebrow caped-rv" style={{ "--d": ".2s" } as CSSProperties}>TEXAS A&amp;M · TIDAL PRESENTS</p> */}
                <h1 style={titleStyle} ref={titleRef} className={cn(
                    "caped-title mx-0 ",
                    "mt-[0.38em] mb-[0.48em] text-[#bdd0da] font-pixel",
                    "text-[clamp(1.45rem,_7vw,_calc(var(--H)_*_0.1))] font-normal leading-[1.1] tracking-[0.08em]",
                    " whitespace-nowrap cursor-default pointer-events-auto",
                )}>
                    <span className="sr-only">tidalBYTE &apos;26</span>
                    {WORD.map((c, i) => (
                        <Letter key={i} c={c} i={i} />
                    ))}
                    <span className={cn(
                        "caped-year inline-block text-[0.58em] tracking-[0.06em] [rotate:-9deg]",
                        "[translate:0.15em_-0.6em]",
                    )} aria-hidden="true">
                        {YEAR.map((c, j) => (
                            <Letter key={j} c={c} i={WORD.length + j} />
                        ))}
                    </span>
                </h1>
                <div className={cn(
                    "caped-pills gap-3.5 flex flex-wrap justify-center max-[760px]:gap-1.5 max-[760px]:flex-nowrap",
                    "max-[760px]:w-[min(100%,_340px)]",
                )}>
                    <span className={cn(
                        ui.heroReveal,
                        "caped-pill caped-rv py-3 px-6 border-2 border-solid border-game-ink",
                        "rounded-[999px] bg-[rgba(240,_246,_251,_0.9)] shadow-[3px_3px_0_#a2b8c6] text-[13px]",
                        "tracking-[0.24em] opacity-0 max-[760px]:py-[9px] max-[760px]:px-2 max-[760px]:!opacity-100",
                        "max-[760px]:!filter-none max-[760px]:!transform-none max-[760px]:text-[11px]",
                        "max-[760px]:tracking-[0.02em] max-[760px]:text-center max-[760px]:whitespace-nowrap",
                    )} style={{ "--d": ".95s" } as CSSProperties}>
                        <span className="caped-date-full max-[760px]:hidden">{EVENT.date.toUpperCase()}</span>
                        <span className="caped-date-short hidden max-[760px]:inline">
                            {fmtCentral(EVENT.startsAt, { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                        </span>
                    </span>
                    <span className={cn(
                        ui.heroReveal,
                        "caped-pill caped-rv py-3 px-6 border-2 border-solid border-game-ink rounded-[999px]",
                        "bg-[rgba(240,_246,_251,_0.9)] shadow-[3px_3px_0_#a2b8c6] text-[13px] tracking-[0.24em]",
                        "opacity-0 max-[760px]:py-[9px] max-[760px]:px-2 max-[760px]:!opacity-100",
                        "max-[760px]:!filter-none max-[760px]:!transform-none max-[760px]:text-[11px]",
                        "max-[760px]:tracking-[0.02em] max-[760px]:text-center max-[760px]:whitespace-nowrap",
                    )} style={{ "--d": "1.05s" } as CSSProperties}>{EVENT.room}</span>
                    <span className={cn(
                        ui.heroReveal,
                        "caped-pill caped-rv py-3 px-6 border-2 border-solid border-game-ink rounded-[999px]",
                        "bg-[rgba(240,_246,_251,_0.9)] shadow-[3px_3px_0_#a2b8c6] text-[13px] tracking-[0.24em]",
                        "opacity-0 max-[760px]:py-[9px] max-[760px]:px-2 max-[760px]:!opacity-100",
                        "max-[760px]:!filter-none max-[760px]:!transform-none max-[760px]:text-[11px]",
                        "max-[760px]:tracking-[0.02em] max-[760px]:text-center max-[760px]:whitespace-nowrap",
                    )} style={{ "--d": "1.15s" } as CSSProperties}>{EVENT.hours} HOURS</span>
                </div>
                <div className={cn(
                    ui.heroReveal,
                    "caped-cta caped-rv mt-[clamp(16px,_calc(var(--H)_*_0.03),_30px)] pointer-events-auto opacity-0",
                    "max-[760px]:!opacity-100 max-[760px]:!filter-none max-[760px]:!transform-none",
                )} style={{ "--d": "1.35s" } as CSSProperties}>
                    <RegisterButton variant="hero" label="REGISTER" soonTag={false} />
                </div>
            </div>

            <div className={cn(
                "caped-sidewalk absolute right-0 bottom-11 left-0 z-[8] h-3.5 [border-top-width:2.5px]",
                "[border-top-style:solid] [border-top-color:#333f48] [border-bottom-width:2px]",
                "[border-bottom-style:solid] [border-bottom-color:#5a6777] bg-[#b0c6ce]",
            )} />
            <div className={cn(
                "caped-road absolute right-0 bottom-0 left-0 z-[8] h-11",
                "bg-[linear-gradient(180deg,_#7b8a97,_#8e9da9)] after:content-[''] after:absolute after:top-1/2",
                "after:right-0 after:left-0 after:h-[5px] after:mt-[-2.5px]",
                "after:bg-[repeating-linear-gradient(90deg,_#e0c5ab_0_140px,_transparent_140px_250px)]",
            )} />
        </section>
    );
};

export default HeroCaped;
