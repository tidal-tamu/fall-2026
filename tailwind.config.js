/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                pixel: ['"Press Start 2P"', "monospace"],
                hand: ["Gaegu", "cursive"],
            },
            colors: {
                /* TIDALbyte — y2k sketchbook palette */
                byte: {
                    bg: "#130E37",
                    ink: "#E8E6FF",
                    dim: "#A9A5E0",
                    pink: "#FF9DE2",
                    hotpink: "#FF54C8",
                    peri: "#7B7BF0",
                    blue: "#4D5DEB",
                    coin: "#FFD84D",
                    paper: "#EDEAF8",
                    gold: "#D9B84A",
                    mint: "#9BE8D8",
                },
            },
        },
    },
    plugins: [],
};
