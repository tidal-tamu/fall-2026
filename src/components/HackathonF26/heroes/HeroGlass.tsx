import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { EVENT, LINKS, NAV, STICKER, daysToDoors, fmtCentral } from "../event";
import { SPONSOR_RAIL_HEIGHT } from "../Sponsors";
import { rise } from "./variants";
import "./hero-glass.css";
import "./hero-glass-cards.css";

/* -------------------------------------------------------------------------- */
/*  Glass, after the "Bluebird" reference: a soft blue panel, a giant pale     */
/*  serif wordmark with the mascot standing in front of it, and frosted bento  */
/*  cards along the bottom. Type is navy rather than white so it stays         */
/*  readable on the pale glass.                                                */
/* -------------------------------------------------------------------------- */

const doors = fmtCentral(EVENT.startsAt, { hour: "numeric", minute: "2-digit" });
const CREW = ["cat", "panda", "bunny", "cow"];

const Arrow = () => (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path
            d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Chevron = () => (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
            d="M6 3.5 10.5 8 6 12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* A glassy ADMIT ONE stub, standing in for the reference's glass padlock. */
const GlassTicket = () => (
    <svg viewBox="0 0 84 60" className="glass-card__icon" aria-hidden="true">
        <defs>
            <linearGradient id="glass-ticket-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="0.55" stopColor="#e3ecf6" stopOpacity="0.55" />
                <stop offset="1" stopColor="#8ea7c2" stopOpacity="0.35" />
            </linearGradient>
        </defs>
        <g transform="rotate(-14 42 30)">
            <path
                d="M10 12h64a4 4 0 0 1 4 4v7a7 7 0 0 0 0 14v7a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-7a7 7 0 0 0 0-14v-7a4 4 0 0 1 4-4Z"
                fill="url(#glass-ticket-fill)"
                stroke="#ffffff"
                strokeWidth="1.4"
            />
            <path d="M58 15v30" stroke="#5a7fa6" strokeWidth="1.2" strokeDasharray="2.5 3" />
            <path
                d="M30 23.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7Z"
                fill="#ffffff"
                stroke="#5a7fa6"
                strokeWidth="1"
                strokeLinejoin="round"
            />
        </g>
    </svg>
);

const HeroGlass = ({ shouldAnimate = false }: { shouldAnimate?: boolean }) => {
    const days = daysToDoors();

    return (
        <div
            className="glass-page relative h-screen w-full overflow-hidden"
            style={{ "--rail": `${SPONSOR_RAIL_HEIGHT}px` } as CSSProperties}
        >
            <div className="glass-panel">
                <motion.header className="glass-nav" {...rise(shouldAnimate, 0.1)}>
                    <a href="#top" className="font-pixel text-[12px] text-ink md:text-[13px]">
                        tidalBYTE
                    </a>
                    <nav aria-label="Sections" className="glass-links hidden md:flex">
                        <a href="#top" className="glass-link is-active" aria-current="page">
                            home
                        </a>
                        {NAV.map((item) => (
                            <a key={item.href} href={item.href} className="glass-link">
                                {item.label.toLowerCase()}
                            </a>
                        ))}
                    </nav>
                    <span className="glass-soon" aria-disabled="true">
                        register soon
                    </span>
                </motion.header>

                <motion.h1 className="glass-wordmark" {...rise(shouldAnimate, 0.2)}>
                    tidalBYTE<span className="sr-only"> &apos;26</span>
                </motion.h1>

                <motion.div className="glass-mascot-wrap" {...rise(shouldAnimate, 0.35)}>
                    <img
                        src={STICKER("pebble-headphones")}
                        alt=""
                        className="glass-mascot"
                        decoding="async"
                        draggable={false}
                    />
                </motion.div>

                <motion.div className="glass-intro" {...rise(shouldAnimate, 0.5)}>
                    <h2 className="glass-intro__title">
                        Twelve hours
                        <br />
                        <span className="glass-intro__indent">
                            <span className="glass-amp">&amp;</span> your first hack
                        </span>
                    </h2>
                    <p className="glass-intro__sub">
                        TIDAL&apos;s fall hackathon for freshmen and sophomores at Texas A&amp;M.
                        No experience needed.
                    </p>
                    <div className="glass-ctas">
                        <a
                            href={LINKS.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-cta"
                        >
                            Join the Discord
                            <span className="glass-cta__dot">
                                <Chevron />
                            </span>
                        </a>
                        <a href="#about" className="glass-cta glass-cta--ghost">
                            What is it?
                        </a>
                    </div>
                </motion.div>

                <motion.div className="glass-crew" {...rise(shouldAnimate, 0.62)}>
                    <ul className="glass-crew__faces" aria-hidden="true">
                        {CREW.map((name) => (
                            <li key={name} className="glass-crew__face">
                                <img src={STICKER(name)} alt="" decoding="async" />
                            </li>
                        ))}
                    </ul>
                    <p className="glass-crew__pill">
                        doors open in <strong>{days} days</strong>
                    </p>
                </motion.div>

                <motion.ul className="glass-cards" {...rise(shouldAnimate, 0.7)}>
                    <li>
                        <a href="#faq" className="glass-card">
                            <GlassTicket />
                            <span className="glass-card__go">
                                <Arrow />
                            </span>
                            <span className="glass-card__chip">beginner friendly</span>
                            <span className="glass-card__title">Never hacked? Perfect.</span>
                        </a>
                    </li>
                    <li>
                        <a href="#prizes" className="glass-card glass-card--solid">
                            <span className="glass-orb" aria-hidden="true" />
                            <span className="glass-card__go">
                                <Arrow />
                            </span>
                            <span className="glass-card__title">Six prize tracks</span>
                            <span className="glass-card__sub">
                                Grand prize, best design, best beginner and more.
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#schedule" className="glass-card">
                            <span className="glass-card__stat" aria-hidden="true">
                                {EVENT.hours}
                                <small>h</small>
                            </span>
                            <span className="glass-card__go">
                                <Arrow />
                            </span>
                            <span className="sr-only">{EVENT.hours} hours.</span>
                            <span className="glass-card__sub glass-card__sub--end">
                                One day in {EVENT.room}. Doors open at {doors}.
                            </span>
                        </a>
                    </li>
                </motion.ul>
            </div>
        </div>
    );
};

export default HeroGlass;
