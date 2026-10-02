import { motion } from "framer-motion";
import { EVENT } from "./event";
import HeroSky from "./HeroSky";
import Polaroids from "./Polaroids";
import StickerTitle from "./StickerTitle";

/* -------------------------------------------------------------------------- */
/*  The Summer Diary hero, kept to what the reference holds and nothing more:  */
/*  a sticker title and register button over a towering cloud bank, polaroids  */
/*  floating across it, and one quiet line of facts on the road.               */
/* -------------------------------------------------------------------------- */

interface HeroProps {
    shouldAnimate?: boolean;
}

const TAGLINE = `[ ${EVENT.date.toLowerCase()} · ${EVENT.room.toLowerCase()} · ${EVENT.hours} hours ]`;

/* Goes live on its own once event.ts has registrationOpen and a registerUrl. */
const REGISTER_LIVE = EVENT.registrationOpen && Boolean(EVENT.registerUrl);

const Hero = ({ shouldAnimate = false }: HeroProps) => {
    const rise = (delay: number) => ({
        initial: { y: 16, opacity: 0 },
        animate: shouldAnimate ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 },
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const, delay },
    });

    return (
        <div className="diary relative h-screen w-full overflow-hidden">
            <HeroSky />

            <div className="diary-head">
                {/* Hovering glitches it: blue copies of the sticker sit over the
                    real one and only show on hover (see .glitch in tidal-hero.css). */}
                <motion.h1 className="diary-title" {...rise(0.25)}>
                    <span className="sr-only">tidalBYTE &apos;26</span>
                    <span className="glitch">
                        <span className="glitch__base">
                            <StickerTitle />
                        </span>
                        <span aria-hidden="true" className="glitch__layer glitch__layer--ghost">
                            <StickerTitle />
                        </span>
                        <span aria-hidden="true" className="glitch__layer glitch__layer--tear">
                            <StickerTitle />
                        </span>
                    </span>
                </motion.h1>

                <motion.div className="diary-cta" {...rise(0.4)}>
                    {REGISTER_LIVE ? (
                        <a
                            href={EVENT.registerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="diary-register"
                        >
                            REGISTER <span aria-hidden="true">→</span>
                        </a>
                    ) : (
                        <span
                            className="diary-register diary-register--soon"
                            aria-disabled="true"
                            title="Registration opens soon"
                        >
                            REGISTER
                            <span className="diary-register__tag" aria-hidden="true">
                                soon!
                            </span>
                            <span className="sr-only">(registration opens soon)</span>
                        </span>
                    )}
                </motion.div>
            </div>

            <Polaroids shouldAnimate={shouldAnimate} />

            <div className="diary-street" aria-hidden="true">
                <div className="diary-street__curb" />
                <div className="diary-street__walk" />
                <div className="diary-street__road" />
            </div>

            <motion.p className="diary-tagline" {...rise(0.7)}>
                {TAGLINE}
            </motion.p>
        </div>
    );
};

export default Hero;
