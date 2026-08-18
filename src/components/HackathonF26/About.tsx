import { useEffect, useRef } from "react";
import Sticker from "./Sticker";

/* Retro OS window whose LED border lights up progressively on scroll. */

const STATS = [
    { n: "300+", l: "hackers" },
    { n: "24", l: "hours" },
    { n: "$8K", l: "in prizes" },
    { n: "∞", l: "snacks" },
];

const About = () => {
    const panelRef = useRef<HTMLDivElement>(null);

    // Build the LED ring and wire it to scroll progress. LEDs are plain
    // DOM nodes updated in a scroll handler — same reasoning as CoinTrail.
    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const leds: HTMLElement[] = [];
        const mk = (left: string, top: string) => {
            const d = document.createElement("i");
            d.className = "led";
            d.style.left = left;
            d.style.top = top;
            panel.appendChild(d);
            leds.push(d);
        };
        const per = 18;
        const sides = 10;
        for (let i = 0; i < per; i++) {
            mk(`${3 + i * (94 / per)}%`, "-5px");
            mk(`${3 + i * (94 / per)}%`, "calc(100% - 4px)");
        }
        for (let i = 0; i < sides; i++) {
            mk("-5px", `${6 + i * (88 / sides)}%`);
            mk("calc(100% - 4px)", `${6 + i * (88 / sides)}%`);
        }
        const updateLeds = () => {
            const r = panel.getBoundingClientRect();
            const vh = window.innerHeight;
            const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
            const lit = Math.floor(p * leds.length);
            leds.forEach((l, i) => l.classList.toggle("lit", i < lit));
        };
        updateLeds();
        window.addEventListener("scroll", updateLeds, { passive: true });
        return () => {
            window.removeEventListener("scroll", updateLeds);
            leds.forEach((l) => l.remove());
        };
    }, []);

    return (
        <section id="about">
            <div className="sec-head">
                <div className="eyebrow px">SECTION 01 · README.TXT</div>
                <h2 className="px">WHAT IS TIDALbyte?</h2>
            </div>
            <Sticker tilt="0deg">
                <div className="win">
                    <div className="win-bar px">
                        C:\tidalbyte\about.exe
                        <span className="dots"><i>—</i><i>□</i><i>✕</i></span>
                    </div>
                    <div className="led-panel" ref={panelRef}>
                        <div className="whatis-grid">
                            <div>
                                <h2 className="px">
                                    A <em>24-hour</em> build-anything sprint for the whole school.
                                </h2>
                                <p className="hand-note">
                                    Teams of 2–4 dive into the deep end: apps, games, hardware,
                                    art-tech — anything that boots. Workshops for beginners, ramen
                                    at midnight, and a plushie gacha that only accepts coins you
                                    earn by shipping.
                                </p>
                                <div className="stat-row">
                                    {STATS.map(({ n, l }) => (
                                        <div className="stat" key={l}>
                                            <div className="n">{n}</div>
                                            <div className="l">{l}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="whatis-art">
                                <Sticker tilt="2deg">
                                    <img
                                        className="doodle"
                                        src="/f26/doodle-panda.webp"
                                        alt="dizzy panda doodle"
                                    />
                                </Sticker>
                                <span className="float-cookie">🍪</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Sticker>
            <Sticker
                tilt="-8deg"
                style={{ position: "absolute", left: "2%", bottom: -30 }}
            >
                <img
                    className="doodle"
                    src="/f26/doodle-cat.webp"
                    alt="doodle cat with tie"
                    style={{ width: 130 }}
                />
            </Sticker>
            <p className="hand-note" style={{ textAlign: "center", marginTop: 18 }}>
                ↑ the LEDs light up as you scroll ✦
            </p>
        </section>
    );
};

export default About;
