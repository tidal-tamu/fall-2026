import { useState } from "react";
import { INK, rng } from "./skyline";

/* -------------------------------------------------------------------------- */
/*  The sky around the caped penguin: a faint grid, Summer-Diary clouds that   */
/*  drift across, four-point sparkles, a plane trailing a dotted contrail and  */
/*  the giant penguin looming behind the city.                                 */
/* -------------------------------------------------------------------------- */

/* A soft white grid over the sky that fades out toward the city. */
const GRID = (() => {
    let d = "";
    for (let i = -1; i <= 21; i++) {
        d += "M";
        for (let y = 0; y <= 1000; y += 50) d += `${i * 80},${y} `;
    }
    for (let j = 0; j <= 13; j++) {
        d += "M";
        for (let x = 0; x <= 1600; x += 50) d += `${x},${j * 80} `;
    }
    return d;
})();

export const SkyGrid = () => (
    <svg className="caped-grid" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
        <path d={GRID} fill="none" stroke="#fff" strokeOpacity={0.42} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
    </svg>
);

const CloudArt = () => (
    <svg viewBox="0 0 300 140" aria-hidden="true">
        <path d="M34 122 C10 122 8 94 32 92 C26 68 54 54 76 66 C82 36 118 24 142 42 C154 16 198 14 210 44 C232 32 264 46 260 72 C286 74 294 106 272 120 Z" fill="#fdfeff" />
        <path d="M38 120 C44 106 64 102 80 110 C94 96 122 96 134 108 C152 94 184 96 194 108 C212 98 242 100 256 116 L262 120 Z" fill="#e1eaf1" />
        <path d="M76 66 C86 74 88 84 86 92 M142 42 C152 54 152 66 148 74 M210 44 C216 56 214 66 208 72 M80 110 C84 104 90 100 96 99 M134 108 C138 102 144 98 150 97 M194 108 C198 102 204 99 210 98" fill="none" stroke="#a7b6c3" strokeWidth={1.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d="M34 122 C10 122 8 94 32 92 C26 68 54 54 76 66 C82 36 118 24 142 42 C154 16 198 14 210 44 C232 32 264 46 260 72 C286 74 294 106 272 120 Z" fill="none" stroke="#56626d" strokeWidth={1.8} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
);

type CloudSpec = { width: number; top: number; dur: number; delay: number; flip: boolean };

/* Spread evenly along their loop by delay, sized down on narrow screens. */
function seedClouds(count: number, topMin: number, topMax: number, wMin: number, wMax: number, durMin: number, durMax: number, r: () => number) {
    const k = Math.max(0.5, Math.min(1, window.innerWidth / 1200));
    return Array.from({ length: count }, (_, i): CloudSpec => {
        const width = (wMin + r() * (wMax - wMin)) * k;
        const dur = durMin + r() * (durMax - durMin);
        return {
            width,
            top: topMin + r() * (topMax - topMin),
            dur,
            delay: -(i / count) * dur - (r() * dur) / count,
            flip: r() < 0.5,
        };
    });
}

export const Clouds = ({ layer }: { layer: "back" | "front" }) => {
    const [specs] = useState(() => {
        const r = rng(layer === "back" ? 5 : 6);
        return layer === "back"
            ? seedClouds(5, 8, 40, 200, 360, 160, 260, r)
            : seedClouds(window.innerWidth < 760 ? 1 : 2, 36, 52, 260, 400, 120, 180, r);
    });
    return (
        <>
            {specs.map((c, i) => (
                <div
                    key={i}
                    className="caped-cloud"
                    style={{
                        width: c.width,
                        top: `${c.top}%`,
                        opacity: layer === "front" ? 0.92 : 1,
                        animationDuration: `${c.dur}s`,
                        animationDelay: `${c.delay}s`,
                        scale: c.flip ? "-1 1" : undefined,
                    }}
                >
                    <CloudArt />
                </div>
            ))}
        </>
    );
};

const SPARKLES: [number, number, number, number][] = [
    [16, 15, 26, 0], [83, 21, 18, 1.2], [71, 8, 13, 2.1], [9, 40, 15, 0.7], [90, 46, 22, 1.8], [30, 9, 11, 2.6],
];

export const Sparkles = () => (
    <>
        {SPARKLES.map(([left, top, size, dl]) => (
            <div
                key={`${left}-${top}`}
                className="caped-sparkle"
                style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `-${dl}s`, animationDuration: `${3.6 + dl * 0.6}s` }}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <use href="#caped-spark" fill="#fff" stroke={INK} strokeWidth={1.4} />
                </svg>
            </div>
        ))}
    </>
);

export const Plane = () => (
    <div className="caped-plane">
        <svg width="34" height="20" viewBox="0 0 34 20" aria-hidden="true">
            <path d="M3 11 Q17 8 31 9 Q34 10 31 11.5 Q17 13 3 11 Z" fill="#fff" stroke="#3a454f" strokeWidth={1.4} strokeLinejoin="round" />
            <path d="M14 10.5 L9 18 L13 18 L20 10.8" fill="#fff" stroke="#3a454f" strokeWidth={1.4} strokeLinejoin="round" />
            <path d="M5 10.5 L3 4 L6 4 L9.5 10" fill="#fff" stroke="#3a454f" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
    </div>
);

/* The far-off giant: it sways, breathes and blinks behind the mist. */
export const GiantPenguin = () => (
    <svg className="caped-giant" viewBox="0 0 1000 1100" aria-hidden="true">
        <g className="caped-giant__sway">
            <g className="caped-giant__breathe">
                <path d="M110 1100 C105 640 200 40 500 40 C800 40 895 640 890 1100 Z" fill="#424242" />
                <path
                    d="M250 1100 C236 760 236 420 300 250 C340 150 440 140 476 214 C486 236 490 262 492 280 L508 280 C510 262 514 236 524 214 C560 140 660 150 700 250 C764 420 764 760 750 1100 Z"
                    fill="#fbfcfd"
                />
                <ellipse cx={352} cy={318} rx={36} ry={27} fill="#f5e9da" />
                <ellipse cx={648} cy={318} rx={36} ry={27} fill="#f5e9da" />
                <g className="caped-giant__blink">
                    <ellipse cx={402} cy={268} rx={21} ry={17} fill="#424242" />
                    <ellipse cx={598} cy={268} rx={21} ry={17} fill="#424242" />
                </g>
                <ellipse cx={500} cy={300} rx={34} ry={20} fill="#f5e9da" stroke="#424242" strokeWidth={12} />
            </g>
        </g>
    </svg>
);
