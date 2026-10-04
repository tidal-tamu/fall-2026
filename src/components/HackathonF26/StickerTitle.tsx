import { useId } from "react";

/* -------------------------------------------------------------------------- */
/*  "tidal / BYTE" as a die-cut sticker, after the Summer Diary title: light   */
/*  blue letters with an ink outline, a fat rounded white border and a soft    */
/*  shadow, every letter knocked slightly off its baseline. The '26 rides on   */
/*  top like the reference's umbrella. SVG so the white border can be a real   */
/*  round-joined stroke rather than a stack of text-shadows.                   */
/*                                                                            */
/*  Colours come from --sticker-fill / --sticker-ink / --sticker-edge, so the  */
/*  glitch copies can recolour it without new markup.                          */
/* -------------------------------------------------------------------------- */

const F = 100; // font size in svg units; Press Start 2P advances exactly 1em
const PAD = 28; // room for the white border and its shadow

type Glyph = { ch: string; x: number; y: number; size: number; rot: number };

/* Fixed jitter, not random, so the title never reshuffles between renders. */
const word = (text: string, x0: number, base: number, size: number, rots: number[], lifts: number[]) =>
    [...text].map(
        (ch, i): Glyph => ({
            ch,
            x: x0 + i * size,
            y: base + (lifts[i % lifts.length] * size) / 100,
            size,
            rot: rots[i % rots.length],
        }),
    );

const WORDS: Glyph[] = [
    ...word("tidal", 0, F, F, [-5, 3, -2, 4, -3], [2, -3, 1, -2, 3]),
    ...word("BYTE", 0.9 * F, 2.3 * F, F, [3, -4, 2, -3], [-2, 2, -3, 1]),
];

/* The '26 tag sits on one baseline and tilts as a single piece; tilting each
   glyph on its own dropped the apostrophe low enough to read as a decimal. */
const TAG_SIZE = 0.5 * F;
const TAG_X = 4.98 * F;
const TAG_BASE = 1.5 * F;
const TAG = word("'26", TAG_X, TAG_BASE, TAG_SIZE, [0], [0]);
const TAG_TILT = `rotate(-14 ${TAG_X + 1.5 * TAG_SIZE} ${TAG_BASE - 0.5 * TAG_SIZE})`;

const ALL = [...WORDS, ...TAG];
const minX = Math.min(...ALL.map((g) => g.x)) - PAD;
const maxX = Math.max(...ALL.map((g) => g.x + g.size)) + PAD;
const minY = Math.min(...ALL.map((g) => g.y - g.size)) - PAD;
const maxY = Math.max(...ALL.map((g) => g.y)) + PAD;
const VIEWBOX = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

const spin = (g: Glyph) => `rotate(${g.rot} ${g.x + 0.44 * g.size} ${g.y - 0.44 * g.size})`;

/* One pass of letters: the white borders (edge) or the inked faces (ink). */
const Letters = ({ edge }: { edge: boolean }) => {
    const draw = (g: Glyph, i: number) => (
        <text
            key={i}
            x={g.x}
            y={g.y}
            fontSize={g.size}
            transform={g.rot ? spin(g) : undefined}
            strokeWidth={(edge ? 0.32 : 0.055) * g.size}
        >
            {g.ch}
        </text>
    );
    return (
        <>
            {WORDS.map(draw)}
            <g transform={TAG_TILT}>{TAG.map(draw)}</g>
        </>
    );
};

const StickerTitle = () => {
    const shadow = `${useId().replace(/:/g, "")}-shadow`;
    return (
        <svg viewBox={VIEWBOX} className="sticker-title__svg" aria-hidden="true">
            <defs>
                <filter id={shadow} x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#33404c" floodOpacity="0.22" />
                </filter>
            </defs>
            {/* every white border first, so neighbouring letters fuse into one sticker */}
            <g className="sticker-title__edge" filter={`url(#${shadow})`}>
                <Letters edge />
            </g>
            <g className="sticker-title__ink">
                <Letters edge={false} />
            </g>
        </svg>
    );
};

export default StickerTitle;
