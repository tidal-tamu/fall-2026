/* -------------------------------------------------------------------------- */
/*  The Summer Diary sky: a cloud bank that runs edge to edge and towers up    */
/*  behind the title, a plane drawing a contrail across, and a few specks      */
/*  drifting about.                                                           */
/* -------------------------------------------------------------------------- */

const LINE = "#3d4a57";

/* Puffs as [cx, cy, r] in a 1440 x 640 box whose bottom edge is the curb.
   Drawn three times: an outline pass, a blue shade pass, then smaller raised
   white puffs that leave the shade showing along every underside. */
const PUFFS: [number, number, number][] = [
    // the tower behind the title
    [745, 110, 95],
    [690, 170, 95],
    [805, 175, 100],
    [745, 250, 140],
    [640, 300, 120],
    [860, 300, 120],
    // shoulders stepping down either side
    [520, 345, 95],
    [975, 345, 95],
    [430, 400, 90],
    [1065, 400, 90],
    [320, 445, 85],
    [1170, 450, 85],
    [210, 480, 80],
    [1280, 490, 80],
    [100, 500, 78],
    [1380, 515, 78],
    [0, 520, 80],
    [1440, 530, 80],
    // the base, down behind the curb
    [90, 600, 110],
    [280, 585, 120],
    [480, 570, 130],
    [700, 560, 150],
    [920, 570, 130],
    [1120, 585, 120],
    [1320, 600, 110],
];

/* A few inner lines where a front lump overlaps the one behind it, as in the
   reference's linework. [cx, cy, r, fromDeg, toDeg] */
const FOLDS: [number, number, number, number, number][] = [
    [640, 300, 120, 205, 285],
    [860, 300, 120, 255, 335],
    [520, 345, 95, 200, 280],
    [975, 345, 95, 260, 340],
    [320, 445, 85, 205, 280],
    [1170, 450, 85, 260, 335],
    [480, 570, 130, 220, 290],
    [920, 570, 130, 250, 320],
];

const arc = ([cx, cy, r, a, b]: (typeof FOLDS)[number]) => {
    const p = (deg: number) => {
        const t = (deg * Math.PI) / 180;
        return `${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`;
    };
    return `M${p(a)} A${r} ${r} 0 0 1 ${p(b)}`;
};

const CloudBank = () => (
    <svg viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true">
        <g fill="none" stroke={LINE} strokeWidth="4">
            {PUFFS.map(([cx, cy, r]) => (
                <circle key={`o${cx}-${cy}`} cx={cx} cy={cy} r={r} vectorEffect="non-scaling-stroke" />
            ))}
        </g>
        <g fill="#d9e4ef">
            {PUFFS.map(([cx, cy, r]) => (
                <circle key={`s${cx}-${cy}`} cx={cx} cy={cy} r={r} />
            ))}
        </g>
        <g fill="#ffffff">
            {PUFFS.map(([cx, cy, r]) => (
                <circle key={`w${cx}-${cy}`} cx={cx - 4} cy={cy - 12} r={r - 12} />
            ))}
        </g>
        <g fill="none" stroke={LINE} strokeWidth="1.5" strokeLinecap="round" opacity="0.55">
            {FOLDS.map((f) => (
                <path key={`f${f[0]}-${f[1]}`} d={arc(f)} vectorEffect="non-scaling-stroke" />
            ))}
        </g>
    </svg>
);

/* The plane flies up and to the left; its contrail runs back behind the title
   and the clouds. Cropped rather than stretched, so the plane keeps its shape. */
const Contrail = () => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
        <path d="M1110 336 L346 124" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <g
            transform="translate(332 120) rotate(195.5)"
            stroke={LINE}
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill="#ffffff"
        >
            <path d="M2 -3 L-5 -16 L-1 -16 L9 -3 Z M2 3 L-5 16 L-1 16 L9 3 Z" />
            <path d="M-13 -3 L-17 -9 L-14 -9 L-9 -3 Z M-13 3 L-17 9 L-14 9 L-9 3 Z" />
            <path d="M-16 0 C-16 -2 -14 -3 -10 -3 L12 -3 C16 -3 18 -1.5 18 0 C18 1.5 16 3 12 3 L-10 3 C-14 3 -16 2 -16 0 Z" />
        </g>
    </svg>
);

/* Little specks drifting in the air, like the reference's seeds. */
const SPECKS = [
    { left: "15%", top: "30%", rot: -20, delay: "0s" },
    { left: "34.5%", top: "50%", rot: 15, delay: "-3s" },
    { left: "81%", top: "33%", rot: 30, delay: "-6s" },
    { left: "9.5%", top: "75%", rot: -10, delay: "-1.5s" },
    { left: "68%", top: "66%", rot: 25, delay: "-4.5s" },
    { left: "88%", top: "78%", rot: -25, delay: "-2s" },
];

const HeroSky = () => (
    <>
        <div className="diary-contrail" aria-hidden="true">
            <Contrail />
        </div>
        <div className="diary-clouds" aria-hidden="true">
            <CloudBank />
        </div>
        {SPECKS.map((s) => (
            <span
                key={s.left}
                className="diary-speck"
                style={{ left: s.left, top: s.top, rotate: `${s.rot}deg`, animationDelay: s.delay }}
                aria-hidden="true"
            />
        ))}
    </>
);

export default HeroSky;
