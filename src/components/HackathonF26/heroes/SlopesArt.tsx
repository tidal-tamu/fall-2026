/* -------------------------------------------------------------------------- */
/*  Flat illustration for the Slopes hero (the "Ski with the Club" reference): */
/*  far mountains behind the headline, snow hills in front of it, slim pines   */
/*  and a penguin on skis. No outlines, just stacked pastel planes, like the   */
/*  reference.                                                                */
/* -------------------------------------------------------------------------- */

const SNOW = "#F6F9FC";
const SNOW_SHADE = "#D9E4F0";

/* Two ranges. Anchored to the bottom and cropped (not stretched) so the peaks
   keep their shape on narrow screens. */
export const FarMountains = () => (
    <svg
        viewBox="0 0 1440 560"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
        aria-hidden="true"
    >
        <path
            d="M0 330 L120 260 L210 300 L330 200 L430 270 L560 170 L680 260 L760 220 L900 300 L1040 180 L1150 250 L1260 150 L1360 230 L1440 200 V560 H0 Z"
            fill="#B3C9E0"
        />
        <path
            d="M0 400 L160 300 L260 350 L420 230 L520 320 L640 260 L760 360 L880 280 L1010 330 L1120 150 L1240 280 L1330 240 L1440 300 V560 H0 Z"
            fill="#7E9BBE"
        />
        {/* shadow faces on the two big peaks */}
        <path d="M1120 150 L1240 280 L1196 302 L1138 196 Z" fill="#6B88AC" />
        <path d="M420 230 L520 320 L486 334 L432 262 Z" fill="#6B88AC" />
        {/* snow caps with ragged lower edges */}
        <path d="M1120 150 L1162 196 L1146 206 L1132 194 L1116 212 L1100 198 L1082 213 Z" fill={SNOW} />
        <path d="M420 230 L450 257 L436 268 L420 256 L404 270 L390 258 L372 266 Z" fill={SNOW} />
        <path d="M640 260 L676 290 L662 296 L648 286 L632 298 L618 284 L604 278 Z" fill={SNOW} />
        <path d="M160 300 L190 322 L176 330 L162 320 L148 332 L134 318 L124 324 Z" fill={SNOW} />
    </svg>
);

/* The white slopes that come up over the bottom of the headline. Stretched to
   the box (smooth curves survive that), so the ridge always lands at the same
   height relative to the type. */
export const FrontHills = () => (
    <svg viewBox="0 0 1440 450" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
        {/* left slope */}
        <path
            d="M0 96 C 90 62, 170 44, 262 72 C 362 106, 432 182, 562 232 C 642 262, 722 296, 770 450 H0 Z"
            fill={SNOW}
        />
        <path d="M262 72 C 362 106, 432 182, 562 232 C 470 214, 380 166, 304 122 Z" fill={SNOW_SHADE} />
        {/* middle-right peak */}
        <path
            d="M540 450 C 690 300, 820 160, 980 72 C 1040 42, 1082 46, 1132 82 C 1252 162, 1352 232, 1440 262 V450 Z"
            fill={SNOW}
        />
        <path
            d="M980 72 C 1040 42, 1082 46, 1132 82 C 1252 162, 1352 232, 1440 262 V306 C 1330 282, 1222 222, 1124 144 C 1072 106, 1024 90, 980 72 Z"
            fill={SNOW_SHADE}
        />
        {/* foreground drift and a couple of ski tracks */}
        <path
            d="M0 330 C 300 290, 600 362, 900 332 C 1100 312, 1300 342, 1440 322 V450 H0 Z"
            fill="#EEF3F8"
        />
        <path d="M70 430 C 300 368, 520 386, 700 336" fill="none" stroke={SNOW_SHADE} strokeWidth="3" />
        <path d="M92 444 C 320 382, 540 400, 720 350" fill="none" stroke={SNOW_SHADE} strokeWidth="3" />
    </svg>
);

/* Slim cypress-style pine, like the reference's dark trees. */
export const Pine = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 30 84" className={className} aria-hidden="true">
        <path d="M15 0 C 22 18, 27 46, 25 70 C 23 77, 7 77, 5 70 C 3 46, 8 18, 15 0 Z" fill="#2C4766" />
        <path d="M15 0 C 22 18, 27 46, 25 70 C 22 75, 17 76, 15 76 Z" fill="#3D5C80" />
        <rect x="13" y="74" width="4" height="10" rx="1" fill="#2C4766" />
    </svg>
);

/* The crew's penguin, mid-jump on skis: goggles up, scarf streaming. */
export const SkiPenguin = () => (
    <svg viewBox="0 0 260 240" className="h-auto w-full overflow-visible" aria-hidden="true">
        <g transform="rotate(-10 130 120)">
            {/* back pole and ski */}
            <path d="M50 64 L22 150" stroke="#4E6E94" strokeWidth="3.5" strokeLinecap="round" />
            <ellipse cx="25" cy="142" rx="7" ry="2.5" fill="#4E6E94" />
            <path
                d="M24 190 H208 C222 190 230 184 232 172 C233 168 238 168 238 173 C236 188 224 198 208 198 H24 C20 198 18 190 24 190 Z"
                fill="#4E6E94"
            />
            {/* feet */}
            <ellipse cx="104" cy="194" rx="16" ry="7" fill="#383632" />
            <ellipse cx="150" cy="198" rx="16" ry="7" fill="#383632" />
            {/* front ski */}
            <path
                d="M38 200 H222 C236 200 244 194 246 182 C247 178 252 178 252 183 C250 198 238 208 222 208 H38 C34 208 32 200 38 200 Z"
                fill="#34506F"
            />
            <path d="M48 202 H214" stroke="#8EA7C2" strokeWidth="1.5" strokeLinecap="round" />
            {/* back flipper, raised for balance */}
            <path d="M98 110 C 72 96, 54 78, 48 60 C 62 70, 82 86, 104 100 Z" fill="#111110" />
            {/* body, belly */}
            <ellipse cx="130" cy="130" rx="58" ry="70" fill="#111110" />
            <ellipse cx="148" cy="142" rx="36" ry="52" fill="#FFFFFF" />
            {/* scarf: tail first so the knot sits over it */}
            <path d="M122 104 C 98 98, 80 88, 58 96 L 64 108 C 84 102, 100 110, 120 116 Z" fill="#8EA7C2" />
            <path d="M74 98 L78 106 M88 98 L92 107" stroke="#CFDEEE" strokeWidth="2" />
            {/* head and face */}
            <circle cx="150" cy="66" r="40" fill="#111110" />
            <path d="M118 98 C 140 112, 172 110, 190 96 L192 110 C 170 124, 138 124, 116 112 Z" fill="#8EA7C2" />
            <ellipse cx="164" cy="72" rx="24" ry="22" fill="#FFFFFF" />
            <circle cx="170" cy="66" r="5" fill="#111110" />
            <circle cx="172" cy="64" r="1.6" fill="#FFFFFF" />
            <ellipse cx="177" cy="82" rx="7" ry="4" fill="#CFDEEE" />
            <path d="M185 72 L206 79 L185 86 Z" fill="#111110" />
            {/* goggles pushed up */}
            <path d="M112 50 C 130 32, 168 30, 190 48" fill="none" stroke="#34506F" strokeWidth="7" strokeLinecap="round" />
            <rect x="148" y="30" width="32" height="17" rx="8.5" fill="#8EA7C2" stroke="#34506F" strokeWidth="3" />
            <path d="M156 36 L162 36" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            {/* front flipper and pole */}
            <path d="M166 120 C 190 128, 206 142, 212 156 C 198 150, 182 142, 162 134 Z" fill="#111110" />
            <path d="M210 150 L232 214" stroke="#34506F" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="229" cy="207" rx="7" ry="2.5" fill="#34506F" />
        </g>
    </svg>
);
