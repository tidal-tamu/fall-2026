import { cn, ui, headingStyle } from "./ui";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { QUESTS, EVENT, fmtCentral } from "./event";
import PixelCanvas from "./PixelArt";
import { createQuestLog } from "./QuestLog";

const questTags = {
    main: "bg-game-peach",
    side: "bg-game-blue",
    food: "bg-game-sage",
    boss: "bg-game-ink text-game-cream",
} as const;

type Quest = (typeof QUESTS)[number];

function QuestRow({ quest, index }: {
    quest: Quest;
    index: number;
}) {
    const row = useRef<HTMLLIElement>(null);
    const visible = useInView(row, { once: true, margin: "0px 0px -8% 0px" });
    const reduce = useReducedMotion();
    return (
        <li
            ref={row}
            className={cn(`q${quest.highlight ? " main" : ""}${visible || reduce ? " in" : ""}`, "py-[11px] gap-3.5 relative grid [grid-template-columns:76px_30px_minmax(0,_1fr)_auto]",
                "items-center pr-3 pl-[30px] rounded-[10px]",
                visible || reduce ? "opacity-100 transform-none" : "opacity-0 [transform:translateX(-14px)]",
                "[transition:opacity_.5s_ease,_transform_.6s_cubic-bezier(.16,1,.3,1),_background_.2s]",
                "before:content-['▶'] before:absolute before:left-[9px] before:top-1/2 before:[translate:0_-50%]",
                "before:text-[11px] before:text-game-ink before:opacity-0 before:[transition:opacity_.15s]",
                "hover:before:opacity-100",
                quest.highlight ? "bg-[#f9ebdc] hover:bg-[#f6e1cc]" : "hover:bg-[#eef4f8] focus-within:bg-[#eef4f8]",
                "hover:before:animate-quest-pointer max-[760px]:py-2.5",
                "max-[760px]:gap-2.5 max-[760px]:[grid-template-columns:58px_minmax(0,_1fr)_auto]",
                "max-[760px]:pr-2 max-[760px]:pl-[22px]")}
            tabIndex={0}
            style={{ transitionDelay: `${index % 4 * 70}ms` }}
        >
            <span className="q-time font-pixel text-[11px] text-game-ink tabular-nums max-[760px]:text-[9px]">
                {quest.time}
            </span>
            <PixelCanvas className="w-[30px] h-[30px] [image-rendering:pixelated] max-[760px]:hidden" sprite={quest.icon} width={16} height={16} />
            <span className="q-name text-[15px] font-bold text-[#2c363e] leading-[1.35] max-[760px]:text-[14px]">
                {quest.name}
                {quest.note && <small className="block font-normal text-[13px] text-[#5e6b75] mt-0.5">
                    {quest.note}
                </small>}
            </span>
            <span className={cn(`tag ${quest.kind}`, questTags[quest.kind], "px-[7px] font-pixel text-[7.5px] tracking-[.03em] pt-1.5 pb-[5px] rounded-[5px] border-2",
                "border-solid border-game-ink whitespace-nowrap")}>
                {quest.kind.toUpperCase()}
            </span>
        </li>
    );
}

function SaveQuestLog() {
    const dialog = useRef<HTMLDialogElement>(null);
    const imageUrl = useRef<string>();
    const mounted = useRef(false);
    const [url, setUrl] = useState<string>();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            if (imageUrl.current)
                URL.revokeObjectURL(imageUrl.current);
        };
    }, []);
    async function save() {
        setSaving(true);
        setError("");
        try {
            const blob = await createQuestLog();
            if (!mounted.current)
                return;
            if (!blob)
                throw new Error("Image export is unavailable. Please try again.");
            if (imageUrl.current)
                URL.revokeObjectURL(imageUrl.current);
            imageUrl.current = URL.createObjectURL(blob);
            setUrl(imageUrl.current);
            dialog.current?.showModal();
        }
        catch (cause) {
            if (mounted.current)
                setError(cause instanceof Error ? cause.message : "Could not save the quest log. Please try again.");
        }
        finally {
            if (mounted.current)
                setSaving(false);
        }
    }
    return (
        <>
            <div className={cn(
                "qfoot px-2.5 gap-3.5 flex flex-wrap items-center justify-between mt-3.5 pt-4 pb-0",
                "[border-top-width:2.5px] [border-top-style:dashed] [border-top-color:#c6d8e2]",
            )}>
                <span className="text-[12px] text-[#6f7f8b]">keep a copy on your phone for the day</span>
                <button className={ui.button} type="button" disabled={saving} onClick={save}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            d="M4 4h12l4 4v12H4zM8 4v5h7V4M7 20v-7h10v7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {saving ? "SAVING…" : "SAVE QUEST LOG"}
                </button>
                {error && <p className="mt-0" role="alert">
                    {error}
                </p>}
            </div>
            <dialog
                ref={dialog}
                className={cn(
                    "open:animate-dialog-open save-dlg p-0 border-0 border-none border-current bg-transparent w-[min(560px,_92vw)]",
                    "max-h-[94vh] overflow-visible backdrop:bg-[rgba(38,_49,_58,_.55)]",
                    "backdrop:[backdrop-filter:blur(3px)]",
                )}
                aria-labelledby="saveTitle"
                onClick={event => {
                    if (event.target === event.currentTarget)
                        dialog.current?.close();
                }}
            >
                <div className={cn(
                    ui.window,
                    "save-card px-[18px] gap-3.5 flex flex-col max-h-[90vh] pt-[22px] pb-[18px]",
                )}>
                    <div className="save-head flex justify-between items-center font-pixel text-[11px] text-game-ink">
                        <span id="saveTitle">game saved ♪</span>
                        <button className={cn(
                            "x w-[38px] h-[38px] rounded-[50%] border-[2.5px] border-solid border-game-ink bg-game-window",
                            "cursor-pointer text-[14px] text-game-ink",
                        )} type="button" aria-label="Close" onClick={() => dialog.current?.close()}>✕</button>
                    </div>
                    <div className={cn(
                        "save-img min-h-0 overflow-auto rounded-[10px] border-2 border-solid border-[#c9d6df]",
                        "bg-[#e6eef3]",
                    )}>
                        {url && <img className="block w-full h-auto" src={url} alt="tidalBYTE '26 quest log (schedule)" />}
                    </div>
                    <div className="save-actions flex flex-wrap items-center justify-center gap-y-3.5 gap-x-5">
                        <a className={ui.button} download="tidalbyte-26-quest-log.png" href={url}>DOWNLOAD PNG</a>
                        <a className="open text-[13px] font-bold text-game-ink [text-underline-offset:4px]" href={url} target="_blank" rel="noopener noreferrer">open full size ↗</a>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default function Schedule() {
    const dateLine = fmtCentral(EVENT.startsAt, { weekday: "short", month: "short", day: "numeric" }).toUpperCase().replace(",", " ·");
    return (
        <section id="schedule" className={cn(
            ui.section,
            "quests py-[120px]",
        )} aria-label="Schedule">
            <div className={ui.wrap}>
                <header className="center-head mb-[38px] text-center">
                    <div className={ui.stage}><b className={cn(
                        "px-[9px] whitespace-nowrap font-normal bg-game-ink text-game-light pt-[7px] pb-1.5",
                        "rounded-[5px]",
                    )}>STAGE 1-2</b> quest log</div>
                    <h2 className={ui.heading} style={headingStyle}>today's quests</h2>
                    <p className={cn(
                        ui.intro,
                        "my-0 mx-auto",
                    )}>the schedule for the day. times are a draft — the final quest log drops closer to nov 21.</p>
                </header>
                <div className={cn(
                    "qlog-wrap gap-7 grid [grid-template-columns:190px_minmax(0,_760px)] justify-center [align-items:start]",
                    "max-[900px]:grid-cols-1",
                )}>
                    <div className={cn(
                        "giver gap-2.5 sticky top-[120px] flex flex-col items-center max-[900px]:static",
                        "max-[900px]:flex-row max-[900px]:justify-center",
                    )} aria-hidden="true">
                        <div className={cn(
                            ui.pixelFrame,
                            "w-[190px] max-[900px]:w-[150px]",
                        )}>
                            <PixelCanvas className="block w-full h-auto [image-rendering:crisp-edges]" scene="giver" width={48} height={48} />
                        </div>
                        <span className={cn(
                            "ex absolute top-[-18px] left-1/2 -translate-x-1/2 font-pixel text-[22px] text-[#f2c9a0]",
                            "[text-shadow:2px_0_0_#333f48,_-2px_0_0_#333f48,_0_2px_0_#333f48,_0_-2px_0_#333f48,_3px_3px_0_#333f48]",
                            "animate-quest-hop",
                        )}>!</span>
                        <small className="font-pixel text-[8px] leading-[1.7] text-game-muted text-center max-[900px]:text-left">quest giver:<br />pebble</small>
                    </div>
                    <div className={cn(
                        ui.window,
                        "qlog px-[26px] pt-[34px] pb-6 max-[760px]:px-3 max-[760px]:pt-[30px] max-[760px]:pb-[18px]",
                    )}>
                        <span className={ui.windowTitle}>QUEST LOG</span>
                        <div className={cn(
                            "qhead px-2.5 flex flex-wrap justify-between gap-y-2 gap-x-4 pt-0 pb-3.5",
                            "[border-bottom-width:2.5px] [border-bottom-style:dashed] [border-bottom-color:#c6d8e2]",
                            "font-pixel text-[9px] leading-[1.7] text-game-muted",
                        )}>
                            <span>
                                <b className="font-normal text-game-ink">tidalBYTE '26</b>
                            </span>
                            <span>{dateLine} · {EVENT.room}</span>
                            <span>{QUESTS.length} QUESTS</span>
                        </div>
                        <ol className="qlist p-0 mx-0 list-none mt-2 mb-0">
                            {QUESTS.map((quest, index) => <QuestRow key={`${quest.time}-${quest.name}`} quest={quest} index={index} />)}
                        </ol>
                        <SaveQuestLog />
                    </div>
                </div>
            </div>
        </section>
    );
}
