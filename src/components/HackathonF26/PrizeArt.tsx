const INK = "#333f48";

const PENG = "#44515a";

const HEART = "M1 0h2v1h1V0h2v1h1v3h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1V4H0V1h1z";

const outline = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" } as const;

function Scooter() {
    return (
        <>
            <ellipse cx="100" cy="186" rx="74" ry="9" fill="rgba(241,247,251,.16)" />
            <path d="M150 156 L132 46" stroke={INK} strokeWidth="12" strokeLinecap="round" />
            <path d="M150 156 L132 46" stroke="#c6d8e2" strokeWidth="5" strokeLinecap="round" />
            <path d="M112 44 H152" stroke={INK} strokeWidth="10" strokeLinecap="round" />
            <path d="M112 44 H152" stroke="#dfe7ee" strokeWidth="4" strokeLinecap="round" />
            <circle cx="112" cy="44" r="7" fill="#efd3b8" {...outline} />
            <circle cx="152" cy="44" r="7" fill="#efd3b8" {...outline} />
            <rect x="36" y="146" width="118" height="15" rx="7.5" fill="#b4cadb" {...outline} />
            <path d="M50 153 h80" stroke="#dfe7ee" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="170" r="17" fill={PENG} {...outline} />
            <circle cx="50" cy="170" r="6" fill="#dfe7ee" />
            <circle cx="152" cy="170" r="17" fill={PENG} {...outline} />
            <circle cx="152" cy="170" r="6" fill="#dfe7ee" />
            <circle cx="139" cy="84" r="6" fill="#f9e4cf" {...outline} />
        </>
    );
}

function Keyboard() {
    return (
        <>
            <ellipse cx="100" cy="186" rx="74" ry="9" fill="rgba(241,247,251,.16)" />
            <path
                d="M100 86 C100 58 140 64 134 26"
                fill="none"
                stroke="#c6d8e2"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <rect x="16" y="84" width="168" height="82" rx="14" fill="#dfe7ee" {...outline} />
            {Array.from({ length: 27 }, (_, index) => {
                const row = Math.floor(index / 9);
                const column = index % 9;
                return <rect
                    key={index}
                    x={28 + column * 16.3}
                    y={96 + row * 16}
                    width="12.5"
                    height="12"
                    rx="3"
                    fill={row === 1 && column === 4 ? "#efd3b8" : "#fbfdff"}
                    stroke={INK}
                    strokeWidth="1.6"
                />;
            })}
            <rect x="62" y="146" width="76" height="11" rx="3" fill="#fbfdff" stroke={INK} strokeWidth="1.6" />
        </>
    );
}

function Camera() {
    return (
        <>
            <ellipse cx="100" cy="186" rx="74" ry="9" fill="rgba(241,247,251,.16)" />
            <g transform="rotate(-9 90 60)">
                <rect x="52" y="22" width="76" height="62" rx="3" fill="#fbfdff" {...outline} />
                <rect x="60" y="30" width="60" height="38" fill="#f9e4cf" />
                <circle cx="104" cy="44" r="7" fill="#efd3b8" />
                <path d="M60 68 L80 52 L94 62 L106 54 L120 68 Z" fill="#b4cadb" />
            </g>
            <rect x="28" y="66" width="144" height="108" rx="24" fill="#c6d8e2" {...outline} />
            <path d="M28 146 H172" stroke="#b4cadb" strokeWidth="8" />
            <circle cx="100" cy="120" r="35" fill={PENG} {...outline} />
            <circle cx="100" cy="120" r="22" fill="#2c363e" stroke="#9fb1be" strokeWidth="3" />
            <circle cx="92" cy="112" r="6" fill="#fbfdff" opacity=".85" />
            <rect x="42" y="78" width="28" height="17" rx="4" fill="#fbfdff" stroke={INK} strokeWidth="2.5" />
            <circle cx="152" cy="86" r="7" fill="#efd3b8" stroke={INK} strokeWidth="2.5" />
        </>
    );
}

function Tablet() {
    return (
        <>
            <ellipse cx="100" cy="186" rx="74" ry="9" fill="rgba(241,247,251,.16)" />
            <g transform="rotate(-10 100 118)">
                <rect x="24" y="66" width="152" height="108" rx="16" fill={PENG} {...outline} />
                <rect x="38" y="78" width="124" height="84" rx="6" fill="#e6f1f9" />
                <path
                    d="M52 140 q20 -44 42 -12 t44 -22"
                    fill="none"
                    stroke="#7fa7c4"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                <circle cx="132" cy="104" r="9" fill="#f9e4cf" />
            </g>
            <g transform="rotate(32 150 80)">
                <rect x="144" y="18" width="13" height="92" rx="6.5" fill="#fbfdff" {...outline} />
                <path
                    d="M144 108 L150.5 126 L157 108 Z"
                    fill="#efd3b8"
                    stroke={INK}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
            </g>
        </>
    );
}

function Handheld() {
    return (
        <>
            <ellipse cx="100" cy="186" rx="74" ry="9" fill="rgba(241,247,251,.16)" />
            <rect x="54" y="20" width="92" height="156" rx="18" fill="#cdd8cb" {...outline} />
            <rect x="64" y="32" width="72" height="62" rx="6" fill={PENG} {...outline} />
            <rect x="72" y="40" width="56" height="46" fill="#b4cadb" />
            <path d={HEART} transform="translate(89 52) scale(3)" fill="#fbfdff" shapeRendering="crispEdges" />
            <path d="M74 124 h26 M87 111 v26" stroke={PENG} strokeWidth="8" />
            <circle cx="118" cy="128" r="7.5" fill="#efd3b8" {...outline} />
            <circle cx="131" cy="116" r="7.5" fill="#efd3b8" {...outline} />
            <path d="M84 156 l9 -4 M102 156 l9 -4" stroke={PENG} strokeWidth="4" strokeLinecap="round" />
        </>
    );
}

function Plush() {
    return (
        <>
            <ellipse cx="100" cy="186" rx="74" ry="9" fill="rgba(241,247,251,.16)" />
            <g transform="translate(100 182) scale(1.32)">
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
                <ellipse cx="-13" cy="-80" rx="3.6" ry="3.2" fill={PENG} />
                <ellipse cx="15" cy="-80" rx="3.6" ry="3.2" fill={PENG} />
                <ellipse cx="1" cy="-74" rx="7.5" ry="4.6" fill="#f9e4cf" stroke={PENG} strokeWidth="2.6" />
                <path d="M-34 -50 C-50 -48 -56 -32 -50 -22 C-46 -16 -38 -22 -34 -30 Z" fill={PENG} />
                <path d="M38 -50 C54 -48 60 -32 54 -22 C50 -16 42 -22 38 -30 Z" fill={PENG} />
            </g>
        </>
    );
}

const illustrations = [Scooter, Keyboard, Camera, Tablet, Handheld, Plush];

export default function PrizeArt({ index, label, className }: {
    className?: string;
    index: number;
    label?: string;
}) {
    const Illustration = illustrations[index];
    return (
        <svg
            className={className}
            viewBox="0 0 200 200"
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
        >
            <Illustration />
        </svg>
    );
}
