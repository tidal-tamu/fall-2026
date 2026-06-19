/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                pixel: ['"Press Start 2P"', "monospace"],
                vt323: ['"VT323"', "monospace"],
                mont: ["Montserrat", "sans-serif"],
                inter: ["Inter", "sans-serif"],
            },
            colors: {
                y2k: {
                    navy: "#0B0B2B",
                    darkNavy: "#060618",
                    pink: "#FF69B4",
                    hotPink: "#FF1493",
                    purple: "#9B59B6",
                    blue: "#00BFFF",
                    cyan: "#00FFFF",
                    gold: "#FFD700",
                    yellow: "#FFEB3B",
                    lavender: "#C8A2E8",
                },
            },
            keyframes: {
                "float-gentle": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-12px)" },
                },
                "pulse-glow": {
                    "0%, 100%": { opacity: "0.6", filter: "brightness(1)" },
                    "50%": { opacity: "1", filter: "brightness(1.3)" },
                },
                blink: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
                scanline: {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(100%)" },
                },
                "marquee-scroll": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                "star-twinkle": {
                    "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
                    "50%": { opacity: "1", transform: "scale(1.2)" },
                },
            },
            animation: {
                "float-gentle": "float-gentle 4s ease-in-out infinite",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                blink: "blink 1s step-end infinite",
                scanline: "scanline 8s linear infinite",
                "marquee-scroll": "marquee-scroll 30s linear infinite",
                "star-twinkle": "star-twinkle 3s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
