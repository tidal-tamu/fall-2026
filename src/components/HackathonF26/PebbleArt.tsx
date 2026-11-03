import { cn } from "./ui";
const PENG = "#44515a";

const HEART = "M1 0h2v1h1V0h2v1h1v3h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1V4H0V1h1z";

const CAPE = "M-42 -59 Q-72 -38 -78 2 Q-62 9 -46 4 Q-30 10 -14 4 Q2 10 18 4 Q32 9 44 3 Q52 -34 46 -60 Z";

function Fish() {
    return (
        <>
            <path
                d="M-9 7 Q0 3 9 7 L3 -8 L-3 -8 Z"
                fill="#c6d8e2"
                stroke={PENG}
                strokeWidth="2.4"
                strokeLinejoin="round"
            />
            <path
                d="M0 -64 C12 -58 15 -38 11 -22 C9 -14 5 -9 2 -7 L-2 -7 C-5 -9 -9 -14 -11 -22 C-15 -38 -12 -58 0 -64 Z"
                fill="#c6d8e2"
                stroke={PENG}
                strokeWidth="2.6"
                strokeLinejoin="round"
            />
            <path d="M-8 -41 Q0 -36 8 -41" fill="none" stroke={PENG} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="0" cy="-50" r="5" fill="#fff" stroke={PENG} strokeWidth="2.2" />
            <circle cx=".8" cy="-49.4" r="2.3" fill={PENG} />
        </>
    );
}

export function PebbleArt() {
    return (
        <svg className="block h-auto w-full overflow-visible" viewBox="-86 -180 176 192">
            <defs>
                <pattern id="bpDots" width="5" height="5" patternUnits="userSpaceOnUse">
                    <circle cx="2.5" cy="2.5" r="1" fill="#93b5cc" />
                </pattern>
            </defs>
            <g className={cn(
                "bp-cape [transform-origin:-20px_-60px]",
                "animate-pebble-cape",
            )}>
                <path d={CAPE} fill="#b4cadb" stroke={PENG} strokeWidth="2.6" strokeLinejoin="round" />
                <path d={CAPE} fill="url(#bpDots)" />
                <path
                    d="M-38 -50 Q-58 -30 -64 -2"
                    fill="none"
                    stroke="#f1f7fb"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                />
            </g>
            <ellipse cx="-14" cy="-1" rx="10" ry="4.5" fill="#f9e4cf" stroke={PENG} strokeWidth="2" />
            <ellipse cx="14" cy="-1" rx="10" ry="4.5" fill="#f9e4cf" stroke={PENG} strokeWidth="2" />
            <path
                d="M-36 -14 C-44 -46 -42 -96 -10 -114 C18 -126 44 -100 46 -60 C48 -40 44 -22 38 -12 C38 -2 30 4 18 3 C10 2 6 -2 0 -2 C-6 -2 -10 2 -18 3 C-30 4 -38 -2 -36 -14 Z"
                fill={PENG}
            />
            <path
                d="M-28 -16 C-34 -40 -32 -74 -22 -88 C-14 -99 -4 -99 -2 -88 C-1 -83 -2 -79 -4 -77 L6 -77 C4 -79 3 -83 4 -88 C6 -99 18 -100 26 -88 C36 -72 38 -44 32 -18 C28 -8 18 -9 0 -9 C-16 -9 -26 -8 -28 -16 Z"
                fill="#fbfdff"
            />
            <ellipse cx="-21" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf" />
            <ellipse cx="23" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf" />
            <g className={cn(
                "bp-eyes [transform-box:fill-box] [transform-origin:50%_50%]",
                "animate-pebble-blink",
            )}>
                <ellipse cx="-13" cy="-80" rx="3.6" ry="3.4" fill={PENG} />
                <ellipse cx="15" cy="-80" rx="3.6" ry="3.4" fill={PENG} />
            </g>
            <ellipse cx="1" cy="-74" rx="7.5" ry="4.6" fill="#f9e4cf" stroke={PENG} strokeWidth="2.6" />
            <path d="M-34 -50 C-50 -48 -56 -32 -50 -22 C-46 -16 -38 -22 -34 -30 Z" fill={PENG} />
            <path
                d="M-42 -63 Q2 -51 47 -64 Q51 -60 47 -56 Q2 -43 -41 -55 Q-46 -59 -42 -63 Z"
                fill="#b4cadb"
                stroke={PENG}
                strokeWidth="2.2"
                strokeLinejoin="round"
            />
            <path
                d="M-35 -59.5 Q2 -50 39 -60.5"
                fill="none"
                stroke="#f1f7fb"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <path
                d={HEART}
                transform="translate(-2.2,-54.5) scale(1.15)"
                fill="#7fa7c4"
                stroke={PENG}
                strokeWidth=".6"
                shapeRendering="crispEdges"
            />
            <g transform="translate(58,-70) rotate(16)">
                <Fish />
            </g>
            <path d="M33 -50 C38 -68 58 -82 66 -72 C70 -62 56 -48 40 -40 Z" fill={PENG} />
        </svg>
    );
}

export function WalkingPebble() {
    return (
        <svg className="block h-auto w-full overflow-visible" viewBox="-60 -150 130 160">
            <defs>
                <pattern id="wDots" width="5" height="5" patternUnits="userSpaceOnUse">
                    <circle cx="2.5" cy="2.5" r="1" fill="#93b5cc" />
                </pattern>
            </defs>
            <g className="w-cape group-[.walking]/walker:animate-walking-cape [transform-origin:40px_-60px]">
                <path
                    d="M-42 -59 Q-60 -40 -62 -12 Q-50 -4 -38 -8 Q-26 -2 -12 -6 Q4 0 18 -5 Q32 0 42 -6 Q50 -36 46 -60 Z"
                    fill="#b4cadb"
                    stroke={PENG}
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                />
                <path
                    d="M-42 -59 Q-60 -40 -62 -12 Q-50 -4 -38 -8 Q-26 -2 -12 -6 Q4 0 18 -5 Q32 0 42 -6 Q50 -36 46 -60 Z"
                    fill="url(#wDots)"
                />
            </g>
            <ellipse
                className="w-foot a [transform:translateY(var(--step,_0))]"
                cx="-14"
                cy="-1"
                rx="10"
                ry="4.5"
                fill="#f9e4cf"
                stroke={PENG}
                strokeWidth="2"
            />
            <ellipse
                className="w-foot b [transform:translateY(var(--stepb,_0))]"
                cx="14"
                cy="-1"
                rx="10"
                ry="4.5"
                fill="#f9e4cf"
                stroke={PENG}
                strokeWidth="2"
            />
            <g className="w-body [transform:rotate(var(--sway,_0deg))]">
                <path
                    d="M-36 -14 C-44 -46 -42 -96 -10 -114 C18 -126 44 -100 46 -60 C48 -40 44 -22 38 -12 C38 -2 30 4 18 3 C10 2 6 -2 0 -2 C-6 -2 -10 2 -18 3 C-30 4 -38 -2 -36 -14 Z"
                    fill={PENG}
                />
                <path
                    d="M-28 -16 C-34 -40 -32 -74 -22 -88 C-14 -99 -4 -99 -2 -88 C-1 -83 -2 -79 -4 -77 L6 -77 C4 -79 3 -83 4 -88 C6 -99 18 -100 26 -88 C36 -72 38 -44 32 -18 C28 -8 18 -9 0 -9 C-16 -9 -26 -8 -28 -16 Z"
                    fill="#fbfdff"
                />
                <ellipse cx="-21" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf" />
                <ellipse cx="23" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf" />
                <g className="w-eyes [transform-box:fill-box] [transform-origin:50%_50%] animate-walker-blink">
                    <ellipse cx="-11" cy="-80" rx="3.6" ry="3.4" fill={PENG} />
                    <ellipse cx="17" cy="-80" rx="3.6" ry="3.4" fill={PENG} />
                </g>
                <ellipse cx="3" cy="-74" rx="7.5" ry="4.6" fill="#f9e4cf" stroke={PENG} strokeWidth="2.6" />
                <path d="M-34 -50 C-50 -48 -56 -32 -50 -22 C-46 -16 -38 -22 -34 -30 Z" fill={PENG} />
                <path d="M38 -50 C54 -48 60 -32 54 -22 C50 -16 42 -22 38 -30 Z" fill={PENG} />
                <path
                    d="M-42 -63 Q2 -51 47 -64 Q51 -60 47 -56 Q2 -43 -41 -55 Q-46 -59 -42 -63 Z"
                    fill="#b4cadb"
                    stroke={PENG}
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                />
                <path
                    d={HEART}
                    transform="translate(-2.2,-54.5) scale(1.15)"
                    fill="#7fa7c4"
                    shapeRendering="crispEdges"
                />
            </g>
        </svg>
    );
}
