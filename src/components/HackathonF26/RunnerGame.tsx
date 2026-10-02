import { useEffect, useRef } from "react";
import { BUG, COFFEE, PENGUIN, WARNING, bake } from "./runnerSprites";

/* -------------------------------------------------------------------------- */
/*  A penguin runner, after the offline dino game. The penguin waddles along   */
/*  the hero's ground line until someone clicks or taps the lane; then it's a  */
/*  run: jump the bugs and warnings, grab coffee, chase the high score.        */
/*                                                                            */
/*  Space only belongs to the game while the canvas has focus, so the page     */
/*  still scrolls normally for everyone who isn't playing.                     */
/* -------------------------------------------------------------------------- */

const HI_KEY = "f26-runner-hi";
const MID = "#6B6862";
const DEEP = "#34506F";
const INK = "#111110";
const FONT = '"Press Start 2P", monospace';

/* Tuned for 3px art pixels; everything scales with the art on small screens. */
const BASE_SPEED = 380;
const MAX_SPEED = 860;
const ACCEL = 9;
const GRAVITY = 2600;
const JUMP = 840;
const JUMP_CUT = 320; // releasing early clips the jump to this upward speed
const COFFEE_POINTS = 25;

type Phase = "idle" | "playing" | "over";
type Kind = "bug" | "bugs" | "warn";
type Obstacle = { x: number; kind: Kind };
type Pickup = { x: number; lift: number; taken: boolean };
type Pop = { x: number; y: number; t: number };

/* Size in art pixels. "bugs" is two bugs walking in a pair. */
const DIMS: Record<Kind, { w: number; h: number }> = {
    bug: { w: 12, h: 8 },
    bugs: { w: 26, h: 8 },
    warn: { w: 13, h: 12 },
};

const pad5 = (n: number) => String(Math.floor(n)).padStart(5, "0");
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

function readHi() {
    try {
        return Number(localStorage.getItem(HI_KEY)) || 0;
    } catch {
        return 0;
    }
}

function saveHi(n: number) {
    try {
        localStorage.setItem(HI_KEY, String(n));
    } catch {
        /* private mode: the high score just won't survive a reload */
    }
}

/* The dock's pause button and the OS setting both mean "hold still". The
   game itself still runs when asked; only the idle amble stops. */
const holdStill = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.motion === "paused";

const RunnerGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const art = {
            runA: bake(PENGUIN.runA),
            runB: bake(PENGUIN.runB),
            jump: bake(PENGUIN.jump),
            dazed: bake(PENGUIN.dazed),
            bugA: bake(BUG.a),
            bugB: bake(BUG.b),
            warn: bake(WARNING),
            coffee: bake(COFFEE),
        };
        const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;

        /* --- layout ------------------------------------------------------- */
        let W = 0;
        let H = 0;
        let P = 3; // CSS px per art pixel
        let S = 1; // physics scale relative to the 3px tuning
        let groundY = 0;
        let pebbleX = 0;
        let dpr = 1;

        const fit = () => {
            const r = canvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = r.width;
            H = r.height;
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            P = W < 640 ? 2 : 3;
            S = P / 3;
            groundY = Math.round(H - 8 * P);
            pebbleX = Math.round(Math.max(24, W * 0.08));
        };
        fit();

        /* Ground speckle, one tile repeated as the ground scrolls. */
        const TILE = 480;
        const specks = Array.from({ length: 22 }, () => ({
            x: Math.random() * TILE,
            y: rand(6, 20),
            w: Math.random() < 0.3 ? 2 : 1,
        }));

        /* --- state -------------------------------------------------------- */
        const g = {
            phase: "idle" as Phase,
            focused: false,
            lift: 0,
            vy: 0,
            speed: 0,
            score: 0,
            hi: readHi(),
            groundOff: 0,
            walkT: 0,
            overAt: 0,
            nextGap: 0,
            nextCoffee: 0,
            obstacles: [] as Obstacle[],
            pickups: [] as Pickup[],
            pops: [] as Pop[],
        };

        const jump = () => {
            if (g.lift > 0 || g.vy !== 0) return;
            g.vy = -JUMP * S;
        };

        const start = () => {
            g.phase = "playing";
            g.speed = BASE_SPEED * S;
            g.score = 0;
            g.lift = 0;
            g.vy = 0;
            g.obstacles = [];
            g.pickups = [];
            g.pops = [];
            g.nextGap = W * 0.6;
            g.nextCoffee = W * 1.4;
            jump();
        };

        const press = () => {
            if (g.phase === "playing") jump();
            else if (g.phase === "idle") start();
            // a beat of grace so the jump that crashed doesn't instantly restart
            else if (performance.now() - g.overAt > 400) start();
        };

        const release = () => {
            if (g.vy < -JUMP_CUT * S) g.vy = -JUMP_CUT * S;
        };

        /* --- simulation --------------------------------------------------- */
        const spawnObstacle = () => {
            const roll = Math.random();
            const kind: Kind =
                g.score > 120 && roll < 0.28 ? "bugs" : roll < 0.62 ? "bug" : "warn";
            g.obstacles.push({ x: W + 8, kind });
            g.nextGap = DIMS[kind].w * P + g.speed * rand(0.75, 1.55);
        };

        const crash = () => {
            g.phase = "over";
            g.overAt = performance.now();
            if (g.score > g.hi) {
                g.hi = Math.floor(g.score);
                saveHi(g.hi);
            }
        };

        const update = (dt: number) => {
            if (g.phase === "over") return;
            if (g.phase === "idle") {
                if (!holdStill()) {
                    g.groundOff += 46 * S * dt;
                    g.walkT += dt * 0.6;
                }
                return;
            }

            g.speed = Math.min(MAX_SPEED * S, g.speed + ACCEL * S * dt);
            const dx = g.speed * dt;
            g.groundOff += dx;
            g.walkT += dt * (g.speed / (BASE_SPEED * S));
            g.score += dx / (38 * S);

            if (g.lift > 0 || g.vy !== 0) {
                g.vy += GRAVITY * S * dt;
                g.lift = Math.max(0, g.lift - g.vy * dt);
                if (g.lift === 0) g.vy = 0;
            }

            g.obstacles.forEach((o) => (o.x -= dx));
            g.obstacles = g.obstacles.filter((o) => o.x + DIMS[o.kind].w * P > -8);
            g.nextGap -= dx;
            if (g.nextGap <= 0) spawnObstacle();

            g.pickups.forEach((c) => (c.x -= dx));
            g.pickups = g.pickups.filter((c) => !c.taken && c.x > -40);
            g.nextCoffee -= dx;
            if (g.nextCoffee <= 0) {
                g.pickups.push({ x: W + 8, lift: rand(36, 96) * S, taken: false });
                g.nextCoffee = g.speed * rand(3, 6);
            }

            g.pops.forEach((p) => (p.t += dt));
            g.pops = g.pops.filter((p) => p.t < 0.8);

            /* Hitboxes are inset an art pixel or two: grazing an antenna
               shouldn't end a run. */
            const top = groundY - g.lift - 15 * P;
            const me = {
                l: pebbleX + 2 * P,
                r: pebbleX + 14 * P,
                t: top + 2 * P,
                b: groundY - g.lift - P,
            };
            for (const o of g.obstacles) {
                const d = DIMS[o.kind];
                const hit =
                    me.r > o.x + P &&
                    me.l < o.x + (d.w - 1) * P &&
                    me.b > groundY - (d.h - 2) * P;
                if (hit) return crash();
            }
            for (const c of g.pickups) {
                const cTop = groundY - c.lift - 10 * P;
                const got =
                    me.r > c.x && me.l < c.x + 10 * P && me.b > cTop && me.t < cTop + 10 * P;
                if (got) {
                    c.taken = true;
                    g.score += COFFEE_POINTS;
                    g.pops.push({ x: c.x, y: cTop, t: 0 });
                }
            }
        };

        /* --- drawing ------------------------------------------------------ */
        const sprite = (s: { img: HTMLCanvasElement; w: number; h: number }, x: number, y: number) =>
            ctx.drawImage(s.img, Math.round(x), Math.round(y), s.w * P, s.h * P);

        const text = (str: string, x: number, y: number, size: number, color: string) => {
            ctx.font = `${size}px ${FONT}`;
            ctx.fillStyle = color;
            ctx.fillText(str, Math.round(x), Math.round(y));
        };

        const draw = (now: number) => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.imageSmoothingEnabled = false;
            ctx.textBaseline = "top";

            // ground line + scrolling speckle
            ctx.fillStyle = INK;
            ctx.fillRect(0, groundY, W, 2);
            ctx.fillStyle = "#85827A";
            const off = g.groundOff % TILE;
            for (let k = 0; k * TILE - off < W; k++) {
                for (const s of specks) {
                    const x = k * TILE + s.x - off;
                    if (x > -2 && x < W) ctx.fillRect(Math.round(x), groundY + s.y * S, s.w, 2);
                }
            }

            const step = Math.floor(g.walkT / 0.11) % 2 === 0;
            for (const c of g.pickups) sprite(art.coffee, c.x, groundY - c.lift - 10 * P);
            for (const o of g.obstacles) {
                const y = groundY - DIMS[o.kind].h * P + 1;
                if (o.kind === "warn") sprite(art.warn, o.x, y);
                else {
                    sprite(step ? art.bugA : art.bugB, o.x, y);
                    if (o.kind === "bugs") sprite(step ? art.bugB : art.bugA, o.x + 14 * P, y);
                }
            }

            const pebble =
                g.phase === "over"
                    ? art.dazed
                    : g.lift > 0
                      ? art.jump
                      : g.phase === "idle" && holdStill()
                        ? art.runA
                        : step
                          ? art.runA
                          : art.runB;
            sprite(pebble, pebbleX, groundY - g.lift - 15 * P + 1);

            for (const p of g.pops) {
                ctx.globalAlpha = 1 - p.t / 0.8;
                text(`+${COFFEE_POINTS}`, p.x, p.y - p.t * 40 * S, 8 * S + 2, DEEP);
                ctx.globalAlpha = 1;
            }

            // HI 00042  00017, top right like the original
            const size = Math.round(7 * S + 5);
            ctx.font = `${size}px ${FONT}`;
            ctx.textAlign = "right";
            const score = pad5(g.score);
            const right = W - 14 * S;
            text(score, right, 10 * S, size, DEEP);
            text(`HI ${pad5(g.hi)}  `, right - ctx.measureText(score).width, 10 * S, size, MID);
            ctx.textAlign = "center";

            const blinkOn = holdStill() || Math.floor(now / 600) % 2 === 0;
            const cx = W / 2;
            const cy = Math.max(10 * S + size * 2, groundY - 70 * S);
            if (g.phase === "idle" && blinkOn) {
                const cue = g.focused ? "PRESS SPACE TO PLAY" : coarse ? "TAP TO PLAY" : "CLICK TO PLAY";
                text(cue, cx, cy, size, MID);
            } else if (g.phase === "over") {
                text("GAME OVER", cx, cy - size * 1.6, size + 2, INK);
                if (blinkOn) text(coarse ? "TAP TO RETRY" : "SPACE TO RETRY", cx, cy + 2, size - 2, MID);
            }
            ctx.textAlign = "left";
        };

        /* --- loop, paused whenever the hero is scrolled away -------------- */
        let raf = 0;
        let last = 0;
        const frame = (t: number) => {
            const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
            last = t;
            update(dt);
            draw(t);
            raf = requestAnimationFrame(frame);
        };
        const run = () => {
            if (raf) return;
            last = 0;
            raf = requestAnimationFrame(frame);
        };
        const halt = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        const seen = new IntersectionObserver(([e]) => (e.isIntersecting ? run() : halt()));
        seen.observe(canvas);
        const sized = new ResizeObserver(fit);
        sized.observe(canvas);

        /* --- input -------------------------------------------------------- */
        const JUMP_KEYS = new Set(["Space", "ArrowUp", "KeyW", "Enter"]);
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Escape") return canvas.blur();
            if (!JUMP_KEYS.has(e.code)) return;
            e.preventDefault(); // otherwise space scrolls the page mid-jump
            if (!e.repeat) press();
        };
        const onKeyUp = (e: KeyboardEvent) => {
            if (JUMP_KEYS.has(e.code)) release();
        };

        /* Mouse jumps on press. Touch waits for the finger to lift and checks
           it barely moved, so a swipe that starts on the lane still scrolls
           the page instead of making the penguin hop. */
        let touchStart: { x: number; y: number } | null = null;
        const onPointerDown = (e: PointerEvent) => {
            if (e.pointerType === "mouse") {
                if (e.button !== 0) return;
                press(); // the click itself focuses the canvas, arming space

            } else touchStart = { x: e.clientX, y: e.clientY };
        };
        const onPointerUp = (e: PointerEvent) => {
            if (e.pointerType === "mouse") return release();
            if (touchStart && Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y) < 12)
                press();
            touchStart = null;
        };
        const onPointerCancel = () => (touchStart = null);
        const onFocus = () => (g.focused = true);
        const onBlur = () => (g.focused = false);

        canvas.addEventListener("keydown", onKeyDown);
        canvas.addEventListener("keyup", onKeyUp);
        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerCancel);
        canvas.addEventListener("focus", onFocus);
        canvas.addEventListener("blur", onBlur);

        return () => {
            halt();
            seen.disconnect();
            sized.disconnect();
            canvas.removeEventListener("keydown", onKeyDown);
            canvas.removeEventListener("keyup", onKeyUp);
            canvas.removeEventListener("pointerdown", onPointerDown);
            canvas.removeEventListener("pointerup", onPointerUp);
            canvas.removeEventListener("pointercancel", onPointerCancel);
            canvas.removeEventListener("focus", onFocus);
            canvas.removeEventListener("blur", onBlur);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            tabIndex={0}
            role="application"
            aria-roledescription="mini game"
            aria-label="Penguin runner. Click or tap to start, then press space or tap to jump over bugs and grab coffee."
            className="runner-canvas block h-full w-full"
        />
    );
};

export default RunnerGame;
