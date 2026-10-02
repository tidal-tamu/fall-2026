import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { EVENT, NAV, STICKER } from "../event";
import { SPONSOR_RAIL_HEIGHT } from "../Sponsors";
import { FarMountains, FrontHills, Pine, SkiPenguin } from "./SlopesArt";
import { rise } from "./variants";
import "./hero-slopes.css";

/* -------------------------------------------------------------------------- */
/*  Slopes, after the "Ski with the Club" reference. The headline is layered   */
/*  into the scene: mountains behind it, snow hills over its foot, and the     */
/*  penguin jumping in front. The card's tiles are the page's sections, marked */
/*  like ski runs from easiest to expert.                                     */
/* -------------------------------------------------------------------------- */

type Mark = "circle" | "square" | "diamond" | "double";

const TRAILS: { href: string; label: string; mark: Mark; sticker: string }[] = [
    { href: "#invite", label: "the invite", mark: "circle", sticker: "pebble-bow" },
    { href: "#about", label: "about", mark: "circle", sticker: "cat" },
    { href: "#schedule", label: "schedule", mark: "square", sticker: "bunny" },
    { href: "#prizes", label: "prizes", mark: "diamond", sticker: "panda" },
    { href: "#faq", label: "faq", mark: "double", sticker: "cow" },
];

const RunMark = ({ mark }: { mark: Mark }) => (
    <svg viewBox={mark === "double" ? "0 0 19 10" : "0 0 10 10"} className="slopes-mark" aria-hidden="true">
        {mark === "circle" && <circle cx="5" cy="5" r="4" fill="#8EA7C2" />}
        {mark === "square" && <rect x="1" y="1" width="8" height="8" fill="#34506F" />}
        {mark === "diamond" && <path d="M5 0.5 9.5 5 5 9.5 0.5 5Z" fill="#111110" />}
        {mark === "double" && (
            <>
                <path d="M5 0.5 9.5 5 5 9.5 0.5 5Z" fill="#111110" />
                <path d="M14 0.5 18.5 5 14 9.5 9.5 5Z" fill="#111110" />
            </>
        )}
    </svg>
);

const Logo = () => (
    <a href="#top" className="slopes-logo" aria-label="tidalBYTE, back to top">
        <svg viewBox="0 0 40 20" width="34" height="17" aria-hidden="true">
            <path d="M0 20 L13 4 L20 12 L27 2 L40 20 Z" fill="#2C4766" />
            <path d="M13 4 L17 9 L14.5 8 L12 10 Z M27 2 L31 8 L28.5 7 L26 9 Z" fill="#F6F9FC" />
        </svg>
        <span className="font-pixel">tidalBYTE</span>
    </a>
);

const HeroSlopes = ({ shouldAnimate = false }: { shouldAnimate?: boolean }) => {
    const left = NAV.slice(0, 3);
    return (
        <div
            className="slopes-page relative h-screen w-full overflow-hidden"
            style={{ "--rail": `${SPONSOR_RAIL_HEIGHT}px` } as CSSProperties}
        >
            <div className="slopes-snow" aria-hidden="true" />

            <div className="slopes-far">
                <FarMountains />
            </div>

            <motion.header className="slopes-nav" {...rise(shouldAnimate, 0.1)}>
                <nav aria-label="Sections" className="slopes-nav__side hidden md:flex">
                    {left.map((item) => (
                        <a key={item.href} href={item.href} className="slopes-nav__link">
                            {item.label}
                        </a>
                    ))}
                </nav>
                <Logo />
                <div className="slopes-nav__side slopes-nav__side--end">
                    <a href="#faq" className="slopes-nav__link hidden md:inline">
                        FAQ
                    </a>
                    <a href="#sponsors" className="slopes-nav__link hidden md:inline">
                        Sponsors
                    </a>
                    <span className="slopes-soon" aria-disabled="true">
                        Register soon
                    </span>
                </div>
            </motion.header>

            <motion.p className="slopes-eyebrow" {...rise(shouldAnimate, 0.2)}>
                {EVENT.date} · {EVENT.room} · {EVENT.hours} hours
            </motion.p>

            <motion.h1 className="slopes-title" {...rise(shouldAnimate, 0.3)}>
                <span className="sr-only">tidalBYTE &apos;26: </span>
                Hack with
                <br />
                the crew
            </motion.h1>

            <div className="slopes-front">
                <FrontHills />
            </div>
            <Pine className="slopes-pine slopes-pine--a" />
            <Pine className="slopes-pine slopes-pine--b" />
            <Pine className="slopes-pine slopes-pine--c" />
            <Pine className="slopes-pine slopes-pine--d" />

            <motion.div className="slopes-penguin" {...rise(shouldAnimate, 0.45)}>
                <div className="slopes-penguin__jump">
                    <SkiPenguin />
                </div>
                <span className="slopes-penguin__shadow" aria-hidden="true" />
            </motion.div>

            <motion.section className="slopes-card" aria-label="Pick a trail" {...rise(shouldAnimate, 0.6)}>
                <h2 className="slopes-card__title">Pick a trail</h2>
                <p className="slopes-card__sub">Everything for November 21, one run at a time.</p>
                <ul className="slopes-trails">
                    {TRAILS.map((t) => (
                        <li key={t.href}>
                            <a href={t.href} className="slopes-trail">
                                <img src={STICKER(t.sticker)} alt="" decoding="async" draggable={false} />
                                <span className="slopes-trail__label">
                                    <RunMark mark={t.mark} />
                                    {t.label}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </motion.section>
        </div>
    );
};

export default HeroSlopes;
