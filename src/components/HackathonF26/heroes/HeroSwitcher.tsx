import { useState } from "react";
import { HERO_VARIANTS, type HeroVariant } from "./variants";
import "./heroes.css";

/* -------------------------------------------------------------------------- */
/*  Exploration-only: flip between hero versions without leaving the page.     */
/*  Once a direction is picked, delete this along with the versions that lost. */
/* -------------------------------------------------------------------------- */

interface HeroSwitcherProps {
    value: HeroVariant;
    onChange: (next: HeroVariant) => void;
}

const HeroSwitcher = ({ value, onChange }: HeroSwitcherProps) => {
    // starts folded on phones, where the full pill would sit over the hero
    const [open, setOpen] = useState(() => window.innerWidth >= 768);

    const pick = (next: HeroVariant) => {
        onChange(next);
        window.scrollTo({ top: 0, behavior: "auto" }); // land on the new hero
    };

    if (!open) {
        return (
            <div className="hero-switcher">
                <button
                    type="button"
                    className="hero-switcher__opt"
                    onClick={() => setOpen(true)}
                    aria-label={`Hero version: ${value}. Show the version switcher`}
                >
                    hero: {value}
                </button>
            </div>
        );
    }

    return (
        <div className="hero-switcher" role="group" aria-label="Hero version">
            <span className="hero-switcher__label" aria-hidden="true">
                hero
            </span>
            {HERO_VARIANTS.map((v) => (
                <button
                    key={v.id}
                    type="button"
                    className="hero-switcher__opt"
                    aria-pressed={v.id === value}
                    onClick={() => pick(v.id)}
                >
                    {v.label}
                </button>
            ))}
            <button
                type="button"
                className="hero-switcher__opt hero-switcher__hide"
                onClick={() => setOpen(false)}
                aria-label="Hide the version switcher"
            >
                ×
            </button>
        </div>
    );
};

export default HeroSwitcher;
