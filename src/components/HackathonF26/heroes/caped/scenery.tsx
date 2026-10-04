import { INK } from "./skyline";

/* -------------------------------------------------------------------------- */
/*  The sky around the caped penguin: a faint grid, four-point sparkles and    */
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

/* The far-off giant: it holds still behind the mist, only blinking. */
export const GiantPenguin = () => (
    <svg className="caped-giant" viewBox="0 0 1000 1100" aria-hidden="true">
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
    </svg>
);
