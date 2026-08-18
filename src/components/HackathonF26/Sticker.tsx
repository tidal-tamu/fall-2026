import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

/* Slap-on entrance: elements start shrunken/rotated and "slap" onto the
   page when scrolled into view (see .sticker/.stuck in tidal-effects.css).
   The rotation target comes from the --tilt custom property so the CSS
   keyframes can compose it. */

interface StickerProps {
    tilt?: string; // e.g. "-3deg"
    delay?: number; // ms before the slap fires once visible
    /** keep bobbing after the slap lands (composes via the translate property) */
    float?: boolean;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}

const Sticker = ({
    tilt = "0deg",
    delay = 0,
    float = false,
    className = "",
    style,
    children,
}: StickerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setStuck(true), delay);
                    obs.disconnect();
                }
            },
            { threshold: 0.25 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [delay]);

    const floatStyle: CSSProperties =
        float && stuck
            ? {
                  animation:
                      "slap .62s cubic-bezier(.26,1.45,.42,1) forwards, stickerFloat 5s ease-in-out 1.5s infinite",
              }
            : {};

    return (
        <div
            ref={ref}
            className={`sticker ${stuck ? "stuck" : ""} ${className}`}
            style={{ "--tilt": tilt, ...style, ...floatStyle } as CSSProperties}
        >
            {children}
        </div>
    );
};

export default Sticker;
