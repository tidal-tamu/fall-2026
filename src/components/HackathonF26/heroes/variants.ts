import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Hero explorations. Each id is a full-screen hero built from one reference: */
/*    diary   Summer Diary: sticker title, cloud bank, polaroids (default)     */
/*    glass   Bluebird: frosted cards over a giant serif wordmark              */
/*    slopes  Ski with the Club: illustrated layers around a huge headline     */
/*    paper   Craft: grainy blue stock, halftone clouds, italic-swap serif     */
/*    music   the album's now-playing screen, with a chiptune to play          */
/*  The choice lives in ?hero= so a link opens straight onto one version.     */
/* -------------------------------------------------------------------------- */

export const HERO_VARIANTS = [
    { id: "diary", label: "diary" },
    { id: "glass", label: "glass" },
    { id: "slopes", label: "slopes" },
    { id: "paper", label: "paper" },
    { id: "music", label: "music" },
] as const;

export type HeroVariant = (typeof HERO_VARIANTS)[number]["id"];

const DEFAULT: HeroVariant = "diary";

const isVariant = (v: string | null): v is HeroVariant =>
    HERO_VARIANTS.some((h) => h.id === v);

function readVariant(): HeroVariant {
    if (typeof window === "undefined") return DEFAULT;
    const v = new URLSearchParams(window.location.search).get("hero");
    return isVariant(v) ? v : DEFAULT;
}

export function useHeroVariant() {
    const [variant, setVariant] = useState<HeroVariant>(readVariant);

    const choose = (next: HeroVariant) => {
        setVariant(next);
        const url = new URL(window.location.href);
        if (next === DEFAULT) url.searchParams.delete("hero");
        else url.searchParams.set("hero", next);
        window.history.replaceState(null, "", url);
    };

    return [variant, choose] as const;
}

/* The shared entrance: a short rise once the loading screen lifts. */
export const rise = (shouldAnimate: boolean, delay: number) => ({
    initial: { y: 16, opacity: 0 },
    animate: shouldAnimate ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 },
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const, delay },
});
