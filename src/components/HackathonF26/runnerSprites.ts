/* -------------------------------------------------------------------------- */
/*  Pixel art for the hero's runner game, drawn as strings so it stays         */
/*  editable without an image editor. One character is one pixel:              */
/*    .  transparent   k  ink        g  Pebble grey   w  white                 */
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

/* Pebble, facing right. Rows 0-13 are the body; the last row is the feet. */
const PEBBLE_BODY = [
    "......kkkkk.....",
    "....kkgggggkk...",
    "...kgwwgggggk...",
    "..kgwwgggggggk..",
    "..kggggkgggkgk..",
    ".kggggkgkgkgkgk.",
    ".kgggggbgkgbggk.",
    ".kgggggkgggkggk.",
    ".kggggggkkkgggk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    "kgggggggggggggk.",
    "kgggggggggggggk.",
    ".kkkkkkkkkkkkk..",
];

// Closed "^ ^" eyes become flat lines when Pebble hits something.
const PEBBLE_DAZED_EYES = ["..kggggggggggk..", ".kgggkkkgkkkggk."];

const FEET = {
    a: "...kk.....kk....",
    b: ".....kk.kk......",
    tuck: "....kk...kk.....",
};

export const PEBBLE = {
    runA: [...PEBBLE_BODY, FEET.a],
    runB: [...PEBBLE_BODY, FEET.b],
    jump: [...PEBBLE_BODY, FEET.tuck],
    dazed: [
        ...PEBBLE_BODY.slice(0, 4),
        ...PEBBLE_DAZED_EYES,
        ...PEBBLE_BODY.slice(6),
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
