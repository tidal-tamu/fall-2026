import type { CSSProperties, Ref } from "react";
import { cn, pixelOutline } from "./ui";

const titleStyle = {
    "--ink-sh": pixelOutline("#3d4a52", ".045em"),
    textShadow: "var(--ink-sh)",
    "--glitch-one": ["var(--ink-sh)", "-0.12em 0 0 rgba(118, 163, 212, 0.95)", "0.12em 0 0 rgba(240, 192, 148, 0.95)"].join(", "),
    "--glitch-two": ["var(--ink-sh)", "0.08em 0.02em 0 rgba(242, 201, 160, 0.95)"].join(", "),
} as CSSProperties;

const TILT = [-3, 2, -2, 3, -1, 2, -3, 1, -2, 0, 3, -2];
const WORD = [..."tidalBYTE"];
const YEAR = [..."'26"];

const Letter = ({ c, i, animate }: { c: string; i: number; animate: boolean }) => (
    <span className={cn(
        "group-[.is-in]/hero:animate-hero-letter group-[.is-in]/hero:[filter:blur(10px)]",
        "group-[.is-in]/hero:[transform:translateY(.28em)_scale(.9)]",
        "[&.is-g1]:[translate:.07em_-0.03em] [&.is-g1]:[text-shadow:var(--glitch-one)]",
        "[&.is-g2]:opacity-75 [&.is-g2]:[translate:-0.06em_.03em] [&.is-g2]:[text-shadow:var(--glitch-two)]",
        "motion-reduce:!opacity-100 motion-reduce:!filter-none motion-reduce:!transform-none",
        "caped-ch relative inline-block isolate [rotate:var(--r,_0deg)]",
        animate && "opacity-0",
        "before:content-[attr(data-c)] before:absolute before:top-0 before:left-0 before:z-[-1]",
        "before:text-white before:[-webkit-text-stroke:0.27em_#ffffff] before:[text-shadow:none]",
        "before:[filter:drop-shadow(0_0.07em_0.05em_rgba(38,_48,_58,_0.22))] max-[760px]:!opacity-100",
        "max-[760px]:!filter-none max-[760px]:!transform-none",
    )} aria-hidden="true" data-c={c} style={{ "--i": i, "--r": `${TILT[i]}deg` } as CSSProperties}>
        {c}
    </span>
);

export default function TidalByteTitle({ className, titleRef, animate = false }: {
    className?: string;
    titleRef?: Ref<HTMLHeadingElement>;
    animate?: boolean;
}) {
    return (
        <h1 ref={titleRef} style={titleStyle} className={cn(
            "font-pixel font-normal leading-[1.1] tracking-[0.08em] whitespace-nowrap text-[#bdd0da]",
            className,
        )}>
            <span className="sr-only">tidalBYTE &apos;26</span>
            {WORD.map((c, i) => (
                <Letter animate={animate} key={i} c={c} i={i} />
            ))}
            <span className={cn(
                "caped-year inline-block text-[0.58em] tracking-[0.06em] [rotate:-9deg]",
                "[translate:0.15em_-0.6em]",
            )} aria-hidden="true">
                {YEAR.map((c, j) => (
                    <Letter animate={animate} key={j} c={c} i={WORD.length + j} />
                ))}
            </span>
        </h1>
    );
}
