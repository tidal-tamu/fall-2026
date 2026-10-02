/* -------------------------------------------------------------------------- */
/*  Pixel art for the hero's runner game, drawn as strings so it stays         */
/*  editable without an image editor. One character is one pixel:              */
/*    .  transparent   k  ink        g  sheen grey    w  white                 */
/*    b  blush         h  hint blue                                            */
/*  Placeholder art: swap in real sprites by keeping the same row lengths.     */
/* -------------------------------------------------------------------------- */

const PALETTE: Record<string, string> = {
    k: "#111110",
    g: "#CFCCC5",
    w: "#FFFFFF",
    b: "#ADAAA2",
    h: "#8EA7C2",
};

/* The penguin, facing right: ink back, white face and belly, a hint-blue
   scarf whose tail streams behind it. Rows 0-13 are the body; the last row
   is the feet. */
const PENGUIN_BODY = [
    "......kkkkk.....",
    "....kkgkkkkkk...",
    "...kkkkkkwwwwk..",
    "...kkkkkwwwkwk..",
    "..kkkkkkwwwwwwkk",
    "..kkkkkkkwwwbk..",
    "..khhhhhhhhhhk..",
    "hhkkkkkkkwwwwk..",
    ".kkkkkkkwwwwwk..",
    "kkkkkkkwwwwwwk..",
    ".kkkkkkwwwwwwk..",
    "..kkkkkwwwwwwk..",
    "..kkkkkwwwwwk...",
    "...kkkkkkkkkk...",
];

// Rows 2-4 again with the eye knocked into an "x" for a crash.
const PENGUIN_DAZED_EYE = [
    "...kkkkkkwkwkk..",
    "...kkkkkwwwkwk..",
    "..kkkkkkwwkwkwkk",
];

const FEET = {
    a: "...kk....kk.....",
    b: ".....kk.kk......",
    tuck: "....kk..kk......",
};

export const PENGUIN = {
    runA: [...PENGUIN_BODY, FEET.a],
    runB: [...PENGUIN_BODY, FEET.b],
    jump: [...PENGUIN_BODY, FEET.tuck],
    dazed: [
        ...PENGUIN_BODY.slice(0, 2),
        ...PENGUIN_DAZED_EYE,
        ...PENGUIN_BODY.slice(5),
        FEET.a,
    ],
};

const BUG_BODY = [
    "..k......k..",
    "...k....k...",
    "..kkkkkkkk..",
    ".kkwkkkkwkk.",
    "kkkkkkkkkkkk",
    ".kkkkkkkkkk.",
];

export const BUG = {
    a: [...BUG_BODY, ".k..k..k..k.", "k..k..k..k.."],
    b: [...BUG_BODY, ".k..k..k..k.", "..k..k..k..k"],
};

export const WARNING = [
    "......k......",
    ".....kwk.....",
    ".....kwk.....",
    "....kwkwk....",
    "....kwkwk....",
    "...kwwkwwk...",
    "...kwwkwwk...",
    "..kwwwkwwwk..",
    ".kwwwwwwwwwk.",
    ".kwwwwkwwwwk.",
    "kwwwwwwwwwwwk",
    "kkkkkkkkkkkkk",
];

export const COFFEE = [
    "..k..k....",
    "...k..k...",
    "..........",
    "kkkkkkkk..",
    "kwwwwwwkkk",
    "kwhhhhwk.k",
    "kwhhhhwkkk",
    "kwwwwwwk..",
    ".kwwwwk...",
    "..kkkk....",
];

/* Dino-style outline cloud for the sky behind the hero. */
export const PIXEL_CLOUD = [
    ".........kkkkk.........",
    ".......kk.....kk.......",
    "......k.........k......",
    "..kkkk...........kk....",
    ".k..................k..",
    "k....................k.",
    "k.....................k",
    "kkkkkkkkkkkkkkkkkkkkkkk",
];

export type Sprite = { img: HTMLCanvasElement; w: number; h: number };

/* Bake rows into a 1px-per-cell canvas once; the game scales it up with
   image smoothing off, so every frame is a few drawImage calls rather than
   hundreds of fillRects. */
export function bake(rows: string[]): Sprite {
    const h = rows.length;
    const w = rows[0].length;
    const img = document.createElement("canvas");
    img.width = w;
    img.height = h;
    const ctx = img.getContext("2d");
    if (ctx) {
        rows.forEach((row, y) => {
            for (let x = 0; x < w; x++) {
                const fill = PALETTE[row[x]];
                if (!fill) continue;
                ctx.fillStyle = fill;
                ctx.fillRect(x, y, 1, 1);
            }
        });
    }
    return { img, w, h };
}
