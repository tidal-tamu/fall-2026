/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                pixel: ['"Press Start 2P"', "monospace"],
                mono: ['"Space Mono"', "ui-monospace", "Menlo", "monospace"],
            },
            colors: {
                /* Never pure black — #111110 reads warmer and avoids the
                   flat, over-contrasted look of #000 on #fff. */
                ink: "#111110",
                paper: "#FFFFFF",
            },
        },
    },
    plugins: [],
};
