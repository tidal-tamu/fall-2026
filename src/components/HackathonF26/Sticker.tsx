import { motion, useReducedMotion } from "framer-motion";

interface StickerProps {
    src: string;
    width: number;
    rotate?: number;
    delay?: number;
    className?: string;
    alt?: string;
}

/* A grayscale die-cut sticker (the white border is baked into the asset) that
   slaps onto the page the first time it scrolls into view. Decorative by
   default, so it stays out of the accessibility tree and never eats clicks. */
const Sticker = ({ src, width, rotate = 0, delay = 0, className = "", alt = "" }: StickerProps) => {
    const reduce = useReducedMotion();

    return (
        <motion.img
            src={src}
            alt={alt}
            aria-hidden={alt ? undefined : true}
            width={width}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`sticker pointer-events-none select-none ${className}`}
            // a CSS var rather than a fixed width, so callers can resize per
            // breakpoint with e.g. `md:[--sticker-w:150px]`
            style={{ width: `var(--sticker-w, ${width}px)`, height: "auto" }}
            initial={reduce ? { rotate } : { opacity: 0, scale: 1.4, rotate: rotate - 14 }}
            whileInView={{ opacity: 1, scale: 1, rotate }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ type: "spring", stiffness: 380, damping: 17, delay }}
        />
    );
};

export default Sticker;
