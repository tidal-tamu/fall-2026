import { cn, ui, headingStyle } from "./ui";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import PixelCanvas from "./PixelArt";

const questions = [
    ['who can join?', "any student, any major, any level! never coded before? perfect — you're exactly who this is for ♪"],
    ['do i need a team?', "nope! come solo and we'll help you find teammates at the mixer. teams are up to 4."],
    ['is it free?', '100% free. food, swag and wifi are on us (well, on our sponsors).'],
    ['what do i bring?', 'a laptop, a charger, your student id, and one (1) idea. or zero ideas. we keep spares.'],
    ['is it overnight?', "nope, just 12 hours! you'll be home in bed before midnight."],
    ["who's pebble?", "it me! tidal's mascot. i hold a fish. that's mostly the job."]
] as const;

const greeting = "hi! i'm pebble ♪ pick a question below and i'll answer!";

export default function FAQs() {
    // A fresh selection also replays typing when the same question is clicked.
    const [selection, setSelection] = useState<{ index: number } | null>(null);
    const selected = selection?.index ?? null;
    const [letters, setLetters] = useState(0);
    const reduce = useReducedMotion();
    const answer = selected === null ? greeting : questions[selected][1];
    const displayed = reduce || selected === null ? answer : answer.slice(0, letters);
    const typing = displayed.length < answer.length;
    useEffect(() => {
        setLetters(0);
        if (reduce || selected === null)
            return;
        let count = 0;
        const timer = window.setInterval(() => {
            count += 1;
            setLetters(count);
            if (count >= answer.length) window.clearInterval(timer);
        }, 26);
        return () => window.clearInterval(timer);
    }, [answer, selected, selection, reduce]);
    return (
        <section id="faq" className={cn(
            ui.section,
            "faq py-[120px]",
        )} aria-label="FAQ">
            <div className={ui.wrap}>
                <header className="center-head mb-[38px] text-center">
                    <div className={ui.stage}><b className={cn(
                        "px-[9px] whitespace-nowrap font-normal bg-game-ink text-game-light pt-[7px] pb-1.5",
                        "rounded-[5px]",
                    )}>STAGE 1-5</b> faq</div>
                    <h2 className={ui.heading} style={headingStyle}>ask pebble</h2>
                    <p className={cn(
                        ui.intro,
                        "my-0 mx-auto",
                    )}>pick a question. pebble knows things.</p>
                </header>
                <div className={cn(
                    "gba px-[26px] my-0 mx-auto gap-5 relative z-[2] w-[min(860px,_100%)] grid",
                    "[grid-template-columns:1fr_minmax(0,_520px)_1fr] items-center pt-[26px] pb-[34px]",
                    "rounded-[44px_44px_64px_64px] bg-game-blue border-[3px] border-solid border-game-ink",
                    "shadow-[10px_10px_0_rgba(51,_63,_72,_.16),_inset_0_-10px_0_#b4cadb] max-[760px]:px-[18px]",
                    "max-[760px]:[grid-template-columns:1fr_1fr] max-[760px]:pt-[18px] max-[760px]:pb-[26px]",
                    "max-[760px]:rounded-[30px_30px_46px_46px]",
                )}>
                    <div className={cn(
                        "dpad [grid-column:1] justify-self-center w-[92px] h-[92px] relative before:content-['']",
                        "before:absolute before:bg-game-penguin before:border-[3px] before:border-solid",
                        "before:border-game-ink before:rounded-md before:left-[32%] before:right-[32%] before:top-0",
                        "before:bottom-0 after:content-[''] after:absolute after:bg-game-penguin after:border-[3px]",
                        "after:border-solid after:border-game-ink after:rounded-md after:top-[32%] after:bottom-[32%]",
                        "after:left-0 after:right-0 max-[760px]:[grid-column:1] max-[760px]:[grid-row:2]",
                        "max-[760px]:w-[70px] max-[760px]:h-[70px]",
                    )} aria-hidden="true"></div>
                    <div className={cn(
                        "bezel px-[18px] [grid-column:2] bg-game-penguin border-[3px] border-solid border-game-ink",
                        "rounded-[16px_16px_30px_16px] pt-4 pb-3.5 max-[760px]:[grid-column:1_/_-1]",
                        "max-[760px]:[grid-row:1]",
                    )}>
                        <div className="gscreen relative rounded-md overflow-hidden border-2 border-solid border-[#2b343b] bg-game-sky">
                            <PixelCanvas className="block w-full h-auto [image-rendering:crisp-edges]" scene="faq" width={120} height={72} talking={typing} />
                            <div className={cn(
                                "gbubble px-3.5 absolute left-[5%] right-[5%] top-[6%] min-h-[34%] pt-3 pb-3.5 font-pixel",
                                "text-[clamp(9px,_1.25vw,_12px)] leading-[1.75] text-game-ink bg-game-window border-[3px]",
                                "border-solid border-game-ink rounded-lg shadow-[3px_3px_0_#333f48]",
                            )} aria-live="polite">
                                <span>
                                    {displayed}
                                </span>
                                <i className={cn(
                                    "caret inline-block w-[.6em] h-[.9em] ml-1 [vertical-align:-2px] bg-game-ink",
                                    "animate-caret",
                                )} aria-hidden="true"></i>
                            </div>
                        </div>
                        <div className="tag2 flex justify-between mt-2.5 font-pixel text-[8px] text-[#b9c8d3]" aria-hidden="true">
                            <span><i className="w-2 h-2 rounded-[50%] bg-[#f2c9a0] inline-block mr-1.5 shadow-[0_0_6px_#f2c9a0]"></i>POWER</span>
                            <span>PEBBLE ADVANCE</span>
                        </div>
                    </div>
                    <div className={cn(
                        "ab gap-3.5 [grid-column:3] justify-self-center flex [transform:rotate(-18deg)]",
                        "max-[760px]:[grid-column:2] max-[760px]:[grid-row:2]",
                    )} aria-hidden="true">
                        <span className={cn(
                            "grid place-items-center w-[50px] h-[50px] rounded-[50%] bg-game-peach border-[3px] border-solid",
                            "border-game-ink shadow-[0_4px_0_#333f48] font-pixel text-[11px] text-game-ink max-[760px]:w-10",
                            "max-[760px]:h-10",
                        )}>B</span>
                        <span className={cn(
                            "mt-[-22px] grid place-items-center w-[50px] h-[50px] rounded-[50%] bg-game-peach border-[3px] border-solid",
                            "border-game-ink shadow-[0_4px_0_#333f48] font-pixel text-[11px] text-game-ink max-[760px]:w-10",
                            "max-[760px]:h-10",
                        )}>A</span>
                    </div>
                    <span className={cn(
                        "speaker absolute right-[54px] bottom-[22px] w-16 h-[30px]",
                        "[background:radial-gradient(circle,_#333f48_2px,_transparent_2.6px)_0_0_/_11px_11px] opacity-60",
                        "max-[760px]:hidden",
                    )} aria-hidden="true"></span>
                </div>
                <div className="qs mx-auto gap-3 flex flex-wrap justify-center mt-[38px] mb-0 max-w-[860px]">
                    {questions.map(([question], index) => (<button
                        key={question}
                        className={cn(
                            "qbtn py-3 px-[18px] [font-family:inherit] text-[14px] font-bold leading-[1.5] text-game-ink",
                            "cursor-pointer rounded-[999px] bg-game-window aria-pressed:bg-game-cream border-[2.5px] border-solid border-game-ink",
                            "shadow-[0_4px_0_#333f48] [transition:transform_.12s_ease,_box-shadow_.12s_ease,_background_.2s]",
                            "hover:[transform:translateY(-2px)] hover:shadow-[0_6px_0_#333f48]",
                            "active:[transform:translateY(3px)] active:shadow-[0_1px_0_#333f48]",
                            "focus-visible:[outline:2px_dashed_#333f48] focus-visible:[outline-offset:4px]",
                        )}
                        type="button"
                        aria-pressed={selected === index}
                        onClick={() => {
                            setLetters(0);
                            setSelection({ index });
                        }}
                    >
                        {question}
                    </button>))}
                </div>
            </div>
        </section>
    );
}
