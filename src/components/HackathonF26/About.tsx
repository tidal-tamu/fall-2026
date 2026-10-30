import { cn, ui, headingStyle } from "./ui";
import { useRef, useState, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { PebbleArt } from "./PebbleArt";
import PixelCanvas from "./PixelArt";
import { EVENT, fmtCentral } from "./event";

function aboutPanel(active: boolean) {
    return cn(
        "panel relative [grid-area:1_/_1]",
        "[transition:opacity_.6s_cubic-bezier(.16,1,.3,1),_transform_.8s_cubic-bezier(.16,1,.3,1),_filter_.6s_ease]",
        active
            ? "on visible opacity-100 pointer-events-auto transform-none [filter:blur(0)]"
            : "invisible opacity-0 pointer-events-none [transform:translateY(26px)_scale(.98)] [filter:blur(10px)] motion-reduce:filter-none",
    );
}

export default function About() {
    const [selected, setSelected] = useState(0);
    const section = useRef<HTMLElement>(null);
    const seen = useInView(section, { once: true, amount: 0.15 });
    const eventDay = fmtCentral(EVENT.startsAt, { month: "short", day: "numeric" }).toLowerCase();
    return (
        <section id="about" ref={section} className={cn(`sec about group/about${seen ? " seen" : ""}`, "py-[120px] px-0 relative isolate [scroll-margin-top:82px]")} aria-label="About">
            <div className={cn(
                "about-frame py-0 px-[max(5vw,_24px)] gap-[4vw] relative grid",
                "[grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] items-center max-[760px]:py-0",
                "max-[760px]:px-4 max-[760px]:gap-8 max-[760px]:grid-cols-1",
                "max-[760px]:[grid-template-rows:auto_1fr] max-[760px]:[align-items:start]",
            )}>
                <div className={cn(
                    "select relative justify-self-center w-[min(430px,_100%)] flex flex-col items-center",
                    "max-[760px]:w-[min(250px,_66vw)]",
                )}>
                    <div className={cn(
                        "label font-pixel text-[11px] text-game-muted mb-1",
                        "animate-player-label uppercase tracking-[0.22em] max-[760px]:hidden",
                    )}>PLAYER 1 SELECT</div>
                    <div className="stagebox relative w-full [aspect-ratio:1_/_.92]" aria-hidden="true">
                        <div className={cn(
                            "spot absolute left-[14%] right-[14%] top-0 bottom-[8%]",
                            "[clip-path:polygon(38%_0,_62%_0,_100%_100%,_0_100%)]",
                            "bg-[linear-gradient(180deg,_rgba(255,_255,_255,_.85),_rgba(255,_255,_255,_0)_90%)]",
                        )} />
                        <div className={cn(
                            "pedestal absolute left-[12%] right-[12%] bottom-[2%] h-[17%] rounded-[50%] bg-game-blue",
                            "border-[3px] border-solid border-game-ink shadow-[inset_0_-10px_0_#a2b8c6] after:content-['']",
                            "after:absolute after:left-[12%] after:right-[12%] after:top-[18%] after:h-[34%]",
                            "after:rounded-[50%] after:border-2 after:border-dashed after:border-game-window after:opacity-90",
                        )} />
                        <div className={cn(
                            "big-pebble absolute left-1/2 bottom-[10%] w-[72%] -translate-x-1/2",
                            "animate-pebble-idle [transform-origin:50%_100%]",
                        )}>
                            <PebbleArt />
                        </div>
                    </div>
                    <div className={cn(
                        ui.window,
                        "nameplate px-5 z-[2] w-full mt-[-6px] pt-[18px] pb-4 max-[760px]:px-3.5 max-[760px]:pt-3",
                        "max-[760px]:pb-2.5",
                    )}>
                        <div className="np-top gap-2.5 flex justify-between items-baseline font-pixel text-game-ink">
                            <b className="font-normal text-[15px] max-[760px]:text-[12px]">PEBBLE</b>
                            <span className="text-[9px] text-game-muted">LV 26 · HERO</span>
                        </div>
                        <div className={cn(
                            "stats grid [grid-template-columns:auto_1fr] gap-y-[9px] gap-x-3 items-center mt-3.5 font-pixel",
                            "text-[8px] text-game-muted max-[760px]:hidden",
                        )}>
                            <span>BRAVERY</span>
                            <span className="bar h-[11px] border-2 border-solid border-game-ink rounded-md bg-game-sky overflow-hidden">
                                <i className={cn(
                                    "block h-full w-[var(--v)]",
                                    "[background:repeating-linear-gradient(90deg,_var(--c)_0_7px,_color-mix(in_srgb,_var(--c),_#fff_35%)_7px_9px)]",
                                    "[transform-origin:left] [transform:scaleX(0)] group-[.seen]/about:transform-none",
                                    "[transition:transform_1.1s_cubic-bezier(.16,1,.3,1)_.2s]",
                                )} style={{ "--v": "86%", "--c": "#e8b48f" } as CSSProperties} />
                            </span>
                            <span>SNACKS</span>
                            <span className="bar h-[11px] border-2 border-solid border-game-ink rounded-md bg-game-sky overflow-hidden">
                                <i className={cn(
                                    "block h-full w-[var(--v)]",
                                    "[background:repeating-linear-gradient(90deg,_var(--c)_0_7px,_color-mix(in_srgb,_var(--c),_#fff_35%)_7px_9px)]",
                                    "[transform-origin:left] [transform:scaleX(0)] group-[.seen]/about:transform-none",
                                    "[transition:transform_1.1s_cubic-bezier(.16,1,.3,1)_.2s]",
                                )} style={{ "--v": "100%", "--c": "#a9bf9f" } as CSSProperties} />
                            </span>
                            <span>CODE</span>
                            <span className="bar h-[11px] border-2 border-solid border-game-ink rounded-md bg-game-sky overflow-hidden">
                                <i className={cn(
                                    "block h-full w-[var(--v)]",
                                    "[background:repeating-linear-gradient(90deg,_var(--c)_0_7px,_color-mix(in_srgb,_var(--c),_#fff_35%)_7px_9px)]",
                                    "[transform-origin:left] [transform:scaleX(0)] group-[.seen]/about:transform-none",
                                    "[transition:transform_1.1s_cubic-bezier(.16,1,.3,1)_.2s]",
                                )} style={{ "--v": "62%", "--c": "#7fa7c4" } as CSSProperties} />
                            </span>
                            <span>CAPE</span>
                            <span className="bar h-[11px] border-2 border-solid border-game-ink rounded-md bg-game-sky overflow-hidden">
                                <i className={cn(
                                    "block h-full w-[var(--v)]",
                                    "[background:repeating-linear-gradient(90deg,_var(--c)_0_7px,_color-mix(in_srgb,_var(--c),_#fff_35%)_7px_9px)]",
                                    "[transform-origin:left] [transform:scaleX(0)] group-[.seen]/about:transform-none",
                                    "[transition:transform_1.1s_cubic-bezier(.16,1,.3,1)_.2s]",
                                )} style={{ "--v": "100%", "--c": "#93b5cc" } as CSSProperties} />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="about-copy relative w-[min(540px,_100%)]">
                    <div className="about-panels relative grid">
                        <article
                            className={aboutPanel(selected === 0)}
                            id="about-pebble"
                            aria-hidden={selected !== 0}
                        >
                            <div className={cn(
                                ui.window,
                                "px-[30px] pt-8 pb-[26px] max-[760px]:px-[18px] max-[760px]:pt-[26px] max-[760px]:pb-[18px]",
                            )}>
                                <span className={ui.windowTitle}>STAGE 1-1</span>
                                <h2 className={ui.heading} style={headingStyle}>meet pebble</h2>
                                <p className="mx-0 mt-0 mb-[18px] text-[15px] leading-[1.75] text-[#3f4d57] max-[760px]:text-[14px]">pebble is the tiny penguin hero holding this whole hackathon together. armed with a fish and a cape that's a little too big, pebble believes every great project starts as one small, slightly chaotic idea. keep scrolling — pebble's walking the street at the bottom of your screen with you.</p>
                                <div className={cn(
                                    ui.pixelFrame,
                                    "max-[760px]:hidden",
                                )}>
                                    <PixelCanvas className="block w-full h-auto [image-rendering:crisp-edges]" scene="pebble" width={96} height={48} />
                                    <span className={cn(
                                        "pix-bubble px-[11px] absolute top-[9%] left-1/2 -translate-x-1/2 whitespace-nowrap font-pixel",
                                        "text-[clamp(9px,_1vw,_11px)] text-game-ink bg-game-window border-[2.5px] border-solid",
                                        "border-game-ink rounded-md pt-[9px] pb-2 shadow-[3px_3px_0_#333f48] after:content-['']",
                                        "after:absolute after:left-[58%] after:bottom-[-10px] after:w-3 after:h-2.5 after:bg-game-window",
                                        "after:[border-right-width:2.5px] after:[border-right-style:solid]",
                                        "after:[border-right-color:#333f48] after:[border-bottom-width:2.5px]",
                                        "after:[border-bottom-style:solid] after:[border-bottom-color:#333f48]",
                                        "after:[transform:skewX(-30deg)]",
                                    )}>hi! i'm pebble ♪</span>
                                </div>
                            </div>
                        </article>
                        <article
                            className={aboutPanel(selected === 1)}
                            id="about-tidal"
                            aria-hidden={selected !== 1}
                        >
                            <div className={cn(
                                ui.window,
                                "px-[30px] pt-8 pb-[26px] max-[760px]:px-[18px] max-[760px]:pt-[26px] max-[760px]:pb-[18px]",
                            )}>
                                <span className={ui.windowTitle}>STAGE 1-1</span>
                                <h2 className={ui.heading} style={headingStyle}>the guild: tidal</h2>
                                <p className="mx-0 mt-0 mb-[18px] text-[15px] leading-[1.75] text-[#3f4d57] max-[760px]:text-[14px]">tidal is a student org at texas a&amp;m for people who like to make things — coders, designers, tinkerers and the hackathon-curious. we run build nights, workshops, and the occasional all-day sprint like this one.</p>
                                <div className={cn(
                                    ui.pixelFrame,
                                    "max-[760px]:hidden",
                                )}>
                                    <PixelCanvas className="block w-full h-auto [image-rendering:crisp-edges]" scene="tidal" width={96} height={48} />
                                    <span className={cn(
                                        "pix-bubble px-[11px] absolute top-[9%] left-1/2 -translate-x-1/2 whitespace-nowrap font-pixel",
                                        "text-[clamp(9px,_1vw,_11px)] text-game-ink bg-game-window border-[2.5px] border-solid",
                                        "border-game-ink rounded-md pt-[9px] pb-2 shadow-[3px_3px_0_#333f48] after:content-['']",
                                        "after:absolute after:left-[58%] after:bottom-[-10px] after:w-3 after:h-2.5 after:bg-game-window",
                                        "after:[border-right-width:2.5px] after:[border-right-style:solid]",
                                        "after:[border-right-color:#333f48] after:[border-bottom-width:2.5px]",
                                        "after:[border-bottom-style:solid] after:[border-bottom-color:#333f48]",
                                        "after:[transform:skewX(-30deg)]",
                                    )}>we build stuff!</span>
                                </div>
                            </div>
                        </article>
                        <article
                            className={aboutPanel(selected === 2)}
                            id="about-byte"
                            aria-hidden={selected !== 2}
                        >
                            <div className={cn(
                                ui.window,
                                "px-[30px] pt-8 pb-[26px] max-[760px]:px-[18px] max-[760px]:pt-[26px] max-[760px]:pb-[18px]",
                            )}>
                                <span className={ui.windowTitle}>STAGE 1-1</span>
                                <h2 className={ui.heading} style={headingStyle}>the mission: tidalBYTE</h2>
                                <p className="mx-0 mt-0 mb-[18px] text-[15px] leading-[1.75] text-[#3f4d57] max-[760px]:text-[14px]">tidalBYTE '26 is a {EVENT.hours}-hour, beginner-friendly hackathon. show up {eventDay} at {EVENT.room.toLowerCase()}, team up (or don't), build something you're proud of, and leave with new friends, free food, and maybe a scooter.</p>
                                <div className={cn(
                                    ui.pixelFrame,
                                    "max-[760px]:hidden",
                                )}>
                                    <PixelCanvas className="block w-full h-auto [image-rendering:crisp-edges]" scene="byte" width={96} height={48} />
                                    <span className={cn(
                                        "pix-bubble px-[11px] absolute top-[9%] left-1/2 -translate-x-1/2 whitespace-nowrap font-pixel",
                                        "text-[clamp(9px,_1vw,_11px)] text-game-ink bg-game-window border-[2.5px] border-solid",
                                        "border-game-ink rounded-md pt-[9px] pb-2 shadow-[3px_3px_0_#333f48] after:content-['']",
                                        "after:absolute after:left-[58%] after:bottom-[-10px] after:w-3 after:h-2.5 after:bg-game-window",
                                        "after:[border-right-width:2.5px] after:[border-right-style:solid]",
                                        "after:[border-right-color:#333f48] after:[border-bottom-width:2.5px]",
                                        "after:[border-bottom-style:solid] after:[border-bottom-color:#333f48]",
                                        "after:[transform:skewX(-30deg)]",
                                    )}>12 hrs. let's go!</span>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div className="about-controls gap-2.5 flex flex-wrap mt-[22px]" role="group" aria-label="About topics">
                        <button className={cn(
                            "py-2.5 px-3.5 border-2 border-solid border-game-ink rounded-lg bg-game-window text-game-ink",
                            "[font-family:inherit] text-[12px] leading-[1.5] cursor-pointer",
                            "aria-pressed:bg-game-blue aria-pressed:shadow-[2px_2px_0_#333f48]",
                            "focus-visible:[outline:2px_dashed_#333f48] focus-visible:[outline-offset:4px]",
                        )}
                            type="button"
                            onClick={() => setSelected(0)}
                            aria-pressed={selected === 0}
                            aria-controls="about-pebble"
                        >pebble</button>
                        <button className={cn(
                            "py-2.5 px-3.5 border-2 border-solid border-game-ink rounded-lg bg-game-window text-game-ink",
                            "[font-family:inherit] text-[12px] leading-[1.5] cursor-pointer",
                            "aria-pressed:bg-game-blue aria-pressed:shadow-[2px_2px_0_#333f48]",
                            "focus-visible:[outline:2px_dashed_#333f48] focus-visible:[outline-offset:4px]",
                        )}
                            type="button"
                            onClick={() => setSelected(1)}
                            aria-pressed={selected === 1}
                            aria-controls="about-tidal"
                        >tidal</button>
                        <button className={cn(
                            "py-2.5 px-3.5 border-2 border-solid border-game-ink rounded-lg bg-game-window text-game-ink",
                            "[font-family:inherit] text-[12px] leading-[1.5] cursor-pointer",
                            "aria-pressed:bg-game-blue aria-pressed:shadow-[2px_2px_0_#333f48]",
                            "focus-visible:[outline:2px_dashed_#333f48] focus-visible:[outline-offset:4px]",
                        )}
                            type="button"
                            onClick={() => setSelected(2)}
                            aria-pressed={selected === 2}
                            aria-controls="about-byte"
                        >tidalBYTE</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
