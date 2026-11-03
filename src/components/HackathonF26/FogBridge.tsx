import { useId } from "react";

/** Continue the road into mist, entirely below the hero's viewport. */
export default function FogBridge() {
    const id = useId();
    return (
        <svg
            className="pointer-events-none absolute inset-x-0 top-0 h-[200px] w-full overflow-hidden max-[760px]:h-[140px]"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient id={`${id}-road`} x2="0" y2="1">
                    <stop stopColor="#8e9da9" />
                    <stop offset=".18" stopColor="#b8c8d4" stopOpacity=".9" />
                    <stop offset=".6" stopColor="#dce7ef" stopOpacity=".65" />
                    <stop offset="1" stopColor="#e6eef4" stopOpacity="0" />
                </linearGradient>
                <linearGradient id={`${id}-mist`} x2="0" y2="1">
                    <stop stopColor="#f4f8fb" stopOpacity=".05" />
                    <stop offset=".3" stopColor="#f4f8fb" stopOpacity=".75" />
                    <stop offset="1" stopColor="#e6eef4" stopOpacity="0" />
                </linearGradient>
                <filter id={`${id}-soft`} x="-10%" y="-50%" width="120%" height="200%">
                    <feGaussianBlur stdDeviation="10" />
                </filter>
            </defs>
            <path fill={`url(#${id}-road)`} d="M0 0H1440V200H0Z" />
            <g fill={`url(#${id}-mist)`} filter={`url(#${id}-soft)`}>
                <path d="M-80 32C90 3 132 61 300 32S520 9 690 37 925 9 1090 30 1310 4 1520 29V190H-80Z" />
                <path d="M-80 72C90 105 180 43 360 67S600 107 790 65 1020 100 1190 68 1400 57 1520 77V200H-80Z" opacity=".75" />
            </g>
            <g fill="#f4f8fb" filter={`url(#${id}-soft)`}>
                <path d="M-80 34C90 4 160 54 340 29S590 55 790 27 1020 46 1210 24 1400 43 1520 25L1520 40C1370 62 1300 39 1130 51S900 43 720 55 470 44 300 56 100 33-80 52Z" opacity=".35" />
                <path d="M-80 88C120 62 220 103 420 78S690 105 890 78 1180 104 1520 70L1520 84C1230 123 1110 96 910 103S620 106 440 99 130 101-80 108Z" opacity=".3" />
            </g>
        </svg>
    );
}
