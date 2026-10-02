import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { STICKER } from "./event";

/* -------------------------------------------------------------------------- */
/*  Four polaroid stickers floating over the cloud bank, as in the Summer      */
/*  Diary reference: white frame, ink edge, a die-cut white border, and a      */
/*  tinted photo that alternates cool blue and soft grey.                      */
/* -------------------------------------------------------------------------- */

const SHOTS = [
    { sticker: "pebble-headphones", place: "diary-photo--1", tilt: -14, tint: "#dce7f2", delay: "0s" },
    { sticker: "cat", place: "diary-photo--2", tilt: 7, tint: "#e4e2dd", delay: "-2.4s" },
    { sticker: "panda", place: "diary-photo--3", tilt: -10, tint: "#e4e2dd", delay: "-1.1s" },
    { sticker: "bunny", place: "diary-photo--4", tilt: 4, tint: "#dce7f2", delay: "-3.3s" },
];

const Polaroids = ({ shouldAnimate = false }: { shouldAnimate?: boolean }) => (
    <>
        {SHOTS.map((shot, i) => (
            <motion.div
                key={shot.sticker}
                className={`diary-photo ${shot.place}`}
                aria-hidden="true"
                initial={{ opacity: 0, y: 18 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 + i * 0.08 }}
            >
                <div className="diary-photo__bob" style={{ animationDelay: shot.delay }}>
                    <div
                        className="diary-photo__card"
                        style={{ "--tilt": `${shot.tilt}deg`, "--tint": shot.tint } as CSSProperties}
                    >
                        <div className="diary-photo__pic">
                            <img src={STICKER(shot.sticker)} alt="" decoding="async" draggable={false} />
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
    </>
);

export default Polaroids;
