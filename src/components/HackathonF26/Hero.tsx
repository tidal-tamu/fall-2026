import GachaMachine from "./GachaMachine";

const Hero = () => (
    <section id="hero" className="hero">
        <span className="sparkle" style={{ top: 90, left: "8%" }}>✦</span>
        <span className="sparkle" style={{ top: 150, right: "10%", animationDelay: "1s" }}>✧</span>
        <span className="sparkle" style={{ top: 420, left: "16%", animationDelay: ".5s", fontSize: 26 }}>✦</span>
        <span className="sparkle" style={{ bottom: 120, right: "18%", animationDelay: "1.4s" }}>✩</span>

        <div className="logo-row">
            <span className="px logo-tidal">TIDAL</span>
            <span className="logo-byte">byte</span>
        </div>
        <div className="px logo-sub">
            <b>November 21st</b> ✦ 12-hour hackathon ✦ <b>MSC 2304</b>
        </div>

        <div className="hero-stage">
            <img
                className="hero-girl cutout"
                src="/f26/hero-girl.webp"
                alt="student hugging a penguin plush"
            />
            <GachaMachine />
        </div>

        <div className="neon-wrap">
            <button
                className="neon-register"
                type="button"
                disabled
            >
                <span className="neon-shine" />▶ REGISTER NOW
            </button>
        </div>
    </section>
);

export default Hero;
