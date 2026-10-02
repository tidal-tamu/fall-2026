import type { CSSProperties } from "react";
import { PIXEL_CLOUD } from "./runnerSprites";
import { SPONSOR_RAIL_HEIGHT } from "./Sponsors";

/* -------------------------------------------------------------------------- */
/*  The hero's sky, after the "Summer Diary" reference: one big inked cumulus  */
/*  behind the wordmark, a plane trailing a contrail, and the runner game's    */
/*  little pixel clouds drifting across the top.                               */
/* -------------------------------------------------------------------------- */

/* Puffs as [cx, cy, r] in a 1000 x 460 box. Unioned by drawing them three
   times: a stroked pass for the outline, a hint-blue pass for the shading,
   then a smaller, slightly raised white pass that leaves the blue showing
   only along each puff's underside. */
const PUFFS: [number, number, number][] = [
    [150, 290, 105],
    [275, 215, 135],
    [425, 165, 165],
    [590, 185, 155],
    [745, 235, 125],
    [860, 295, 95],
    [500, 290, 175],
    [330, 310, 120],
    [680, 310, 120],
    [215, 355, 62],
    [335, 378, 70],
    [470, 390, 72],
    [610, 385, 70],
    [745, 365, 64],
    [845, 340, 58],
];

const CloudBank = () => (
    <svg viewBox="0 0 1000 460" className="h-auto w-full overflow-visible" aria-hidden="true">
        <g fill="none" stroke="#383632" strokeWidth={5} vectorEffect="non-scaling-stroke">
            {PUFFS.map(([cx, cy, r]) => (
                <circle key={`o${cx}${cy}`} cx={cx} cy={cy} r={r} vectorEffect="non-scaling-stroke" />
            ))}
        </g>
        <g fill="#E6EBF0">
            {PUFFS.map(([cx, cy, r]) => (
                <circle key={`s${cx}${cy}`} cx={cx} cy={cy} r={r} />
            ))}
        </g>
        <g fill="#FFFFFF">
            {PUFFS.map(([cx, cy, r]) => (
                <circle key={`w${cx}${cy}`} cx={cx - 4} cy={cy - 12} r={r - 14} />
            ))}
        </g>
    </svg>
);

const PixelCloud = () => (
    <svg
        viewBox={`0 0 ${PIXEL_CLOUD[0].length} ${PIXEL_CLOUD.length}`}
        shapeRendering="crispEdges"
        className="h-auto w-[70px] md:w-[92px]"
        aria-hidden="true"
    >
        {PIXEL_CLOUD.flatMap((row, y) =>
            [...row].map((c, x) =>
                c === "k" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#85827A" /> : null,
            ),
        )}
    </svg>
);

/* Negative delays spread the clouds across the sky on first paint instead of
   having them all queue up off the right edge. */
const DRIFTERS = [
    { top: "13%", dur: "78s", delay: "-12s", rest: "14vw" },
    { top: "24%", dur: "104s", delay: "-61s", rest: "58vw" },
    { top: "9%", dur: "131s", delay: "-95s", rest: "80vw" },
];

const Plane = () => (
    <svg
        viewBox="0 0 300 90"
        className="absolute left-[4%] top-[15%] hidden w-[220px] md:block lg:w-[280px]"
        aria-hidden="true"
    >
        <path
            d="M4 86 C 90 70, 170 46, 262 22"
            fill="none"
            stroke="#8EA7C2"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="1 7"
        />
        <g transform="translate(262 20) rotate(-16)">
            <path
                d="M-14 0 L14 -1 L18 0 L14 1 Z M-3 0 L3 -9 L6 -9 L2 0 L6 9 L3 9 Z M-13 0 L-10 -5 L-8 -5 L-9 0 L-8 5 L-10 5 Z"
                fill="#FFFFFF"
                stroke="#111110"
                strokeWidth={1.4}
                strokeLinejoin="round"
            />
        </g>
    </svg>
);

const HeroSky = () => (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        {DRIFTERS.map((d) => (
            <div
                key={d.top}
                className="cloud-drift"
                style={{ top: d.top, "--dur": d.dur, "--delay": d.delay, "--rest": d.rest } as CSSProperties}
            >
                <PixelCloud />
            </div>
        ))}

        <Plane />

        {/* Same box the wordmark is centred in, so the bank sits behind it. */}
        <div
            className="absolute inset-x-0 top-0 flex items-center justify-center pt-10"
            style={{ bottom: `calc(${SPONSOR_RAIL_HEIGHT}px + var(--runner-h))` }}
        >
            <div className="w-[170vw] shrink-0 translate-y-[4%] md:w-[min(92vw,1120px)]">
                <CloudBank />
            </div>
        </div>
    </div>
);

export default HeroSky;
