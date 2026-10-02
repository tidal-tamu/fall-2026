import type { ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*  The city behind the caped penguin, generated once from fixed seeds so it   */
/*  never reshuffles: a pale far skyline sinking into a cumulus bank, and a    */
/*  near row of comic line-art buildings with halftone shading, roof clutter,  */
/*  "tidal" signage and windows that flicker on and off.                       */
/*  Both draw into a -400..2000 x 420 box whose ground line is y = 420.        */
/* -------------------------------------------------------------------------- */

export const GROUND = 420;
export const INK = "#2c3238";
export const HEART = "M1 0h2v1h1V0h2v1h1v3h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1V4H0V1h1z";

type El = ReactElement;
type Rand = () => number;
type Box = { x: number; w: number; h: number };
type Win = {
    ww: number; wh: number; gx: number; gy: number; side: number; bottom: number; jit: number;
    inset: number; dim: string; stroke: string; sw: number; lit: string; litChance: number;
    steady: number; minDur: number; maxDur: number;
};

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (p: [number, number]) => `${r1(p[0])},${r1(p[1])}`;
const poly = (pts: [number, number][], closed = true) => "M" + pts.map(pt).join(" L") + (closed ? "Z" : "");
const rect = (x: number, y: number, w: number, h: number): [number, number][] => [
    [x, y], [x + w, y], [x + w, y + h], [x, y + h],
];

/* mulberry32: small, fast, and the same sequence every time for a seed */
export function rng(seed: number): Rand {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* Collects elements with stable keys. */
class Sheet {
    els: El[] = [];
    private n = 0;
    key() {
        return this.n++;
    }
    add(el: El) {
        this.els.push(el);
    }
}

function lit(s: Sheet, x: number, y: number, w: number, h: number, o: Win, r: Rand) {
    if (r() < o.steady) {
        s.add(<rect key={s.key()} x={r1(x)} y={r1(y)} width={r1(w)} height={r1(h)} rx={1.2} fill={o.lit} opacity={(0.7 + r() * 0.3).toFixed(2)} />);
        return;
    }
    const d = o.minDur + r() * (o.maxDur - o.minDur);
    s.add(
        <rect
            key={s.key()}
            className="caped-flick"
            x={r1(x)} y={r1(y)} width={r1(w)} height={r1(h)} rx={1.2} fill={o.lit}
            style={{ animationDuration: `${d.toFixed(2)}s`, animationDelay: `${(-r() * d).toFixed(2)}s` }}
        />,
    );
}

function windows(s: Sheet, b: Box, o: Win, r: Rand, top: number) {
    const inner = b.w - o.side * 2;
    const cols = Math.max(1, Math.floor((inner + o.gx) / (o.ww + o.gx)));
    const used = cols * o.ww + (cols - 1) * o.gx;
    const x0 = b.x + (b.w - used) / 2;
    const y0 = GROUND - b.h + top;
    const rows = Math.floor((b.h - top - o.bottom + o.gy) / (o.wh + o.gy));
    for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++) {
            const x = r1(x0 + j * (o.ww + o.gx) + (r() - 0.5) * o.jit);
            const y = r1(y0 + i * (o.wh + o.gy) + (r() - 0.5) * o.jit);
            s.add(<rect key={s.key()} x={x} y={y} width={o.ww} height={o.wh} rx={1.6} fill={o.dim} stroke={o.stroke} strokeWidth={o.sw} />);
            if (r() < o.litChance) lit(s, x + o.inset, y + o.inset, o.ww - o.inset * 2, o.wh - o.inset * 2, o, r);
        }
}

const heart = (s: Sheet, x: number, y: number, k: number, fill: string, beacon = false) =>
    s.add(
        <path
            key={s.key()}
            className={beacon ? "caped-beacon" : undefined}
            d={HEART}
            fill={fill}
            transform={`translate(${x},${y}) scale(${k})`}
            shapeRendering="crispEdges"
        />,
    );

/* ------------------------------------------------------------------- far -- */
const FAR_WIN: Win = {
    ww: 7, wh: 9, gx: 9, gy: 12, side: 12, bottom: 24, jit: 0, inset: 1, dim: "none", stroke: "#97a5b1",
    sw: 0.9, lit: "#eef6fc", litChance: 0.38, steady: 0.3, minDur: 7, maxDur: 13,
};

/* A cumulus bank: a run of arcs rising toward the edges, dipping at the
   centre where the hero stands. */
function bank(s: Sheet, seed: number, lift: number, wMin: number, wMax: number, fill: string, stroke: string, sw: number) {
    const r = rng(seed);
    const base = (x: number) => 238 - Math.min(Math.abs(x - 800) / 1100, 1) * 64 + lift;
    let bx = -440;
    let d = `M-440,${GROUND + 10} L-440,${r1(base(-440))}`;
    while (bx < 2040) {
        const w = wMin + r() * (wMax - wMin);
        const nx = bx + w;
        const ny = base(nx) + (r() - 0.5) * 26;
        const rad = r1(w * 0.62);
        d += ` A${rad},${rad} 0 0 1 ${r1(nx)},${r1(ny)}`;
        bx = nx;
    }
    d += ` L${r1(bx)},${GROUND + 10} Z`;
    s.add(<path key={s.key()} d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />);
}

function buildFar() {
    const s = new Sheet();
    const r = rng(11);
    let x = -440;
    while (x < 2040) {
        const w = 70 + r() * 80;
        const cx = x + w / 2;
        let h = 170 + Math.pow(Math.min(Math.abs(cx - 800) / 1150, 1), 1.1) * 200 + r() * 70;
        if (Math.abs(cx - 800) < 280) h = Math.min(h, 160 + r() * 70); // keep the middle low for the hero
        const b = { x: r1(x), w: r1(w), h: r1(h) };
        s.add(<path key={s.key()} d={poly(rect(b.x, GROUND - b.h, b.w, b.h + 6))} fill="#c4ced6" stroke="#85929e" strokeWidth={1.3} strokeLinejoin="round" />);
        if (r() < 0.4) {
            const ax = r1(b.x + b.w * (0.3 + r() * 0.4));
            s.add(<path key={s.key()} d={`M${ax},${GROUND - b.h} l0,-${(14 + r() * 18).toFixed(0)}`} stroke="#85929e" strokeWidth={1.3} />);
        }
        windows(s, b, FAR_WIN, r, 22);
        x += w - 6 + r() * 12;
    }
    bank(s, 3, 0, 70, 150, "#fbfcfd", "#56626d", 1.8);
    bank(s, 8, 34, 50, 95, "#e1e9f0", "#aebcc8", 1.3);
    bank(s, 15, 74, 40, 80, "#d3dde6", "#b9c6d1", 1.1);
    return s.els;
}

export const FAR = buildFar();

/* ------------------------------------------------------------------ near -- */
const NEAR_WIN: Win = {
    ww: 10, wh: 13, gx: 8, gy: 11, side: 14, bottom: 30, jit: 0, inset: 1.6, dim: "#56626c", stroke: INK,
    sw: 1.3, lit: "#d6ecfb", litChance: 0.6, steady: 0.22, minDur: 4.5, maxDur: 10,
};
const FILLS = ["#7b8792", "#8a96a0", "#6f7b86", "#95a1aa"];

type Building = Box & { t: "w" | "g" | "c"; antenna?: 1; tank?: 1; ac?: 1; sign?: 1; round?: 1 };

/* The low wide roof at x 730 is where the hero stands. */
const NEAR_LIST: Building[] = [
    { x: -400, w: 110, h: 270, t: "w" }, { x: -296, w: 124, h: 345, t: "g", antenna: 1 },
    { x: -176, w: 92, h: 240, t: "w", tank: 1 }, { x: -88, w: 90, h: 310, t: "w" },
    { x: -2, w: 96, h: 280, t: "g" }, { x: 90, w: 116, h: 380, t: "w", antenna: 1 },
    { x: 204, w: 84, h: 250, t: "w", tank: 1 }, { x: 284, w: 132, h: 345, t: "c" },
    { x: 414, w: 104, h: 262, t: "g" }, { x: 514, w: 112, h: 200, t: "w", antenna: 1 },
    { x: 622, w: 110, h: 150, t: "w", ac: 1 }, { x: 730, w: 140, h: 102, t: "w" },
    { x: 866, w: 98, h: 158, t: "g" }, { x: 960, w: 124, h: 214, t: "w", ac: 1 },
    { x: 1080, w: 110, h: 290, t: "w", antenna: 1 }, { x: 1186, w: 136, h: 250, t: "w", round: 1 },
    { x: 1318, w: 118, h: 368, t: "g", sign: 1 }, { x: 1432, w: 94, h: 285, t: "w", tank: 1 },
    { x: 1522, w: 102, h: 330, t: "w" }, { x: 1620, w: 118, h: 250, t: "g" },
    { x: 1734, w: 96, h: 345, t: "w", antenna: 1 }, { x: 1826, w: 118, h: 280, t: "w", tank: 1 },
    { x: 1940, w: 90, h: 320, t: "g" },
];

const pixelText = (s: Sheet, x: number, y: number, size: number, fill: string, text: string) =>
    s.add(
        <text key={s.key()} x={x} y={y} textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize={size} fill={fill}>
            {text}
        </text>,
    );

function roofProps(s: Sheet, b: Building, y: number, r: Rand) {
    if (b.antenna) {
        const ax = b.x + b.w * 0.62;
        s.add(<path key={s.key()} d={poly([[ax, y], [ax + 1, y - 40]], false)} stroke={INK} strokeWidth={2.4} fill="none" />);
        s.add(<path key={s.key()} d={`M${ax - 9},${y - 24} L${ax + 10},${y - 23}`} stroke={INK} strokeWidth={2} fill="none" />);
        s.add(
            <circle
                key={s.key()}
                className="caped-beacon"
                cx={ax + 1} cy={y - 43} r={3.4} fill="#f2c9a0" stroke={INK} strokeWidth={1.4}
                style={{ animationDelay: `${(-r() * 3).toFixed(2)}s` }}
            />,
        );
    }
    if (b.tank) {
        const tx = b.x + b.w * 0.26;
        s.add(<path key={s.key()} d={`M${tx + 5},${y} L${tx + 7},${y - 14} M${tx + 27},${y} L${tx + 25},${y - 14} M${tx + 6},${y - 7} L${tx + 26},${y - 7}`} stroke={INK} strokeWidth={1.8} fill="none" />);
        s.add(<path key={s.key()} d={poly(rect(tx, y - 38, 32, 24))} fill="#a9b4bd" stroke={INK} strokeWidth={2} />);
        s.add(<path key={s.key()} d={`M${tx - 3},${y - 38} Q${tx + 16},${y - 52} ${tx + 35},${y - 38} Z`} fill="#a9b4bd" stroke={INK} strokeWidth={2} />);
        s.add(<path key={s.key()} d={`M${tx + 4},${y - 30} L${tx + 28},${y - 30} M${tx + 4},${y - 22} L${tx + 28},${y - 22}`} stroke={INK} strokeWidth={1} strokeOpacity={0.5} fill="none" />);
    }
    if (b.ac) {
        const ux = b.x + b.w * 0.18;
        s.add(<path key={s.key()} d={poly(rect(ux, y - 16, 26, 16))} fill="#b3bdc5" stroke={INK} strokeWidth={1.8} />);
        s.add(<circle key={s.key()} cx={ux + 9} cy={y - 8} r={5} fill="none" stroke={INK} strokeWidth={1.4} />);
        s.add(<path key={s.key()} d={`M${ux + 9},${y - 13} L${ux + 9},${y - 3} M${ux + 4},${y - 8} L${ux + 14},${y - 8}`} stroke={INK} strokeWidth={1} fill="none" />);
    }
    if (b.sign) {
        const sx = b.x + 10;
        const sw = b.w - 20;
        s.add(<path key={s.key()} d={`M${sx + 14},${y} L${sx + 14},${y - 12} M${sx + sw - 14},${y} L${sx + sw - 14},${y - 12}`} stroke={INK} strokeWidth={2} fill="none" />);
        s.add(<path key={s.key()} d={poly(rect(sx, y - 46, sw, 34))} fill="#eef4f9" stroke={INK} strokeWidth={2.2} />);
        pixelText(s, sx + sw / 2 - 11, y - 22, 13, INK, "tidal");
        heart(s, sx + sw - 22, y - 35, 2, "#6ea3d8", true);
    }
}

function boxBuilding(s: Sheet, b: Building, fill: string, r: Rand) {
    const y = GROUND - b.h;
    let outline: string;
    if (b.round) {
        const pts: [number, number][] = [[b.x, GROUND + 6], [b.x, y + b.w * 0.3]];
        for (let a = 180; a >= 0; a -= 15) {
            const t = (a * Math.PI) / 180;
            pts.push([b.x + b.w / 2 + Math.cos(t) * (b.w / 2), y + b.w * 0.3 - Math.sin(t) * b.w * 0.3]);
        }
        pts.push([b.x + b.w, GROUND + 6]);
        outline = poly(pts);
    } else {
        outline = poly(rect(b.x, y, b.w, b.h + 6));
    }
    s.add(<path key={s.key()} d={outline} fill={fill} stroke={INK} strokeWidth={2.4} />);

    // comic shading: halftone down the right edge, clipped to the building
    const clip = `caped-clip-${Math.round(b.x + 500)}`;
    s.add(
        <clipPath key={s.key()} id={clip}>
            <path d={outline} />
        </clipPath>,
    );
    s.add(
        <g key={s.key()} clipPath={`url(#${clip})`}>
            <rect x={r1(b.x + b.w * 0.8)} y={y + 2} width={r1(b.w * 0.2 - 1.5)} height={b.h} fill="url(#caped-dots)" />
        </g>,
    );
    s.add(<path key={s.key()} d={`M${r1(b.x + b.w * 0.8)},${y + 4} L${r1(b.x + b.w * 0.8 + 1)},${GROUND}`} stroke={INK} strokeWidth={1} strokeOpacity={0.35} fill="none" />);

    if (b.t === "g") {
        // tiled facade: a grid of panes, some lit
        const cell = 15;
        const x0 = b.x + 10, x1 = b.x + b.w - 10, y0 = y + 20, y1 = GROUND - 30;
        const cols = Math.floor((x1 - x0) / cell), rows = Math.floor((y1 - y0) / cell);
        const ox = x0 + (x1 - x0 - cols * cell) / 2;
        s.add(<path key={s.key()} d={poly(rect(ox, y0, cols * cell, rows * cell))} fill="#9aa6b0" stroke={INK} strokeWidth={1.6} />);
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                if (r() < 0.42) lit(s, ox + j * cell + 1.6, y0 + i * cell + 1.6, cell - 3.2, cell - 3.2, NEAR_WIN, r);
        let d = "";
        for (let j = 1; j < cols; j++) d += `M${r1(ox + j * cell)},${y0} L${r1(ox + j * cell)},${y0 + rows * cell} `;
        for (let i = 1; i < rows; i++) d += `M${ox},${r1(y0 + i * cell)} L${ox + cols * cell},${r1(y0 + i * cell)} `;
        s.add(<path key={s.key()} d={d} stroke={INK} strokeWidth={1} strokeOpacity={0.55} fill="none" />);
    } else {
        windows(s, b, NEAR_WIN, r, b.round ? b.w * 0.3 + 16 : 24);
    }

    if (b.w > 100 && r() < 0.6) {
        const dx = b.x + b.w * 0.38;
        s.add(<path key={s.key()} d={poly(rect(dx, GROUND - 22, 22, 26))} fill="#4a545d" stroke={INK} strokeWidth={1.8} />);
    }
    if (!b.round) {
        s.add(<path key={s.key()} d={poly(rect(b.x - 4, y - 7, b.w + 8, 9))} fill="#aab5be" stroke={INK} strokeWidth={2.2} />);
        if (r() < 0.55) s.add(<path key={s.key()} d={`M${b.x - 11},${y - 7.5} L${b.x + 14},${y - 7}`} stroke={INK} strokeWidth={1.2} fill="none" />);
    }
}

/* The round tower: a "tidal" sign band, curved tiles and a NOV 21 banner. */
function cylinder(s: Sheet, b: Building, r: Rand) {
    const top = GROUND - b.h, cx = b.x + b.w / 2, rx = b.w / 2, ry = 14, capY = top + ry;
    const pts: [number, number][] = [[b.x, GROUND + 6], [b.x, capY]];
    for (let a = 180; a <= 360; a += 15) {
        const t = (a * Math.PI) / 180;
        pts.push([cx + Math.cos(t) * rx, capY - Math.sin(t) * ry]);
    }
    pts.push([b.x + b.w, GROUND + 6]);
    const outline = poly(pts);
    s.add(<path key={s.key()} d={outline} fill="#a8b3bc" stroke={INK} strokeWidth={2.4} />);
    s.add(
        <clipPath key={s.key()} id="caped-cyl">
            <path d={outline} />
        </clipPath>,
    );

    const inner = new Sheet();
    const bandH = 36;
    inner.add(<path key={inner.key()} d={`M${b.x},${capY} Q${cx},${capY + ry * 2} ${b.x + b.w},${capY} L${b.x + b.w},${capY + bandH} Q${cx},${capY + bandH + ry * 2} ${b.x},${capY + bandH} Z`} fill="#4b5660" stroke={INK} strokeWidth={1.6} />);
    pixelText(inner, cx - 13, capY + 34, 15, "#d6ecfb", "tidal");
    heart(inner, cx + 30, capY + 21, 2, "#a9cfee", true);

    const xs = [b.x, ...[-74, -56, -38, -19, 0, 19, 38, 56, 74].map((deg) => cx + rx * Math.sin((deg * Math.PI) / 180)), b.x + b.w];
    const step = 21, y0 = capY + bandH + 6, y1 = GROUND - 34;
    const sag = (x: number) => ry * (1 - ((x - cx) / rx) ** 2);
    const rowsN = Math.floor((y1 - y0) / step);
    for (let i = 0; i < rowsN; i++)
        for (let j = 0; j < xs.length - 1; j++) {
            const xa = xs[j], xb = xs[j + 1];
            const yy = y0 + i * step + sag((xa + xb) / 2);
            if (xb - xa > 8 && r() < 0.45) lit(inner, xa + 2, yy + 2, xb - xa - 4, step - 4, NEAR_WIN, r);
        }
    let d = "";
    for (let j = 1; j < xs.length - 1; j++) d += `M${r1(xs[j])},${y0} L${r1(xs[j])},${y0 + rowsN * step + ry} `;
    for (let i = 0; i <= rowsN; i++) {
        const yy = y0 + i * step;
        d += `M${b.x},${yy} Q${cx},${yy + ry * 2} ${b.x + b.w},${yy} `;
    }
    inner.add(<path key={inner.key()} d={d} stroke={INK} strokeWidth={1.1} strokeOpacity={0.6} fill="none" />);
    inner.add(<rect key={inner.key()} x={cx + rx * 0.4} y={top} width={rx * 0.6} height={b.h} fill="url(#caped-dots)" />);

    const bw = 40, bx = cx - bw / 2 - 14, by = y0 + 30, bh = 108;
    inner.add(<path key={inner.key()} d={poly(rect(bx, by, bw, bh))} fill="#eef4f9" stroke={INK} strokeWidth={1.8} />);
    heart(inner, bx + 10, by + 10, 3, "#6ea3d8");
    pixelText(inner, bx + bw / 2, by + 58, 10, INK, "NOV");
    pixelText(inner, bx + bw / 2, by + 84, 17, INK, "21");
    s.add(
        <g key={s.key()} clipPath="url(#caped-cyl)">
            {inner.els}
        </g>,
    );

    s.add(<ellipse key={s.key()} cx={cx} cy={capY} rx={rx - 0.5} ry={ry} fill="#c3ccd4" stroke={INK} strokeWidth={2.2} />);
    s.add(<ellipse key={s.key()} cx={cx} cy={capY} rx={rx * 0.62} ry={ry * 0.55} fill="none" stroke={INK} strokeWidth={1.1} strokeOpacity={0.5} />);
}

function buildNear() {
    const s = new Sheet();
    const r = rng(29);
    NEAR_LIST.forEach((b, i) => {
        if (b.t === "c") return cylinder(s, b, r);
        roofProps(s, b, GROUND - b.h - 7, r);
        boxBuilding(s, b, FILLS[i % FILLS.length], r);
    });
    return s.els;
}

export const NEAR = buildNear();
