import type { ThreeElements } from "@react-three/fiber";

/* -------------------------------------------------------------------------- */
/*  Shared palette, dimensions and materials for the hero claw machine.       */
/* -------------------------------------------------------------------------- */

/* Monochrome Y2K. The cabinet is a hard black silhouette, the interior is a
   bright lightbox, and the prize balls run the full grey ramp from paper to
   ink. Never pure #000 — #111110 is warmer and less harsh against white. */
export const C = {
    ink: "#111110",
    paper: "#FFFFFF",
    /* interior of the cabinet — deliberately bright, so the black frame reads
       as a graphic outline and the grey balls have something to sit against */
    interior: "#F0EEEA",
    interiorSide: "#DFDDD7",
    floor: "#D2CFC9",
    frame: "#111110",
    frameEdge: "#33312C",
    chrome: "#B9B6AE",
    chromeDark: "#8A877F",
    screen: "#111110",
    screenInk: "#FFFFFF",
    dim: "#A3A099",
    mid: "#6B6862",
    glass: "#FFFFFF",
};

/* Prize balls across the full greyscale ramp — the variety that colour used to
   provide now comes entirely from value. */
export const BALL_COLORS = [
    "#FFFFFF",
    "#ECEAE6",
    "#D6D3CD",
    "#B4B1AA",
    "#8F8C84",
    "#6B6862",
    "#454340",
    "#1C1B19",
    "#E4E2DD",
    "#9C9992",
];

export const PIXEL_FONT = "/fonts/PressStart2P-Regular.ttf";

/* Cabinet dimensions ------------------------------------------------------- */
export const W = 6.0; // interior width
export const D = 3.4; // interior depth
export const GLASS_H = 3.3; // glass cabinet height
export const MARQUEE_H = 0.6; // header above the glass
export const BASE_H = 1.7; // base below the glass
export const POST = 0.13; // corner post thickness

/* The part that must stay on screen: glass + marquee. The base deliberately
   runs off the bottom edge on wide screens, which is what makes it feel like
   you are up close and looking *into* the cabinet. */
export const VISIBLE_H = GLASS_H + MARQUEE_H;
export const VISIBLE_MID = GLASS_H / 2 + MARQUEE_H / 2;
export const OUTER_W = W + POST * 2;
/* Mid-point of the entire cabinet, base included, for portrait framing. */
export const FULL_MID = (GLASS_H + MARQUEE_H - BASE_H) / 2;

/* Interior layout ---------------------------------------------------------- */
/* The pile is deliberately kept clear of the screen. Note that balls at the
   front of the pit sit much closer to the camera than the back wall, so
   perspective makes the near ones read higher than their actual height — the
   gap below the sub-line is larger than it looks in world units. */
export const FILL_H = 1.35; // settled height of the ball pit
/* Hard lid on the pit, set below the screen. Churning the pile loosens its
   packing and it re-settles taller than it started, so without this the balls
   creep up over the wordmark. */
export const PIT_CEILING = 1.85;
export const SCREEN_Y = 2.35;
export const TITLE_Y = 2.52;
export const SUB_Y = 2.15;
export const RAIL_Y = 3.1;
export const CLAW_Y = 2.88;
/* Parked left of centre, as on the real machines — keeps the claw clear of the
   centred wordmark instead of dangling across it. */
export const CLAW_X = -2.3;
export const CLAW_SCALE = 1.5; // the claw reads tiny at this cabinet width otherwise

/* -------------------------------------------------------------------------- */
/*  Materials                                                                 */
/* -------------------------------------------------------------------------- */
/* Painted metal. Metalness is kept very low on purpose: there is no longer an
   environment map in the scene, and a true metal with nothing to reflect
   renders black. Low metalness + flat shading suits the graphic look anyway. */
export function MetalMat({ color = C.frame }: { color?: string }) {
    return (
        <meshStandardMaterial
            color={color}
            metalness={0.12}
            roughness={0.55}
        />
    );
}

/* Flat accent strip. No emissive — nothing glows in a white monochrome scene,
   and an emissive strip just reads as a washed-out grey smear. */
export function Trim({
    color,
    ...props
}: { color: string } & ThreeElements["mesh"]) {
    return (
        <mesh {...props}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
    );
}
