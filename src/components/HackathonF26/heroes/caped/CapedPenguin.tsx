import { forwardRef, useImperativeHandle, useRef, type CSSProperties } from "react";
import { HEART, INK } from "./skyline";

/* -------------------------------------------------------------------------- */
/*  The hero of the hero: a flat doodle penguin in a pastel cape, a fish for a */
/*  sword. The cape is redrawn every frame from a "billow" amount (0 idle, 1   */
/*  heroic) so it can ripple; the parent's animation loop calls draw().        */
/*  Drawn with its feet at (0, 0), so it can stand on any roof.               */
/* -------------------------------------------------------------------------- */

const PENG = "#424242";
const CREAM = "#f5e9da";
const CAPE = "#a9cbe7";

type Pt = [number, number];
const r1 = (n: number) => Math.round(n * 10) / 10;
const P = (p: Pt) => `${r1(p[0])},${r1(p[1])}`;

export type CapeHandle = { draw: (t: number, billow: number) => void };

/* Cape outline: tied at the shoulders, hem blown out to the left with a few
   travelling ripples whose size follows the billow. */
function capePath(t: number, a: number) {
    const w1 = Math.sin(t * 5.1), w2 = Math.sin(t * 6.7 + 1.2), w3 = Math.sin(t * 3.9 + 0.5);
    const TL: Pt = [-42, -59], TR: Pt = [46, -60];
    const HL: Pt = [-48 - 54 * a + w1 * 5 * a, -4 - 36 * a + w2 * 7 * a];
    const HR: Pt = [40 - 10 * a, -3 - 4 * a];
    const CL: Pt = [-53 - 24 * a + w3 * 6 * a, -40 - 6 * a];
    let d = `M${P(TL)} Q${P(CL)} ${P(HL)}`;
    const n = 4;
    for (let i = 1; i <= n; i++) {
        const f = i / n, fm = (i - 0.5) / n, amp = (1 - f * 0.7) * a;
        const px = HL[0] + (HR[0] - HL[0]) * f;
        const py = HL[1] + (HR[1] - HL[1]) * f + Math.sin(t * 7 + f * 6) * 6 * amp;
        const mx = HL[0] + (HR[0] - HL[0]) * fm;
        const my = HL[1] + (HR[1] - HL[1]) * fm + 5 + Math.sin(t * 7 + fm * 6 + 0.8) * 9 * amp;
        d += ` Q${P([mx, my])} ${P([px, py])}`;
    }
    d += ` Q52,-34 ${P(TR)} Z`;
    const fold = `M-38,-50 Q${P([(TL[0] + HL[0]) / 2 + 6, (TL[1] + HL[1]) / 2 + 4])} ${P([HL[0] * 0.72 + HR[0] * 0.28, HL[1] * 0.72 + HR[1] * 0.28 - 2])}`;
    return { d, fold };
}

const SPARKS = [
    { x: -52, y: -118, s: 0.62, dl: "0s", fill: "#fff", sw: 1.6 },
    { x: 70, y: -136, s: 0.45, dl: ".35s", fill: "#fff", sw: 1.8 },
    { x: -70, y: -62, s: 0.38, dl: ".7s", fill: "#d6ecfb", sw: 2 },
];

interface Props {
    x: number;
    y: number;
    on: boolean;
    onEnter: () => void;
    onLeave: () => void;
    onTap: () => void;
}

const CapedPenguin = forwardRef<CapeHandle, Props>(({ x, y, on, onEnter, onLeave, onTap }, ref) => {
    const cape = useRef<SVGPathElement>(null);
    const dots = useRef<SVGPathElement>(null);
    const fold = useRef<SVGPathElement>(null);

    useImperativeHandle(ref, () => ({
        draw(t, billow) {
            const p = capePath(t, billow);
            cape.current?.setAttribute("d", p.d);
            dots.current?.setAttribute("d", p.d);
            fold.current?.setAttribute("d", p.fold);
        },
    }));

    const idle = capePath(0, 0.14);

    return (
        <g
            className={`caped-hero ${on ? "is-on" : ""}`}
            transform={`translate(${x},${y})`}
            onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()}
            onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
            onPointerDown={(e) => e.pointerType !== "mouse" && onTap()}
        >
            <rect x={-110} y={-160} width={200} height={170} fill="transparent" pointerEvents="all" />
            <ellipse cx={0} cy={2} rx={36} ry={5} fill={INK} opacity={0.28} />
            <g className="caped-hero__bob">
                <path ref={cape} d={idle.d} fill={CAPE} stroke={PENG} strokeWidth={2.6} strokeLinejoin="round" />
                <path ref={dots} d={idle.d} fill="url(#caped-cape-dots)" />
                <path ref={fold} d={idle.fold} fill="none" stroke="#eef6fc" strokeWidth={2.4} strokeLinecap="round" />
                {/* body, belly, cheeks */}
                <path d="M-36 -14 C-44 -46 -42 -96 -10 -114 C18 -126 44 -100 46 -60 C48 -40 44 -22 38 -12 C38 -2 30 4 18 3 C10 2 6 -2 0 -2 C-6 -2 -10 2 -18 3 C-30 4 -38 -2 -36 -14 Z" fill={PENG} />
                <path d="M-28 -16 C-34 -40 -32 -74 -22 -88 C-14 -99 -4 -99 -2 -88 C-1 -83 -2 -79 -4 -77 L6 -77 C4 -79 3 -83 4 -88 C6 -99 18 -100 26 -88 C36 -72 38 -44 32 -18 C28 -8 18 -9 0 -9 C-16 -9 -26 -8 -28 -16 Z" fill="#fbfcfd" />
                <ellipse cx={-21} cy={-69} rx={6.5} ry={4.8} fill={CREAM} />
                <ellipse cx={23} cy={-69} rx={6.5} ry={4.8} fill={CREAM} />
                <g className="caped-hero__blink">
                    <ellipse cx={-13} cy={-80} rx={3.6} ry={3.2} fill={PENG} />
                    <ellipse cx={15} cy={-80} rx={3.6} ry={3.2} fill={PENG} />
                </g>
                <ellipse cx={1} cy={-74} rx={7.5} ry={4.6} fill={CREAM} stroke={PENG} strokeWidth={2.6} />
                <path d="M-34 -50 C-50 -48 -56 -32 -50 -22 C-46 -16 -38 -22 -34 -30 Z" fill={PENG} />
                {/* cape collar with its pixel-heart clasp */}
                <path d="M-42 -63 Q2 -51 47 -64 Q51 -60 47 -56 Q2 -43 -41 -55 Q-46 -59 -42 -63 Z" fill={CAPE} stroke={PENG} strokeWidth={2.2} strokeLinejoin="round" />
                <path d="M-35 -59.5 Q2 -50 39 -60.5" fill="none" stroke="#eef6fc" strokeWidth={1.6} strokeLinecap="round" />
                <path d={HEART} transform="translate(-2.2,-54.5) scale(1.15)" fill="#6ea3d8" stroke={PENG} strokeWidth={0.6} shapeRendering="crispEdges" />
                {/* the fish, held aloft */}
                <g transform="translate(51,-58) rotate(10)">
                    <g className="caped-hero__fish">
                        <path d="M-9 7 Q0 3 9 7 L3 -8 L-3 -8 Z" fill="#cbe1ea" stroke={PENG} strokeWidth={2.4} strokeLinejoin="round" />
                        <path d="M0 -64 C12 -58 15 -38 11 -22 C9 -14 5 -9 2 -7 L-2 -7 C-5 -9 -9 -14 -11 -22 C-15 -38 -12 -58 0 -64 Z" fill="#cbe1ea" stroke={PENG} strokeWidth={2.6} strokeLinejoin="round" />
                        <path d="M-8 -41 Q0 -36 8 -41" fill="none" stroke={PENG} strokeWidth={1.8} strokeLinecap="round" />
                        <circle cx={0} cy={-50} r={5} fill="#fff" stroke={PENG} strokeWidth={2.2} />
                        <circle cx={0.8} cy={-49.4} r={2.3} fill={PENG} />
                        <path d="M5 -34 Q8 -25 3 -16" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
                    </g>
                </g>
                <path d="M33 -50 C38 -68 56 -72 60 -58 C62 -48 52 -42 40 -40 Z" fill={PENG} />
            </g>
            {SPARKS.map((s) => (
                <g key={s.dl} transform={`translate(${s.x},${s.y})`}>
                    <g className="caped-hero__spark" style={{ "--s": s.s, "--dl": s.dl } as CSSProperties}>
                        <use href="#caped-spark" x={-12} y={-12} fill={s.fill} stroke={INK} strokeWidth={s.sw} />
                    </g>
                </g>
            ))}
            {/* the comic speech bubble: the page's beginner pitch, in hero voice */}
            <g className="caped-hero__bubble" transform="translate(-150,-205)">
                <path d="M0 6 Q0 0 6 0 H170 Q176 0 176 6 V40 Q176 46 170 46 H128 L136 66 L104 46 H6 Q0 46 0 40 Z" fill="#fff" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
                <text x={88} y={28} textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize={9} fill={INK}>
                    no powers needed!
                </text>
            </g>
        </g>
    );
});

CapedPenguin.displayName = "CapedPenguin";

export default CapedPenguin;
