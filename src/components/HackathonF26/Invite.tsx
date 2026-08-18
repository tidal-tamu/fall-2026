import { useEffect, useRef, useState } from "react";
import Sticker from "./Sticker";

/* Tilted acceptance letter with a typewriter reveal once scrolled into view. */

const PHRASE = "You are invited !!!";

const Invite = () => {
    const [typedCount, setTypedCount] = useState(0);
    const startedRef = useRef(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !startedRef.current) {
                    startedRef.current = true;
                    let i = 0;
                    const typeNext = () => {
                        if (i <= PHRASE.length) {
                            setTypedCount(i);
                            i++;
                            setTimeout(typeNext, i < 5 ? 150 : 85);
                        }
                    };
                    typeNext();
                }
            },
            { threshold: 0.5 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section id="invite" ref={sectionRef} style={{ textAlign: "center" }}>
            <Sticker tilt="-3deg" style={{ display: "inline-block" }}>
                <div className="letter">
                    <div className="acc px">— ACCEPTANCE ✦ 2026 —</div>
                    <div className="typed">
                        <span>{PHRASE.slice(0, typedCount)}</span>
                        <span className="caret" />
                    </div>
                    <p className="hand-note">
                        every builder, artist, and first-timer on campus.
                        <br />
                        no experience needed — just bring one (1) sleepy brain.
                    </p>
                    <span className="stamp">⭐</span>
                    <span className="cherry">🍒</span>
                    <img
                        className="seal cutout"
                        src="/f26/seal.webp"
                        alt="penguin in a capsule seal"
                    />
                </div>
            </Sticker>
        </section>
    );
};

export default Invite;
