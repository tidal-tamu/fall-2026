import { useEffect, useMemo, useRef, useState } from "react";
import Matter from "matter-js";

/* -------------------------------------------------------------------------- */
/*  Throwable prize cards.                                                     */
/*                                                                            */
/*  Rigid bodies simulated by matter-js, but *rendered as DOM nodes* rather    */
/*  than into a canvas. Canvas would mean re-rasterising Press Start 2P every  */
/*  frame at arbitrary rotations, which turns a crisp pixel font to mush; DOM  */
/*  keeps the type sharp and the cards selectable by the accessibility tree.   */
/*                                                                            */
/*  matter-js gives pick-and-throw for free via MouseConstraint — the release  */
/*  velocity carries over, so a flick actually flings the card.                */
/* -------------------------------------------------------------------------- */

type CardSpec = {
    text: string;
    w: number;
    h: number;
    ink?: boolean; // black card, white type
    size?: number; // font-size px
};

const CARDS: CardSpec[] = [
    { text: "24 HOURS", w: 168, h: 62, size: 11 },
    { text: "MSC BETHANCOURT", w: 232, h: 62, size: 9 },
    { text: "FREE FOOD", w: 176, h: 62, ink: true, size: 11 },
    { text: "BEGINNER FRIENDLY", w: 244, h: 62, size: 9 },
    { text: "PRIZES", w: 140, h: 62, ink: true, size: 11 },
    { text: "FALL 2026", w: 168, h: 62, size: 11 },
];

const WALL = 400; // thickness of the off-screen bounds
/* Bounds are pulled in past the hairline frame (inset-3 / md:inset-5, so 12px
   then 20px) on every side. At the viewport edge the cards slid underneath the
   rule and got clipped by it; 24px keeps the whole pile inside the sheet. */
const EDGE_INSET = 24;

/* Cards are sized for a desktop hero. Left at full size on a phone they are
   nearly viewport-wide and stack into a wall that buries the machine, so both
   the scale and the count come down on narrow screens. Bucketed rather than
   continuous so an incidental resize does not rebuild the whole simulation. */
type Bucket = "sm" | "md" | "lg";
const bucketFor = (w: number): Bucket =>
    w < 640 ? "sm" : w < 1024 ? "md" : "lg";

const LAYOUT: Record<Bucket, { scale: number; keep: number }> = {
    sm: { scale: 0.54, keep: 4 },
    md: { scale: 0.78, keep: 5 },
    lg: { scale: 1, keep: CARDS.length },
};

interface PrizeCardsProps {
    /** Skip the whole simulation (touch devices, reduced motion). */
    enabled?: boolean;
}

const PrizeCards = ({ enabled = true }: PrizeCardsProps) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
    const [dragging, setDragging] = useState(false);

    // Respect the OS reduced-motion setting: tumbling physics is exactly the
    // kind of vestibular motion that flag exists to suppress.
    const reduced = useMemo(
        () =>
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
        [],
    );

    const [bucket, setBucket] = useState<Bucket>(() =>
        typeof window === "undefined" ? "lg" : bucketFor(window.innerWidth),
    );
    useEffect(() => {
        const onResize = () => setBucket(bucketFor(window.innerWidth));
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* Card specs with the responsive scale already baked in, so the physics
       bodies and the DOM nodes can never disagree about a card's size. */
    const cards = useMemo(() => {
        const { scale, keep } = LAYOUT[bucket];
        return CARDS.slice(0, keep).map((c) => ({
            ...c,
            w: Math.round(c.w * scale),
            h: Math.round(c.h * scale),
            size: Math.max(7, Math.round((c.size ?? 10) * scale)),
        }));
    }, [bucket]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host || !enabled || reduced || !cards.length) return;

        const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } =
            Matter;

        const rect = host.getBoundingClientRect();
        let W = rect.width;
        let H = rect.height;

        const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0022 } });
        const world = engine.world;

        /* --- bounds: floor, ceiling and two side walls ---------------------- */
        // Each wall's *inner face* lands on EDGE_INSET, so nothing can drift
        // out under the frame rule. The ceiling stays far overhead to let the
        // cards drop in from off-screen.
        const makeWalls = (w: number, h: number) => [
            Bodies.rectangle(w / 2, h - EDGE_INSET + WALL / 2, w * 3, WALL, {
                isStatic: true,
            }),
            Bodies.rectangle(w / 2, -WALL / 2 - h, w * 3, WALL, {
                isStatic: true,
            }),
            Bodies.rectangle(EDGE_INSET - WALL / 2, h / 2, WALL, h * 3, {
                isStatic: true,
            }),
            Bodies.rectangle(w - EDGE_INSET + WALL / 2, h / 2, WALL, h * 3, {
                isStatic: true,
            }),
        ];
        let walls = makeWalls(W, H);
        Composite.add(world, walls);

        /* --- the cards ---------------------------------------------------- */
        // Spread across the full width so they settle into one shallow layer
        // along the bottom edge rather than stacking into two tall towers.
        const bodies = cards.map((c, i) => {
            // Spawn inside the same bounds the walls enforce, so nothing has to
            // be shoved back in on the first few ticks.
            const lo = EDGE_INSET + c.w / 2;
            const hi = Math.max(lo, W - EDGE_INSET - c.w / 2);
            const lane = (i + 0.5) / cards.length;
            const x = Math.min(
                hi,
                Math.max(lo, lo + (hi - lo) * lane + (Math.random() - 0.5) * 60),
            );
            const y = -80 - i * 55 - Math.random() * 40;
            return Bodies.rectangle(x, y, c.w, c.h, {
                chamfer: { radius: 0 },
                restitution: 0.14,
                friction: 0.72,
                // Low air drag: at 0.016 the cards reached terminal velocity
                // almost immediately and took several seconds to drift in.
                frictionAir: 0.006,
                density: 0.0016,
                angle: (Math.random() - 0.5) * 0.9,
            });
        });
        Composite.add(world, bodies);

        /* Settle the pile synchronously before the first paint. Letting them
           free-fall on load meant the hero appeared empty for a beat, and any
           frame throttling (background tab, hidden pane) left them stranded
           mid-air. Stepping the engine here means they are always already
           stacked along the bottom edge when the hero fades in. */
        for (let i = 0; i < 260; i++) Engine.update(engine, 1000 / 60);

        /* Tumbling during the drop leaves some cards resting upside-down, which
           is fine for a symmetrical logo but not for words. Straighten them to
           a slight tilt and let a short second settle re-seat the stack. They
           are still free to spin once the visitor throws them. */
        bodies.forEach((b) => {
            Body.setAngle(b, (Math.random() - 0.5) * 0.18);
            Body.setAngularVelocity(b, 0);
        });
        for (let i = 0; i < 40; i++) Engine.update(engine, 1000 / 60);

        /* --- pick and throw ------------------------------------------------ */
        const mouse = Mouse.create(host);
        // matter-js binds its own wheel handlers, which would swallow page
        // scrolling over the hero. Drop them; we only want drag. `mousewheel`
        // is real at runtime but missing from @types/matter-js.
        const wheelHandler = (mouse as unknown as { mousewheel: EventListener })
            .mousewheel;
        mouse.element.removeEventListener("wheel", wheelHandler);
        mouse.element.removeEventListener("DOMMouseScroll", wheelHandler);

        const mc = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.16, damping: 0.06, render: { visible: false } },
        });
        Composite.add(world, mc);

        const onStart = () => setDragging(true);
        const onEnd = () => setDragging(false);
        Matter.Events.on(mc, "startdrag", onStart);
        Matter.Events.on(mc, "enddrag", onEnd);

        /* --- sync bodies → DOM every frame --------------------------------- */
        let raf = 0;
        const sync = () => {
            for (let i = 0; i < bodies.length; i++) {
                const el = nodesRef.current[i];
                if (!el) continue;
                const b = bodies[i];
                el.style.transform = `translate3d(${b.position.x - cards[i].w / 2}px, ${
                    b.position.y - cards[i].h / 2
                }px, 0) rotate(${b.angle}rad)`;
            }
            raf = requestAnimationFrame(sync);
        };
        raf = requestAnimationFrame(sync);

        const runner = Runner.create();
        Runner.run(runner, engine);

        /* --- keep the bounds in step with the viewport --------------------- */
        const onResize = () => {
            const r = host.getBoundingClientRect();
            W = r.width;
            H = r.height;
            Composite.remove(world, walls);
            walls = makeWalls(W, H);
            Composite.add(world, walls);
            // Nudge anything now outside the box back into view.
            bodies.forEach((b) => {
                if (b.position.x > W || b.position.y > H) {
                    Body.setPosition(b, {
                        x: Math.min(b.position.x, W - 60),
                        y: Math.min(b.position.y, H - 60),
                    });
                    Body.setVelocity(b, { x: 0, y: 0 });
                }
            });
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            Matter.Events.off(mc, "startdrag", onStart);
            Matter.Events.off(mc, "enddrag", onEnd);
            Runner.stop(runner);
            Composite.clear(world, false);
            Engine.clear(engine);
        };
    }, [enabled, reduced, cards]);

    if (!enabled || reduced) return null;

    return (
        <div
            ref={hostRef}
            aria-hidden="true"
            className={`absolute inset-0 z-20 overflow-hidden claw-cursor ${
                dragging ? "claw-cursor-grabbing" : ""
            }`}
        >
            {cards.map((c, i) => (
                <div
                    key={c.text}
                    ref={(el) => {
                        nodesRef.current[i] = el;
                    }}
                    className={`prize-card font-pixel ${
                        c.ink ? "prize-card--ink" : ""
                    } ${dragging ? "prize-card--held" : ""}`}
                    style={{
                        width: c.w,
                        height: c.h,
                        fontSize: c.size,
                        // parked off-screen until the first physics tick writes
                        // a real transform, so nothing flashes at 0,0
                        transform: "translate3d(-9999px,-9999px,0)",
                    }}
                >
                    {c.text}
                </div>
            ))}
        </div>
    );
};

export default PrizeCards;
