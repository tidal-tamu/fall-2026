import { useRef, type CSSProperties, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { STICKER } from "./event";
import { SPONSOR_RAIL_HEIGHT } from "./Sponsors";

/* -------------------------------------------------------------------------- */
/*  Polaroids pinned around the wordmark, as in the "Summer Diary" reference.  */
/*  Each one bobs on its own clock and can be dragged somewhere else with a    */
/*  mouse. Touch is left alone so a swipe over a photo still scrolls the page. */
/* -------------------------------------------------------------------------- */

const SHOTS = [
    {
        sticker: "pebble-headphones",
        caption: "12 hours",
        place: "hidden xl:block xl:left-[4%] xl:top-[30%]",
        tilt: -9,
        delay: "0s",
    },
    {
        sticker: "cat",
        caption: "free food",
        place: "left-[5%] top-[75%] md:left-[10%] md:top-[64%] lg:left-[14%] lg:top-[60%]",
        tilt: 6,
        delay: "-2.4s",
    },
    {
        sticker: "panda",
        caption: "beginner friendly",
        place: "right-[5%] top-[73%] md:right-[10%] md:top-[62%] lg:right-[14%] lg:top-[58%]",
        tilt: -5,
        delay: "-1.1s",
    },
    {
        sticker: "bunny",
        caption: "prizes!!",
        place: "hidden xl:block xl:right-[4%] xl:top-[26%]",
        tilt: 8,
        delay: "-3.3s",
    },
];

/* Plain pointer drag: the card stays wherever it's dropped. */
function useDrag() {
    const from = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
    const at = useRef({ x: 0, y: 0 });

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "touch" || e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        from.current = { x: e.clientX, y: e.clientY, ox: at.current.x, oy: at.current.y };
        e.currentTarget.classList.add("polaroid-drag--held");
    };
    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const f = from.current;
        if (!f) return;
        at.current = { x: f.ox + e.clientX - f.x, y: f.oy + e.clientY - f.y };
        e.currentTarget.style.transform = `translate3d(${at.current.x}px, ${at.current.y}px, 0)`;
    };
    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        from.current = null;
        e.currentTarget.classList.remove("polaroid-drag--held");
    };

    return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
}

const Polaroid = ({ shot }: { shot: (typeof SHOTS)[number] }) => {
    const drag = useDrag();
    return (
        <div className="polaroid-drag pointer-events-auto" {...drag}>
            <div className="polaroid-bob" style={{ animationDelay: shot.delay }}>
                <figure className="polaroid" style={{ "--tilt": `${shot.tilt}deg` } as CSSProperties}>
                    <div className="polaroid__photo">
                        <img src={STICKER(shot.sticker)} alt="" draggable={false} decoding="async" />
                    </div>
                    <figcaption className="polaroid__caption">{shot.caption}</figcaption>
                </figure>
            </div>
        </div>
    );
};

const Polaroids = ({ shouldAnimate = false }: { shouldAnimate?: boolean }) => (
    <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[35]"
        style={{ bottom: `calc(${SPONSOR_RAIL_HEIGHT}px + var(--runner-h))` }}
    >
        {SHOTS.map((shot, i) => (
            <motion.div
                key={shot.sticker}
                className={`absolute w-[84px] md:w-[108px] lg:w-[124px] ${shot.place}`}
                initial={{ opacity: 0, y: 18 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 + i * 0.09 }}
            >
                <Polaroid shot={shot} />
            </motion.div>
        ))}
    </div>
);

export default Polaroids;
