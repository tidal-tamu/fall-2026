import { cn } from "./ui";
import type { ReactNode } from "react";
import { EVENT } from "./event";

/* -------------------------------------------------------------------------- */
/*  The hero's register sticker: a dark slate pill with a white die-cut ring.  */
/*  It links out on its own once event.ts has registrationOpen and a           */
/*  registerUrl; until then it wears a "soon!" tag and stays inert.            */
/* -------------------------------------------------------------------------- */

const LIVE = EVENT.registrationOpen && Boolean(EVENT.registerUrl);

const appearances = {
    default: cn(
        "relative inline-flex items-center gap-2.5 rounded-[999px] border-2 border-[#33404c]",
        "bg-[#33404c] px-[22px] pb-[13px] pt-3.5 font-pixel text-[11px] leading-none text-white",
        "shadow-[0_0_0_5px_white,0_0_0_6px_rgba(51,64,76,.14),0_12px_20px_-10px_rgba(51,64,76,.55)]",
        "md:px-[26px] md:pb-[15px] md:pt-4 md:text-[13px]",
        "transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-0.5 active:translate-y-px",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-hint-deep focus-visible:outline-offset-[9px]",
    ),
    nav: cn(
        "[&:hover_svg]:animate-hero-heartbeat caped-register py-[13px] px-[26px] gap-2.5 border-game-ink bg-game-pastel",
        "shadow-[3px_3px_0_#a2b8c6] text-[#263d55] font-mono text-[14px] font-bold tracking-[0.14em]",
        "transform-none relative inline-flex items-center border-2 border-solid rounded-[999px] leading-[1]",
        "[transition:transform_0.25s_cubic-bezier(0.16,_1,_0.3,_1),_box-shadow_0.25s_cubic-bezier(0.16,_1,_0.3,_1)]",
        "hover:[transform:translate(-1px,_-2px)] hover:shadow-[5px_5px_0_#a2b8c6] max-[760px]:py-[11px]",
        "max-[760px]:px-4 max-[760px]:text-[12px]",
        "active:[transform:translateY(1px)]",
        "focus-visible:[outline:2px_dashed_#34506f] focus-visible:[outline-offset:9px]",
    ),
    hero: cn(
        "caped-apply py-[15px] px-[34px] gap-3 border-game-ink bg-game-ink shadow-[4px_4px_0_#a2b8c6]",
        "text-white font-mono text-[15px] font-bold tracking-[0.2em] transform-none relative inline-flex",
        "items-center border-2 border-solid rounded-[999px] leading-[1]",
        "[transition:transform_0.25s_cubic-bezier(0.16,_1,_0.3,_1),_box-shadow_0.25s_cubic-bezier(0.16,_1,_0.3,_1)]",
        "hover:[transform:translate(-1px,_-2px)] hover:shadow-[6px_6px_0_#a2b8c6] max-[760px]:py-[13px]",
        "max-[760px]:px-[26px] max-[760px]:text-[13px]",
        "active:[transform:translateY(1px)]",
        "focus-visible:[outline:2px_dashed_#34506f] focus-visible:[outline-offset:9px]",
    ),
};

interface Props {
    variant?: keyof typeof appearances;
    className?: string;
    label?: string; // e.g. "APPLY"; same destination either way
    icon?: ReactNode; // replaces the arrow, for heroes that want their own mark
    soonTag?: boolean; // the "soon!" sticker while registration is closed
}

const RegisterButton = ({ variant = "default", className = "", label = "REGISTER", icon, soonTag = true }: Props) =>
    LIVE ? (
        <a
            href={EVENT.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("register-btn", appearances[variant], className)}
        >
            {label} {icon ?? <span aria-hidden="true">→</span>}
        </a>
    ) : (
        <span
            className={cn("register-btn pointer-events-none cursor-not-allowed", appearances[variant], className)}
            aria-disabled="true"
            title="Registration opens soon"
        >
            {label}
            {icon}
            {soonTag && (
                <span className="absolute -top-[15px] -right-6 rotate-12 rounded border-[1.5px] border-[#33404c] bg-[#c3d5e4] px-[7px] pb-1 pt-[5px] text-[8px] text-[#33404c] shadow-[0_0_0_3px_white]" aria-hidden="true">
                    soon!
                </span>
            )}
            <span className="sr-only">(registration opens soon)</span>
        </span>
    );

export default RegisterButton;
