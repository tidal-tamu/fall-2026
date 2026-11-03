import type { CSSProperties } from "react";

/** Join complete Tailwind classes; conditional states stay in each component. */
export function cn(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

/** Eight pixel edges around text, shared by the section and hero titles. */
export function pixelOutline(color: string, width: string) {
    const negative = `calc(${width} * -1)`;
    const offsets = [
        [width, "0"], [negative, "0"], ["0", width], ["0", negative],
        [width, width], [negative, negative], [width, negative], [negative, width],
    ];
    return offsets.map(([x, y]) => `${x} ${y} 0 ${color}`).join(", ");
}

export const headingStyle: CSSProperties = {
    textShadow: [pixelOutline("#333f48", ".055em"), ".12em .12em 0 #fff", ".17em .17em 0 #a2b8c6"].join(", "),
};

/** Repeated game UI patterns. Component-specific layout stays beside its JSX. */
export const ui = {
    focus: cn(
        "[:where(&)_:where(a,button):focus-visible]:[outline:2px_solid_#34506f]",
        "[:where(&)_:where(a,button):focus-visible]:[outline-offset:3px]",
    ),
    levelMotion: cn(
        "motion-reduce:[&_*]:!animate-none motion-reduce:[&_*]:![transition:none]",
        "motion-reduce:[&_*::before]:!animate-none motion-reduce:[&_*::before]:![transition:none]",
        "motion-reduce:[&_*::after]:!animate-none motion-reduce:[&_*::after]:![transition:none]",
    ),
    heroMotion: cn(
        "max-[760px]:[&_*:not(.caped-sparkle):not(.caped-giant__blink):not(.caped-plane):not(.caped-cloud)]:!animate-none",
        "max-[760px]:[&_*:not(.caped-sparkle):not(.caped-giant__blink):not(.caped-plane):not(.caped-cloud)]:![transition:none]",
        "max-[760px]:[&_*::before]:!animate-none max-[760px]:[&_*::before]:![transition:none]",
        "max-[760px]:[&_*::after]:!animate-none max-[760px]:[&_*::after]:![transition:none]",
        "motion-reduce:[&_*]:!animate-none motion-reduce:[&_*]:![transition:none]",
        "motion-reduce:[&_*::before]:!animate-none motion-reduce:[&_*::before]:![transition:none]",
        "motion-reduce:[&_*::after]:!animate-none motion-reduce:[&_*::after]:![transition:none]",
    ),
    heroReveal: cn(
        "group-[.is-in]/hero:[filter:blur(12px)]",
        "group-[.is-in]/hero:[transform:translateY(18px)_scale(.97)]",
        "group-[.is-in]/hero:animate-hero-reveal",
        "motion-reduce:!opacity-100 motion-reduce:!filter-none motion-reduce:!transform-none",
    ),
    section: "sec px-0 relative isolate [scroll-margin-top:82px]",
    wrap: "wrap my-0 mx-auto relative z-[2] w-[min(1180px,_calc(100%_-_40px))]",
    window: cn(
        "win relative bg-game-window border-[3px] border-solid border-game-ink rounded-2xl",
        "shadow-[inset_0_0_0_4px_#fbfdff,_inset_0_0_0_6.5px_#c6d8e2,_6px_7px_0_rgba(51,_63,_72,_.16)]",
    ),
    windowTitle: cn(
        "win-title px-2.5 absolute top-[-15px] left-[22px] pt-1.5 pb-[5px] rounded-md bg-game-ink",
        "text-game-light font-pixel text-[10px] tracking-[.04em]",
    ),
    pixelFrame: "pix relative border-[2.5px] border-solid border-game-ink rounded-xl overflow-hidden bg-game-sky",
    button: cn(
        "gbtn px-[26px] gap-3 inline-flex items-center cursor-pointer pt-[15px] pb-3.5 rounded-[999px]",
        "no-underline font-pixel text-[11px] tracking-[.04em] text-game-dark bg-game-cream",
        "border-[2.5px] border-solid border-game-ink shadow-[0_5px_0_#333f48]",
        "[transition:transform_.12s_ease,_box-shadow_.12s_ease] hover:[transform:translateY(-2px)]",
        "hover:shadow-[0_7px_0_#333f48] active:[transform:translateY(4px)]",
        "active:shadow-[0_1px_0_#333f48] disabled:cursor-progress disabled:opacity-80",
        "focus-visible:[outline:2px_dashed_#333f48] focus-visible:[outline-offset:5px]",
    ),
    heading: cn(
        "h2 mx-0 mt-0 mb-4 font-pixel font-normal leading-[1.25] text-[clamp(22px,_3.2vw,_40px)]",
        "text-[#bdd0da]",
    ),
    stage: cn(
        "stage mx-0 inline-flex flex-wrap items-center gap-y-2.5 gap-x-3 mt-0 mb-4 font-pixel",
        "text-[11px] tracking-[.04em] text-game-muted",
    ),
    intro: "lede max-w-[56ch] text-[15px] leading-[1.75] text-game-muted",
};
