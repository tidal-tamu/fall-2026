import { cn, ui } from "./ui";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion, type MotionValue } from "framer-motion";
import PixelCanvas from "./PixelArt";
import { WalkingPebble } from "./PebbleArt";

const stages = [
    { id: "about", number: "1-1", sign: "pebble", title: "meet pebble", icon: "heart", item: "HERO BADGE" },
    { id: "schedule", number: "1-2", sign: "quests", title: "quest log", icon: "comic", item: "QUEST LOG" },
    { id: "prizes", number: "1-3", sign: "loot", title: "player inventory", icon: "gem", item: "LOOT GEM" },
    { id: "sponsors", number: "1-4", sign: "sponsors", title: "powered by", icon: "heart", item: "SPONSOR BADGE" },
    { id: "faq", number: "1-5", sign: "faq", title: "ask pebble", icon: "fish", item: "PEBBLE'S FISH" },
    { id: "register", number: "★", sign: "save", title: "save point", icon: "star", item: "GOLD STAR" },
] as const;

type StageId = (typeof stages)[number]["id"];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const heart = "M1 0h2v1h1V0h2v1h1v3h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1V4H0V1h1z";

function clockAt(progress: number) {
    const minutes = Math.round((8 * 60 + progress * (14 * 60 + 15)) / 5) * 5;
    const hour = Math.floor(minutes / 60) % 24;
    return `${(hour + 11) % 12 + 1}:${String(minutes % 60).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

export default function LevelNavigation({ progress }: {
    progress: MotionValue<number>;
}) {
    const street = useRef<HTMLElement>(null);
    const walker = useRef<HTMLDivElement>(null);
    const clock = useRef<HTMLSpanElement>(null);
    const posts = useRef<(HTMLAnchorElement | null)[]>([]);
    const statusRef = useRef({ visible: false, stage: 0 });
    const [status, setStatus] = useState(statusRef.current);
    const collectedRef = useRef(new Set<StageId>());
    const [collected, setCollected] = useState<ReadonlySet<StageId>>(collectedRef.current);
    const [lastReward, setLastReward] = useState<(typeof stages)[number] | null>(null);
    const [toast, setToast] = useState(false);
    const reduce = useReducedMotion();
    useEffect(() => {
        if (!lastReward)
            return;
        setToast(true);
        const timer = window.setTimeout(() => setToast(false), 1600);
        return () => window.clearTimeout(timer);
    }, [lastReward]);
    useEffect(() => {
        const road = street.current;
        const penguin = walker.current;
        if (!road || !penguin)
            return;
        const sections = stages.map(stage => document.getElementById(stage.id));
        const hero = document.getElementById("top");
        if (!hero || sections.some(section => !section))
            return;
        let disposed = false;
        let arrivals: number[] = [];
        let sectionBounds: { top: number; bottom: number }[] = [];
        let heroEnd = 0;
        let resizeTimer = 0;
        let raf = 0;
        let last = performance.now();
        let position = -1;
        let facing = 1;
        let step = 0;
        let easedProgress = -1;
        let previous = statusRef.current;
        const padding = 64;
        function layout() {
            if (disposed || !road || !hero)
                return;
            heroEnd = hero.offsetHeight;
            sectionBounds = sections.map(section => {
                const bounds = section!.getBoundingClientRect();
                return { top: bounds.top + window.scrollY, bottom: bounds.bottom + window.scrollY };
            });
            const start = (sections[0]?.getBoundingClientRect().top ?? 0) + window.scrollY - window.innerHeight * 0.25;
            const end = Math.max(start + 1, document.documentElement.scrollHeight - window.innerHeight);
            arrivals = sections.map((section, index) => index === 0 ? start : Math.min(end, (section?.getBoundingClientRect().top ?? 0) + window.scrollY - window.innerHeight * 0.25));
            for (let index = 1; index < arrivals.length; index++) {
                arrivals[index] = Math.max(arrivals[index], arrivals[index - 1] + 1);
            }
            arrivals[arrivals.length - 1] = Math.max(arrivals[arrivals.length - 1], end);
            posts.current.forEach((post, index) => {
                if (post)
                    post.style.left = `${padding + index / (stages.length - 1) * (road.clientWidth - padding * 2)}px`;
            });
        }
        // Only transforms and CSS variables change each frame. React renders
        // again when a stage, collected item, or HUD visibility changes.
        function frame(now: number) {
            if (disposed || !road || !penguin)
                return;
            const delta = Math.min(0.1, (now - last) / 1000);
            last = now;
            const y = window.scrollY;
            const intervals = arrivals.length - 1;
            let fraction = 0;
            if (y >= arrivals[intervals])
                fraction = 1;
            else if (y > arrivals[0]) {
                for (let index = 0; index < intervals; index++) {
                    if (y < arrivals[index + 1]) {
                        fraction = (index + clamp((y - arrivals[index]) / (arrivals[index + 1] - arrivals[index]))) / intervals;
                        break;
                    }
                }
            }
            if (easedProgress < 0)
                easedProgress = fraction;
            easedProgress += (fraction - easedProgress) * (reduce ? 1 : 1 - Math.exp(-delta * 3.2));
            progress.set(easedProgress);
            const visible = y > heroEnd - window.innerHeight * 0.35;
            const stage = Math.min(stages.length - 1, Math.floor(fraction * intervals + 0.02));
            if (visible !== previous.visible || stage !== previous.stage) {
                previous = { visible, stage };
                statusRef.current = previous;
                setStatus(previous);
            }

            // Award the section actually being visited, independently of the
            // interpolated progress that moves Pebble and changes the sky.
            const visitLine = y + window.innerHeight * 0.25;
            const atBottom = y >= document.documentElement.scrollHeight - window.innerHeight - 1;
            const visited = atBottom
                ? stages.length - 1
                : sectionBounds.findIndex(bounds => bounds.top <= visitLine && bounds.bottom > visitLine);
            if (visible && visited >= 0) {
                const reward = stages[visited];
                if (!collectedRef.current.has(reward.id)) {
                    const next = new Set(collectedRef.current);
                    next.add(reward.id);
                    collectedRef.current = next;
                    setCollected(next);
                    setLastReward(reward);
                }
            }
            if (clock.current)
                clock.current.textContent = clockAt(easedProgress);
            const target = padding + fraction * (road.clientWidth - padding * 2);
            if (position < 0)
                position = target;
            const oldPosition = position;
            position += (target - position) * (reduce ? 1 : 1 - Math.exp(-delta * 6));
            const velocity = (position - oldPosition) / Math.max(delta, 0.001);
            if (Math.abs(velocity) > 8) {
                facing = velocity > 0 ? 1 : -1;
                step += Math.abs(velocity) * delta * 0.09;
            }
            const walking = Math.abs(velocity) > 8 && !reduce;
            penguin.classList.toggle("walking", walking);
            penguin.style.transform = `translateX(${(position - penguin.offsetWidth / 2).toFixed(1)}px) translateY(${walking ? (-Math.abs(Math.sin(step * Math.PI)) * 4).toFixed(1) : 0}px) scaleX(${facing})`;
            penguin.style.setProperty("--step", `${(Math.sin(step * Math.PI) * 4).toFixed(2)}px`);
            penguin.style.setProperty("--stepb", `${(-Math.sin(step * Math.PI) * 4).toFixed(2)}px`);
            penguin.style.setProperty("--sway", `${(walking ? Math.sin(step * Math.PI) * 5 : 0).toFixed(2)}deg`);
            posts.current.forEach((post, index) => {
                post?.classList.toggle("passed", index / intervals <= fraction + 0.005);
                post?.classList.toggle("here", Math.abs(index / intervals - fraction) < 0.03);
            });
            raf = requestAnimationFrame(frame);
        }
        const resize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(layout, 150);
        };
        layout();
        void document.fonts.ready.then(layout);
        const observer = new ResizeObserver(resize);
        sections.forEach(section => {
            if (section)
                observer.observe(section);
        });
        observer.observe(hero);
        window.addEventListener("resize", resize);
        raf = requestAnimationFrame(frame);
        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            window.clearTimeout(resizeTimer);
            window.removeEventListener("resize", resize);
            observer.disconnect();
        };
    }, [progress, reduce]);
    const current = stages[status.stage];
    return createPortal(<div className={cn(
        ui.levelMotion, ui.focus,
        "byte-site byte-overlay fixed isolate text-game-ink font-gameMono top-0",
        "right-0 bottom-0 left-0 z-50 pointer-events-none",
    )}>
        <div
            id="hud"
            className={cn(status.visible ? "show transform-none" : "[transform:translateY(-140%)]", "py-[7px] gap-3 pointer-events-auto fixed left-3 right-3 top-2.5 z-[46] flex items-center",
                "justify-between pr-2 pl-2.5 rounded-[14px] bg-[rgba(251,_253,_255,_.92)] border-[2.5px]",
                "border-solid border-game-ink shadow-[0_4px_0_rgba(51,_63,_72,_.18)] [backdrop-filter:blur(4px)]",
                "leading-[normal]",
                "[transition:transform_.55s_cubic-bezier(.16,1,.3,1)] max-[760px]:p-1.5 max-[760px]:gap-2",
                "max-[760px]:left-2 max-[760px]:right-2 max-[760px]:top-2")}
            aria-label="Game HUD"
            aria-hidden={!status.visible}
        >
            <div className="hud-l gap-3 flex items-center min-w-0">
                <PixelCanvas className={cn(
                    "hud-face w-[30px] h-[30px] border-2 border-solid border-game-ink rounded-lg bg-game-sky",
                    "[image-rendering:pixelated]",
                )} sprite="pebble" width={16} height={16} />
                <span className="hud-name font-pixel text-[9px] leading-[1.6] text-game-ink max-[760px]:hidden">PEBBLE<small className="block text-[7px] text-game-muted">LV 26</small></span>
                <span className="hud-hearts gap-[3px] flex max-[760px]:hidden" aria-hidden="true">
                    {[0, 1, 2].map(index => <svg className="w-3.5 h-3.5 [shape-rendering:crispEdges]" key={index} viewBox="0 0 7 7">
                        <path fill="#7fa7c4" d={heart} />
                    </svg>)}
                </span>
            </div>
            <div className={cn(
                "hud-stage font-pixel text-[9px] text-game-ink whitespace-nowrap overflow-hidden text-ellipsis",
                "max-[760px]:hidden",
            )} aria-live="polite">
                <b className="font-normal text-game-muted mr-2">
                    {status.stage === stages.length - 1 ? "FINAL" : `STAGE ${current.number}`}
                </b>
                {current.title}
            </div>
            <div className="hud-r gap-3 flex items-center min-w-0">
                <div className="slots gap-1 flex" aria-label="Items collected">
                    {stages.map(stage => (<span
                        key={stage.id}
                        className={cn("slot relative w-[30px] h-[30px] rounded-[7px] border-2 border-solid border-game-ink grid",
                            "place-items-center max-[760px]:w-[26px] max-[760px]:h-[26px]",
                            collected.has(stage.id) ? "got bg-game-cream" : "bg-game-sky")}
                        title={stage.item}
                        data-reward={stage.id}
                        aria-label={`${stage.item}: ${collected.has(stage.id) ? "collected" : "locked"}`}
                    >
                        <PixelCanvas className={cn(
                            "w-[22px] h-[22px] [image-rendering:pixelated]",
                            "[transition:opacity_.3s,_transform_.45s_cubic-bezier(.34,1.56,.64,1)] max-[760px]:w-[18px]",
                            "max-[760px]:h-[18px]",
                            collected.has(stage.id) ? "opacity-100 transform-none" : "opacity-0 [transform:scale(.3)]",
                        )} sprite={stage.icon} width={16} height={16} />
                        {!collected.has(stage.id) && (
                            <span className="absolute font-pixel text-[8px] text-[#9fb1be]" aria-hidden="true">?</span>
                        )}
                    </span>))}
                </div>
                <span className={cn(
                    "hud-clock gap-1.5 flex items-center font-pixel text-[8px] text-game-muted whitespace-nowrap",
                    "max-[760px]:hidden",
                )} aria-hidden="true">
                    <i className={cn(
                        "w-2.5 h-2.5 rounded-[50%] border-2 border-solid border-game-muted relative after:content-['']",
                        "after:absolute after:left-[2.6px] after:top-[.4px] after:w-[1.6px] after:h-[3.6px]",
                        "after:bg-game-muted",
                    )} />
                    <span className="max-[760px]:hidden" ref={clock}>8:00 AM</span>
                </span>
            </div>
        </div>
        <div className={cn(toast ? "toast on opacity-100 [transform:translate(-50%,_0)]" : "toast opacity-0 [transform:translate(-50%,_-12px)]", "px-3 fixed left-1/2 top-[70px] z-[47]",
            "pointer-events-none font-pixel text-[10px] text-game-ink bg-game-cream border-[2.5px]",
            "border-solid border-game-ink rounded-lg pt-[9px] pb-2 shadow-[3px_3px_0_#333f48]",
            "[transition:opacity_.3s,_transform_.45s_cubic-bezier(.34,1.56,.64,1)]")} role="status">
            {lastReward ? `+ ${lastReward.item}` : ""}
        </div>
        <nav
            id="street"
            ref={street}
            className={cn(status.visible ? "show transform-none" : "[transform:translateY(110%)]", "fixed left-0 right-0 bottom-0 h-[66px] z-[45] pointer-events-none",
                "[transition:transform_.55s_cubic-bezier(.16,1,.3,1)]")}
            aria-label="Stages"
            aria-hidden={!status.visible}
        >
            <div className={cn(
                "road absolute left-0 right-0 bottom-0 h-6 bg-[#8b9aa6] [border-top-width:2.5px]",
                "[border-top-style:solid] [border-top-color:#333f48] before:content-[''] before:absolute",
                "before:left-0 before:right-0 before:top-[-12px] before:h-[9px] before:bg-[#b0c6ce]",
                "before:[border-top-width:2.5px] before:[border-top-style:solid]",
                "before:[border-top-color:#333f48]",
            )}>
                <span className={cn(
                    "lanes absolute left-0 right-0 top-1/2 h-[3px] mt-[-1.5px]",
                    "bg-[repeating-linear-gradient(90deg,_#e0c5ab_0_46px,_transparent_46px_84px)]",
                )} />
            </div>
            {stages.map((stage, index) => (<a
                key={stage.id}
                ref={element => { posts.current[index] = element; }}
                className={cn(
                    "post group/post absolute z-[2] bottom-[33px] -translate-x-1/2 pointer-events-auto flex flex-col",
                    "items-center no-underline min-w-9",
                )}
                href={`#${stage.id}`}
                tabIndex={status.visible ? 0 : -1}
                onClick={event => {
                    const section = document.getElementById(stage.id);
                    if (!section)
                        return;
                    event.preventDefault();
                    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY + (index === 0 ? window.innerHeight * 0.2 : 0), behavior: reduce ? "auto" : "smooth" });
                }}
            >
                <span className={cn(
                    "group-[.passed]/post:bg-game-cream group-[.here]/post:[transform:translateY(-4px)]",
                    "group-hover/post:[transform:translateY(-4px)]",
                    "group-focus-visible/post:[outline:2px_dashed_#333f48] group-focus-visible/post:[outline-offset:3px]",
                    "plate px-[7px] gap-1.5 flex items-center pt-[5px] pb-1 whitespace-nowrap rounded-md font-pixel",
                    "text-[8px] text-game-ink bg-game-window border-2 border-solid border-game-ink",
                    "shadow-[2px_2px_0_#333f48] [transition:transform_.3s_cubic-bezier(.16,1,.3,1),_background_.3s]",
                    "max-[760px]:px-[5px] max-[760px]:pt-1 max-[760px]:pb-[3px]",
                )}>
                    <b className="px-1 font-normal pt-[3px] pb-0.5 rounded-[3px] bg-game-ink text-game-light">
                        {stage.number}
                    </b>
                    <em className="[font-style:normal] max-[760px]:hidden">
                        {stage.sign}
                    </em>
                </span>
                <span className="pole w-[3px] h-[9px] bg-game-ink" />
            </a>))}
            <div className="walker group/walker absolute z-[1] left-0 bottom-[27px] w-[42px] will-change-transform" ref={walker} aria-hidden="true">
                <WalkingPebble />
            </div>
        </nav>
    </div>, document.body);
}
