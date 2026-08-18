import { useEffect, useRef } from "react";
import { useCoins } from "./coinEconomy";

/* Pac-man coin trail: a snake path of coins woven through every section.
   Pac-man tracks the reader's scroll position, eating coins behind and
   revealing them ahead — each eaten coin flies into the HUD as +1.

   The trail is deliberately imperative (refs + classList) rather than
   React state: it repaints on every scroll tick and owns hundreds of
   tiny nodes, so keeping it out of the render cycle is the point. */

const TRAIL_LEN = 11; // constant number of visible coins
const STEP = 92; // px between coins

const CoinTrail = () => {
    const trailRef = useRef<HTMLDivElement>(null);
    const { earnCoin } = useCoins();
    const earnRef = useRef(earnCoin);
    earnRef.current = earnCoin;

    useEffect(() => {
        const trail = trailRef.current;
        if (!trail) return;

        let coins: HTMLDivElement[] = [];
        let pts: [number, number][] = [];
        let earnedIdx: number | null = null;
        let pac: HTMLDivElement | null = null;
        let raf = 0;
        let disposed = false;

        function buildTrail() {
            if (disposed || !trail) return;
            trail.innerHTML = "";
            coins = [];
            pts = [];
            earnedIdx = null;
            const H = document.body.scrollHeight;
            const W = window.innerWidth;
            trail.style.height = `${H}px`;
            // waypoints: snake left/right between sections
            const secs = [...document.querySelectorAll("section")];
            const way: [number, number][] = [[W * 0.5, 120]];
            secs.forEach((s, i) => {
                const y = (s as HTMLElement).offsetTop;
                const h = (s as HTMLElement).offsetHeight;
                const x1 = i % 2 ? W * 0.12 : W * 0.88;
                const x2 = i % 2 ? W * 0.88 : W * 0.12;
                way.push([x1, y + h * 0.28], [x2, y + h * 0.72]);
            });
            way.push([W * 0.5, H - 140]);
            // sample points along the polyline, smoothstepped on x for curves
            for (let i = 0; i < way.length - 1; i++) {
                const [ax, ay] = way[i];
                const [bx, by] = way[i + 1];
                const d = Math.hypot(bx - ax, by - ay);
                const n = Math.max(1, Math.round(d / STEP));
                for (let j = 0; j < n; j++) {
                    const t = j / n;
                    const e = t * t * (3 - 2 * t);
                    pts.push([ax + (bx - ax) * e, ay + (by - ay) * t]);
                }
            }
            pts.forEach(([x, y]) => {
                const c = document.createElement("div");
                c.className = "coin";
                c.style.left = `${x}px`;
                c.style.top = `${y}px`;
                trail.appendChild(c);
                coins.push(c);
            });
            pac = document.createElement("div");
            pac.className = "pac";
            pac.innerHTML =
                '<svg viewBox="0 0 30 30"><g class="pac-rot"><path class="pac-body" fill="#FFD84D" stroke="#D9A800" stroke-width=".5"/><circle cx="15" cy="7" r="2" fill="#130E37"/></g></svg>';
            trail.appendChild(pac);
            updateTrail();
        }

        function updateTrail() {
            if (!pts.length || !trail) return;
            const focus = window.scrollY + window.innerHeight * 0.48;
            let head = 0;
            let best = 1e12;
            pts.forEach(([, y], i) => {
                const d = Math.abs(y - focus);
                if (d < best) {
                    best = d;
                    head = i;
                }
            });
            coins.forEach((c, i) => {
                if (i < head) c.className = "coin eaten";
                else if (i < head + TRAIL_LEN) c.className = "coin on";
                else c.className = "coin";
            });
            if (pac) {
                const p = pts[Math.max(0, head - 1)] || pts[0];
                const nx = pts[Math.min(pts.length - 1, head + 1)];
                pac.style.left = `${p[0]}px`;
                pac.style.top = `${p[1]}px`;
                // rotate so the mouth faces the travel direction
                const ang = (Math.atan2(nx[1] - p[1], nx[0] - p[0]) * 180) / Math.PI;
                const rot = pac.querySelector(".pac-rot");
                if (rot) rot.setAttribute("transform", `rotate(${ang} 15 15)`);
            }
            // award coins for newly-eaten trail pieces (monotonic, no farming)
            if (earnedIdx === null) {
                earnedIdx = Math.max(-1, head - 1);
            } else if (head - 1 > earnedIdx) {
                const rect = trail.getBoundingClientRect();
                for (let i = earnedIdx + 1; i < head; i++) {
                    const [x, y] = pts[i];
                    earnRef.current(rect.left + x, y - window.scrollY);
                }
                earnedIdx = head - 1;
            }
        }

        /* pac-man mouth chomp: animate the path 'd' so the mouth only
           opens on one side */
        function chompLoop(now: number) {
            const body = trail?.querySelector(".pac-body");
            if (body) {
                const t = (now % 320) / 320;
                const phase = Math.abs(Math.sin(t * Math.PI));
                const ang = ((5 + phase * 32) * Math.PI) / 180;
                const r = 14.5;
                const cx = 15;
                const cy = 15;
                const x = (cx + r * Math.cos(ang)).toFixed(2);
                const yT = (cy - r * Math.sin(ang)).toFixed(2);
                const yB = (cy + r * Math.sin(ang)).toFixed(2);
                body.setAttribute(
                    "d",
                    `M ${cx} ${cy} L ${x} ${yT} A ${r} ${r} 0 1 0 ${x} ${yB} Z`,
                );
            }
            raf = requestAnimationFrame(chompLoop);
        }

        let resizeTimer: ReturnType<typeof setTimeout>;
        const onScroll = () => updateTrail();
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildTrail, 300);
        };

        buildTrail();
        // rebuild once fonts/images settle and shift layout
        const settleTimer = setTimeout(buildTrail, 600);
        document.fonts?.ready.then(() => buildTrail());
        window.addEventListener("load", buildTrail);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        raf = requestAnimationFrame(chompLoop);

        return () => {
            disposed = true;
            clearTimeout(settleTimer);
            clearTimeout(resizeTimer);
            cancelAnimationFrame(raf);
            window.removeEventListener("load", buildTrail);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            trail.innerHTML = "";
        };
    }, []);

    return <div ref={trailRef} className="trail" aria-hidden="true" />;
};

export default CoinTrail;
