/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                pixel: ['"Press Start 2P"', "monospace"],
                mono: ['"Space Mono"', "ui-monospace", "Menlo", "monospace"],
                grotesk: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
            },
            colors: {
                /* Monochrome Y2K. Never pure black — #111110 reads warmer and
                   avoids the flat, over-contrasted look of #000 on #fff. */
                ink: "#111110",
                paper: "#FFFFFF",
                mid: "#6B6862",
                dim: "#A3A099",
                rule: "rgba(17,17,16,0.14)",
                shade: {
                    100: "#F4F3F1",
                    200: "#E4E2DD",
                    300: "#CFCCC5",
                    400: "#ADAAA2",
                    500: "#85827A",
                    600: "#5C5A54",
                    700: "#383632",
                },
            },
            letterSpacing: {
                label: "0.22em", // uppercase mono eyebrows
                tight: "-0.035em", // huge grotesk headlines
            },
            keyframes: {
                blink: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
                "marquee-scroll": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
            },
            animation: {
                blink: "blink 1s step-end infinite",
                "marquee-scroll": "marquee-scroll 30s linear infinite",
            },
        },
    },
    plugins: [],
};
