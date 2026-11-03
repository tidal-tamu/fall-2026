import type { CSSProperties } from "react";
import { cn } from "./ui";
import { useEffect, useRef, useState } from "react";
import { type MotionValue } from "framer-motion";
const sunGlow: CSSProperties = {
    "backgroundImage": "radial-gradient(circle, var(--sunCore, #fdf6ec) 0 28%, var(--sunGlow, rgba(249, 228, 207, .5)) 44%, rgba(249, 228, 207, 0) 70%)"
};

type Color = [
    number,
    number,
    number
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
// OKLab interpolation keeps the original day-to-night color transitions smooth.

const toLin = (c: number) => (c /= 255) <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;

const toSrgb = (c: number) => 255 * (c <= .0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - .055);

function ok(hex: string): Color {
    const [r, g, b] = [1, 3, 5].map(i => toLin(parseInt(hex.slice(i, i + 2), 16)));
    const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b);
    const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b);
    const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
    return [.2104542553 * l + .7936177850 * m - .0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .8086757660 * s];
}

function rgb([L, a, b]: Color) {
    const l = (L + .3963377774 * a + .2158037573 * b) ** 3;
    const m = (L - .1055613458 * a - .0638541728 * b) ** 3;
    const s = (L - .0894841775 * a - 1.2914855480 * b) ** 3;
    const R = 4.0767416621 * l - 3.3077115913 * m + .2309699292 * s;
    const G = -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s;
    const B = -.0041960863 * l - .7034186147 * m + 1.7076147010 * s;
    return `rgb(${[R, G, B].map(v => Math.round(clamp(toSrgb(Math.max(0, v)), 0, 255))).join(',')})`;
}

const stops: [
    number,
    string,
    string
][] = [
        [0, '#e6eef4', '#f4f8fb'], [.2, '#dce9f3', '#f1f6fa'], [.4, '#e1e8f0', '#f7f0e6'], [.55, '#e3e1ea', '#f7e6d5'],
        [.66, '#dad5e3', '#f3d9c6'], [.76, '#c6c3d6', '#ecc9bb'], [.84, '#a5a9c0', '#dbb7b3'], [.91, '#727d96', '#a99aa8'],
        [.96, '#46536a', '#6c6f86'], [1, '#2b3640', '#414c5e']
    ];

const SKY = stops.map(([p, a, b]): [
    number,
    Color,
    Color
] => [p, ok(a), ok(b)]);

const mix = (a: Color, b: Color, k: number): Color => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

function skyAt(p: number): [
    Color,
    Color
] {
    for (let i = 1; i < SKY.length; i++) {
        if (p <= SKY[i][0]) {
            const [a, A1, A2] = SKY[i - 1];
            const [b, B1, B2] = SKY[i];
            const k = (p - a) / (b - a);
            return [mix(A1, B1, k), mix(A2, B2, k)];
        }
    }
    return [SKY[SKY.length - 1][1], SKY[SKY.length - 1][2]];
}

const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

function Cloud() {
    return (
        <svg className="block h-auto w-full overflow-visible" viewBox="0 0 300 140">
            <path
                d="M34 122 C10 122 8 94 32 92 C26 68 54 54 76 66 C82 36 118 24 142 42 C154 16 198 14 210 44 C232 32 264 46 260 72 C286 74 294 106 272 120 Z"
                fill="#fbfdff"
            />
            <path
                d="M38 120 C44 106 64 102 80 110 C94 96 122 96 134 108 C152 94 184 96 194 108 C212 98 242 100 256 116 L262 120 Z"
                fill="#e3edf6"
            />
            <path
                d="M34 122 C10 122 8 94 32 92 C26 68 54 54 76 66 C82 36 118 24 142 42 C154 16 198 14 210 44 C232 32 264 46 260 72 C286 74 294 106 272 120 Z"
                fill="none"
                stroke="#4b5866"
                strokeWidth="2.4"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const clouds = [[9, 230, 190], [26, 170, 240], [52, 260, 210], [70, 150, 260]];

export default function LevelSky({ progress }: {
    progress: MotionValue<number>;
}) {
    const sky = useRef<HTMLDivElement>(null);
    const [cloudScale] = useState(() => Math.max(0.55, Math.min(1, window.innerWidth / 1200)));
    useEffect(() => {
        const element = sky.current;
        if (!element)
            return;
        const paint = (position: number) => {
            element.parentElement?.classList.toggle("is-night", position > 0.93);
            const [top, bottom] = skyAt(position);
            const night = smooth(0.86, 0.99, position);
            const sun = clamp(position / 0.84);
            element.style.setProperty("--skyTop", rgb(top));
            element.style.setProperty("--skyBot", rgb(bottom));
            element.style.setProperty("--night", night.toFixed(3));
            element.style.setProperty("--sunX", `${(10 + sun * 74).toFixed(2)}%`);
            const sunY = sun < 0.45
                ? 30 - 20 * Math.sin(Math.PI * sun / 0.9)
                : 10 + ((sun - 0.45) / 0.55) ** 1.5 * 92;
            element.style.setProperty("--sunY", `${sunY.toFixed(2)}%`);
            element.style.setProperty("--sunCore", rgb(mix(ok("#fdf6ec"), ok("#f6c9a4"), smooth(0.45, 1, sun))));
            element.style.setProperty("--sunA", (1 - smooth(0.9, 1, sun)).toFixed(3));
        };
        paint(progress.get());
        return progress.on("change", paint);
    }, [progress]);
    return (
        <div className={cn(
            "fixed top-0 right-0 bottom-0 left-0 z-[-1] pointer-events-none",
            "bg-[linear-gradient(180deg,_var(--skyTop,_#e9f0f5)_0%,_var(--skyBot,_#f3f7fa)_100%)]",
            "[--night:0]",
        )} id="sky" ref={sky} aria-hidden="true">
            <div className={cn(
                "sun absolute left-[var(--sunX,_14%)] top-[var(--sunY,_18%)] w-[150px] h-[150px] mt-[-75px] mr-0",
                "mb-0 ml-[-75px] rounded-[50%]",
                "opacity-[var(--sunA,_1)]",
            )} style={sunGlow} />
            <div className={cn(
                "moon absolute right-[13%] top-[13%] w-[54px] h-[54px] rounded-[50%] bg-game-light",
                "shadow-[inset_-13px_-4px_0_#c6d8e2,_0_0_46px_rgba(241,_247,_251,_.3)] opacity-[var(--night)]",
                "[transform:translateY(calc((1_-_var(--night))_*_40px))] max-[760px]:top-[9%]",
                "max-[760px]:right-[6%] max-[760px]:w-[34px] max-[760px]:h-[34px]",
                "max-[760px]:shadow-[inset_-8px_-3px_0_#c6d8e2]",
            )} />
            <div className="stars absolute top-0 right-0 bottom-0 left-0 opacity-[var(--night)]">
                {Array.from({ length: 52 }, (_, index) => (<i className="absolute bg-game-light rounded-[1px] animate-star-twinkle"
                    key={index}
                    style={{ left: `${(index * 37.7 % 100).toFixed(1)}%`, top: `${(index * 61.3 % 88).toFixed(1)}%`, width: 2 + index % 3, height: 2 + index % 3, animationDelay: `-${index % 7 * 0.6}s` }}
                />))}
            </div>
            <div className="clouds2 absolute top-0 right-0 bottom-0 left-0 opacity-[calc(1_-_var(--night)_*_.75)]">
                {clouds.map(([top, width, duration], index) => (<div
                    key={index}
                    className="cl absolute left-0 animate-sky-cloud"
                    style={{ top: `${top}%`, width: Math.round(width * cloudScale), opacity: 0.9, animationDuration: `${duration}s`, animationDelay: `-${Math.round(index * duration / 3.3)}s` }}
                >
                    <Cloud />
                </div>))}
            </div>
        </div>
    );
}
