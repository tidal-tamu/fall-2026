import { useId, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { LINKS, NAV, STICKER } from "../event";
import { SPONSOR_RAIL_HEIGHT } from "../Sponsors";
import { rise } from "./variants";
import "./hero-paper.css";

/* -------------------------------------------------------------------------- */
/*  Paper, after the Craft reference: grainy dusty-blue stock with faint       */
/*  guide lines, a floating frosted nav, an editorial serif headline with      */
/*  single italic letters, and halftone clouds drifting over the type.         */
/* -------------------------------------------------------------------------- */

const SPONSOR_MAIL =
    `mailto:${LINKS.email}?subject=` + encodeURIComponent("Sponsoring tidalBYTE '26");

/* A dot tile whose alpha falls off from the centre. Multiplied by a blurred
   cloud and then thresholded, it turns into real halftone: fat dots where the
   cloud is dense, pinpricks where it thins out. */
const DOT =
    "data:image/svg+xml," +
    encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' width='6' height='6'><defs><radialGradient id='g'><stop offset='0' stop-color='#fff'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient></defs><circle cx='3' cy='3' r='3' fill='url(#g)'/></svg>",
    );

const PUFFS: [number, number, number][] = [
    [120, 132, 58],
    [192, 102, 74],
    [272, 116, 62],
    [334, 142, 44],
    [78, 152, 40],
    [222, 152, 60],
];

const HalftoneCloud = ({ className }: { className: string }) => {
    const id = useId().replace(/:/g, "");
    return (
        // padded viewBox: the blur runs well past the puffs and would otherwise
        // be clipped flat at the svg's edge
        <svg viewBox="-40 -40 480 320" className={className} aria-hidden="true">
            <defs>
                <filter id={`${id}-ht`} x="-25%" y="-35%" width="150%" height="170%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="17" result="soft" />
                    <feImage href={DOT} x="0" y="0" width="6" height="6" result="dot" />
                    <feTile in="dot" result="dots" />
                    <feComposite in="soft" in2="dots" operator="arithmetic" k1="1" result="mix" />
                    <feComponentTransfer in="mix">
                        <feFuncA type="linear" slope="4.2" intercept="-0.55" />
                    </feComponentTransfer>
                </filter>
                <filter id={`${id}-glow`} x="-25%" y="-35%" width="150%" height="170%">
                    <feGaussianBlur stdDeviation="24" />
                </filter>
            </defs>
            <g fill="#ffffff" filter={`url(#${id}-glow)`} opacity="0.22">
                {PUFFS.map(([cx, cy, r]) => (
                    <circle key={`g${cx}`} cx={cx} cy={cy} r={r} />
                ))}
            </g>
            <g fill="#ffffff" filter={`url(#${id}-ht)`}>
                {PUFFS.map(([cx, cy, r]) => (
                    <circle key={`h${cx}`} cx={cx} cy={cy} r={r} />
                ))}
            </g>
        </svg>
    );
};

const ArrowOut = () => (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path
            d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const HeroPaper = ({ shouldAnimate = false }: { shouldAnimate?: boolean }) => (
    <div
        className="paper-page relative h-screen w-full overflow-hidden"
        style={{ "--rail": `${SPONSOR_RAIL_HEIGHT}px` } as CSSProperties}
    >
        <motion.header className="paper-nav" {...rise(shouldAnimate, 0.1)}>
            <a href="#top" className="paper-nav__logo font-pixel">
                tidalBYTE
            </a>
            <nav aria-label="Sections" className="paper-nav__links">
                {NAV.map((item) => (
                    <a key={item.href} href={item.href}>
                        {item.label}
                    </a>
                ))}
            </nav>
            <div className="paper-nav__end">
                <a href={SPONSOR_MAIL} className="paper-nav__quiet">
                    Sponsor us
                </a>
                <span className="paper-nav__cta" aria-disabled="true">
                    Register soon
                </span>
            </div>
        </motion.header>

        <div className="paper-center">
            <motion.p className="paper-eyebrow" {...rise(shouldAnimate, 0.2)}>
                tidal presents · tidalBYTE &apos;26
            </motion.p>

            <motion.h1 className="paper-title" {...rise(shouldAnimate, 0.32)}>
                <span className="sr-only">tidalBYTE &apos;26: </span>
                One d<em>a</em>y. One r<em>o</em>om.
                <br />
                Tw<em>e</em>lve h<em>o</em>urs.
                <img
                    src={STICKER("pebble-bow")}
                    alt=""
                    className="paper-sticker"
                    decoding="async"
                    draggable={false}
                />
            </motion.h1>

            <motion.p className="paper-meta" {...rise(shouldAnimate, 0.46)}>
                Saturday, November 21 · MSC 2304 · for freshmen &amp; sophomores
            </motion.p>

            <motion.div className="paper-ctas" {...rise(shouldAnimate, 0.56)}>
                <a
                    href={LINKS.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="paper-cta"
                >
                    Join the Discord <ArrowOut />
                </a>
                <a href="#faq" className="paper-cta paper-cta--ghost">
                    Read the FAQ
                </a>
            </motion.div>
        </div>

        <HalftoneCloud className="paper-cloud paper-cloud--left" />
        <HalftoneCloud className="paper-cloud paper-cloud--right" />
    </div>
);

export default HeroPaper;
