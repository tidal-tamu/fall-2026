import { cn, ui, headingStyle } from "./ui";
import { Fragment, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import PrizeArt from "./PrizeArt";

const prizes = [
    {
        "rank": "1ST PLACE",
        "name": "TVs",
        "rarity": "LEGENDARY",
        "color": "#efd3b8",
        "recipient": "for the 1st place team",
        "description": "bring the big-screen experience home.",
        "stats": [
            {
                "label": "TYPE",
                "value": "entertainment"
            }
        ]
    },
    {
        "rank": "2ND PLACE",
        "name": "Ninja CREAMi",
        "rarity": "EPIC",
        "color": "#d9d6e3",
        "recipient": "for the 2nd place team",
        "description": "turn your next great idea into a frozen treat.",
        "stats": [
            {
                "label": "TYPE",
                "value": "kitchen"
            }
        ]
    },
    {
        "rank": "3RD PLACE",
        "name": "projectors",
        "rarity": "RARE",
        "color": "#c6d8e2",
        "recipient": "for the 3rd place team",
        "description": "take movie nights and project demos to the big screen.",
        "stats": [
            {
                "label": "TYPE",
                "value": "entertainment"
            }
        ]
    },
    {
        "rank": "BEST BEGINNER",
        "name": "LEGO sets",
        "rarity": "SPECIAL",
        "color": "#cdd8cb",
        "recipient": "for the best beginner team",
        "description": "keep building, one brick at a time.",
        "stats": [
            {
                "label": "TYPE",
                "value": "building"
            }
        ]
    },
    {
        "rank": "DESIGN TRACK",
        "name": "iPad Airs",
        "rarity": "SPECIAL",
        "color": "#f9e4cf",
        "recipient": "for the design track winners",
        "description": "a fresh canvas for your next great design.",
        "stats": [
            {
                "label": "TYPE",
                "value": "creative"
            }
        ]
    }
] as const;

export default function Prizes() {
    const [selected, setSelected] = useState(0);
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);
    const prize = prizes[selected];
    function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        const grid = event.currentTarget.parentElement;
        if (!grid)
            return;
        const columns = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
        const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
        const offset = offsets[event.key];
        if (offset === undefined)
            return;
        event.preventDefault();
        const next = index + offset;
        if (next >= 0 && next < prizes.length) {
            setSelected(next);
            buttons.current[next]?.focus();
        }
    }
    return (
        <section id="prizes" className={cn(
            ui.section,
            "inventory py-[120px]",
        )} aria-label="Prizes">
            <div className={ui.wrap}>
                <header className="center-head mb-[38px] text-center">
                    <div className={ui.stage}><b className={cn(
                        "px-[9px] whitespace-nowrap font-normal bg-game-ink text-game-light pt-[7px] pb-1.5",
                        "rounded-[5px]",
                    )}>STAGE 1-3</b> loot</div>
                    <h2 className={ui.heading} style={headingStyle}>player inventory</h2>
                    <p className={cn(
                        ui.intro,
                        "my-0 mx-auto",
                    )}>the loot up for grabs. select an item to inspect it.</p>
                </header>
                <div className={cn(
                    ui.window,
                    "inv px-[30px] gap-7 grid [grid-template-columns:minmax(0,_1.05fr)_minmax(0,_1fr)] pt-[38px]",
                    "pb-[30px] max-[900px]:grid-cols-1 max-[760px]:px-4 max-[760px]:pt-[34px] max-[760px]:pb-[18px]",
                )}>
                    <span className={ui.windowTitle}>INVENTORY</span>
                    <div className="inv-grid gap-3.5 grid grid-cols-3 [align-content:start] max-[760px]:gap-2.5" role="group" aria-label="Prizes">
                        {prizes.map((item, index) => (<button
                            key={item.rank}
                            ref={element => { buttons.current[index] = element; }}
                            className={cn(
                                "islot p-[10%] relative [aspect-ratio:1] rounded-xl border-[2.5px] border-solid border-game-ink",
                                "cursor-pointer",
                                selected === index
                                    ? "bg-game-cream shadow-[inset_0_-5px_0_#efd3b8,0_0_0_3px_#fbfdff,0_0_0_6px_#333f48]"
                                    : "bg-game-sky shadow-[inset_0_-5px_0_#cfdde9]",
                                "[transition:transform_.2s_cubic-bezier(.34,1.56,.64,1),_background_.2s]",
                                "hover:[transform:translateY(-3px)] focus-visible:[outline:2px_dashed_#333f48]",
                                "focus-visible:[outline-offset:6px]",
                            )}
                            type="button"
                            aria-pressed={selected === index}
                            aria-label={`${item.rank}: ${item.name}`}
                            style={{ "--rc": item.color } as CSSProperties}
                            onClick={() => setSelected(index)}
                            onKeyDown={event => navigate(event, index)}
                        >
                            <PrizeArt className="block w-full h-full overflow-visible" index={index} />
                            <span className={cn(
                                "gem absolute right-1.5 top-1.5 w-2.5 h-2.5 rounded-[50%] border-2 border-solid border-game-ink",
                                "bg-[var(--rc)]",
                            )} aria-hidden="true" />
                        </button>))}
                        <div className={cn(
                            "islot flex flex-col items-center justify-center gap-4 p-[10%] [aspect-ratio:1] rounded-xl",
                            "border-[2.5px] border-dashed border-game-ink bg-game-sky text-game-ink",
                            "shadow-[inset_0_-5px_0_#cfdde9]",
                        )}>
                            <span className="font-pixel text-[28px] max-[760px]:text-[20px]" aria-hidden="true">?</span>
                            <span className="font-pixel text-[9px] leading-relaxed text-center max-[760px]:text-[7px]">and more!</span>
                        </div>
                    </div>
                    <div
                        key={selected}
                        className={cn(
                            "detail flash px-[22px] relative flex flex-col rounded-xl border-[2.5px] border-solid",
                            "border-game-ink bg-[#eef4f8] pt-[22px] pb-5 min-h-full",
                        )}
                        aria-live="polite"
                        style={{ "--rc": prize.color } as CSSProperties}
                    >
                        <div className={cn(
                            "art relative h-[210px] rounded-[10px]",
                            "[background:radial-gradient(circle_at_50%_70%,_#fbfdff_0_30%,_transparent_62%),_#dfe8ef] grid",
                            "place-items-center overflow-hidden max-[760px]:h-[170px]",
                        )}>
                            <PrizeArt className={cn(
                                "w-[min(180px,_80%)] h-auto [aspect-ratio:1] overflow-visible",
                                "animate-prize-float max-[760px]:w-[140px]",
                            )} index={selected} label={prize.name} />
                            <span className={cn(
                                "shine animate-prize-shine absolute top-0 right-0 bottom-0 left-0",
                                "bg-[linear-gradient(115deg,_transparent_30%,_rgba(255,255,255,.7)_45%,_transparent_60%)]",
                                "[transform:translateX(-100%)]",
                            )} />
                        </div>
                        <span className={cn(
                            "rar px-2 self-start mt-[18px] font-pixel text-[8px] pt-1.5 pb-[5px] rounded-[5px] border-2",
                            "border-solid border-game-ink bg-[var(--rc)]",
                        )}>{prize.rarity} · {prize.rank}</span>
                        <h3 className={cn(
                            "mx-0 mt-3 mb-1 font-pixel font-normal text-[clamp(14px,_1.5vw,_17px)] leading-[1.5]",
                            "text-game-ink",
                        )}>
                            {prize.name}
                        </h3>
                        <span className="who text-[13px] font-bold text-game-muted">
                            {prize.recipient}
                        </span>
                        <p className="mx-0 mt-2.5 mb-4 text-[14.5px] leading-[1.7] text-[#3f4d57]">
                            {prize.description}
                        </p>
                        <dl className={cn(
                            "mx-0 mt-auto mb-0 grid [grid-template-columns:auto_1fr] gap-y-1.5 gap-x-3.5 font-pixel",
                            "text-[8px] leading-[1.6]",
                        )}>
                            {prize.stats.map(({ label, value }) => <Fragment key={label}>
                                <dt className="text-game-muted">
                                    {label}
                                </dt>
                                <dd className="m-0 text-game-ink">
                                    {value}
                                </dd>
                            </Fragment>)}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    );
}
