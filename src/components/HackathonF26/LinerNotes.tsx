import type { CSSProperties } from "react";
import SectionHeader from "./SectionHeader";
import Sticker from "./Sticker";
import { sponsors } from "./Sponsors";
import { LINKS, STICKER } from "./event";

/* -------------------------------------------------------------------------- */
/*  Sponsors as the album's liner notes: every logo is a die-cut sticker       */
/*  slapped onto the page at a slightly different angle.                       */
/* -------------------------------------------------------------------------- */

// Fixed rather than random so the wall doesn't reshuffle on every render.
const TILTS = [-2.5, 1.5, -1, 2.5, -1.8, 1, -2, 2, -0.6, 1.6];

const SPONSOR_MAIL =
    `mailto:${LINKS.email}?subject=` + encodeURIComponent("Sponsoring tidalBYTE '26");

const LinerNotes = () => (
    <section id="sponsors" className="section dot-grid">
        <div className="mx-auto max-w-6xl">
            <SectionHeader
                track="05"
                file="liner-notes.txt"
                title="liner notes"
                dek="special thanks to the people who make tidalBYTE possible."
            />

            <ul className="mt-16 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
                {sponsors.map((s, i) => (
                    <li key={s.name}>
                        <div
                            className="sponsor-sticker"
                            style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
                        >
                            <img src={s.logo} alt={s.name} loading="lazy" decoding="async" />
                        </div>
                    </li>
                ))}
            </ul>

            <div className="relative mx-auto mt-20 max-w-3xl">
                <div className="sponsor-cta">
                    <div>
                        <p className="label text-mid">Your logo here?</p>
                        <p className="mt-3 font-grotesk text-[22px] font-bold leading-tight tracking-tight md:text-[26px]">
                            want a spot in the liner notes?
                        </p>
                        <p className="mt-2 text-[13px] leading-relaxed text-shade-600">
                            tidalBYTE is still bringing on sponsors for fall 2026. we&apos;d love to
                            have you.
                        </p>
                    </div>
                    <a
                        href={SPONSOR_MAIL}
                        className="nav-pill shrink-0 whitespace-nowrap font-pixel text-[9px] md:text-[10px]"
                    >
                        SPONSOR US
                        <span aria-hidden="true">[→]</span>
                    </a>
                </div>

                <Sticker
                    src={STICKER("cat-prof")}
                    width={104}
                    rotate={8}
                    className="absolute -right-2 -top-24 z-10 md:-right-12 md:-top-28 md:[--sticker-w:124px]"
                />
            </div>
        </div>
    </section>
);

export default LinerNotes;
