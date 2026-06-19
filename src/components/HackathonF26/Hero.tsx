import { useRef } from "react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

interface HeroProps {
    shouldAnimate?: boolean;
    registerUrl: string;
}

const Star = ({
    x,
    y,
    delay,
    size = 4,
}: {
    x: string;
    y: string;
    delay: number;
    size?: number;
}) => (
    <motion.div
        className="absolute rounded-full bg-y2k-gold"
        style={{ left: x, top: y, width: size, height: size }}
        animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.3, 0.8],
        }}
        transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay,
        }}
    />
);

const Hero = ({ shouldAnimate = false, registerUrl }: HeroProps) => {
    const heroRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center px-6 md:px-12 select-none overflow-hidden"
            style={{
                background:
                    "radial-gradient(ellipse at 50% 30%, #1a1a4e 0%, #0B0B2B 60%, #060618 100%)",
            }}
        >
            {/* Twinkling stars background */}
            <div className="absolute inset-0">
                {[
                    { x: "10%", y: "15%", d: 0 },
                    { x: "25%", y: "8%", d: 0.5 },
                    { x: "45%", y: "5%", d: 1 },
                    { x: "70%", y: "12%", d: 1.5 },
                    { x: "85%", y: "20%", d: 0.3 },
                    { x: "15%", y: "40%", d: 0.8 },
                    { x: "90%", y: "35%", d: 1.2 },
                    { x: "5%", y: "60%", d: 0.6 },
                    { x: "35%", y: "70%", d: 1.8 },
                    { x: "60%", y: "75%", d: 0.4 },
                    { x: "80%", y: "65%", d: 1.1 },
                    { x: "50%", y: "90%", d: 0.9 },
                    { x: "20%", y: "85%", d: 1.4 },
                    { x: "95%", y: "50%", d: 0.2 },
                    { x: "40%", y: "30%", d: 1.7 },
                    { x: "75%", y: "45%", d: 0.7 },
                ].map((star, i) => (
                    <Star
                        key={i}
                        x={star.x}
                        y={star.y}
                        delay={star.d}
                        size={Math.random() > 0.5 ? 3 : 2}
                    />
                ))}
            </div>

            {/* Sparkle decorations */}
            <motion.div
                className="absolute top-[15%] left-[8%] text-y2k-gold text-3xl md:text-4xl"
                animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                ✦
            </motion.div>
            <motion.div
                className="absolute top-[25%] right-[10%] text-y2k-pink text-2xl"
                animate={{
                    rotate: [0, -20, 20, 0],
                    scale: [0.8, 1.3, 0.8],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
                ✦
            </motion.div>

            {/* MLH Badge */}
            <a
                href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
                className="hidden lg:block max-w-[80px] min-w-[50px] absolute top-0 right-[20px] w-[8%] z-30 hover:scale-105 transition-transform duration-200"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-white.svg"
                    alt="Major League Hacking 2026 Hackathon Season"
                    decoding="async"
                />
            </a>

            {/* Main hero content */}
            <div className="text-center z-20 max-w-5xl mx-auto flex flex-col items-center gap-6 md:gap-8">
                {/* Info pills */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2 sm:gap-3"
                    initial={{ y: 30, opacity: 0 }}
                    animate={
                        shouldAnimate
                            ? { y: 0, opacity: 1 }
                            : { y: 30, opacity: 0 }
                    }
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                >
                    {["MSC Bethancourt", "24 Hours", "Fall 2026"].map(
                        (text) => (
                            <div
                                key={text}
                                className="border border-y2k-pink/40 bg-y2k-pink/10 px-3 py-1 rounded-full backdrop-blur-sm"
                            >
                                <span className="font-vt323 text-sm md:text-base text-y2k-pink">
                                    {text}
                                </span>
                            </div>
                        ),
                    )}
                </motion.div>

                {/* Title */}
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ y: 40, opacity: 0 }}
                    animate={
                        shouldAnimate
                            ? { y: 0, opacity: 1 }
                            : { y: 40, opacity: 0 }
                    }
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.6 }}
                >
                    <h1 className="font-pixel text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white glow-text-pink leading-tight">
                        TIDAL
                    </h1>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-pixel text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-y2k-blue glow-text-blue">
                            byte
                        </span>
                        <span className="font-pixel text-lg sm:text-xl md:text-2xl text-y2k-gold glow-text-gold">
                            '26
                        </span>
                    </div>
                </motion.div>

                {/* Claw machine / Register area */}
                <motion.div
                    className="relative mt-4"
                    initial={{ y: 50, opacity: 0 }}
                    animate={
                        shouldAnimate
                            ? { y: 0, opacity: 1 }
                            : { y: 50, opacity: 0 }
                    }
                    transition={{ duration: 1.5, ease: "easeOut", delay: 1.0 }}
                >
                    {/* Claw machine frame */}
                    <div className="relative mx-auto w-[280px] sm:w-[320px] md:w-[380px]">
                        <div className="crt-glow rounded-lg bg-gradient-to-b from-[#1a1a4e] to-[#0e0e30] p-4 md:p-6">
                            {/* Machine top label */}
                            <div className="text-center mb-3">
                                <span className="font-pixel text-[8px] md:text-[10px] text-y2k-gold bg-y2k-gold/10 px-3 py-1 border border-y2k-gold/30">
                                    ★ VIP ★
                                </span>
                            </div>

                            {/* Machine screen area with cute elements */}
                            <div className="relative bg-gradient-to-b from-[#1e1e5e] to-[#12123a] rounded border border-y2k-blue/20 p-4 md:p-6 min-h-[120px] md:min-h-[150px] flex flex-col items-center justify-center crt-overlay">
                                {/* Floating plushie balls */}
                                <div className="flex gap-2 mb-3 opacity-60">
                                    {["🔵", "🟣", "⚪", "🔵", "🟣"].map(
                                        (ball, i) => (
                                            <motion.span
                                                key={i}
                                                className="text-lg md:text-xl"
                                                animate={{
                                                    y: [0, -4, 0],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: i * 0.2,
                                                }}
                                            >
                                                {ball}
                                            </motion.span>
                                        ),
                                    )}
                                </div>

                                <a
                                    href={registerUrl}
                                    className="y2k-button font-pixel text-[10px] md:text-xs px-6 py-3 flex items-center gap-2"
                                >
                                    REGISTER
                                    <FaPlay className="w-2 h-2" />
                                </a>
                            </div>

                            {/* Machine controls */}
                            <div className="flex justify-between items-center mt-3 px-2">
                                <span className="font-pixel text-[6px] text-gray-500">
                                    REFRESH (10)
                                </span>
                                <span className="font-pixel text-[6px] text-gray-500">
                                    ◀ PLAY (1)
                                </span>
                            </div>
                        </div>

                        {/* Penguin mascot */}
                        <motion.div
                            className="absolute -right-12 md:-right-16 top-0 text-4xl md:text-5xl"
                            animate={{
                                y: [0, -8, 0],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            🐧
                        </motion.div>

                        {/* Music note */}
                        <motion.div
                            className="absolute -right-6 md:-right-8 top-[-20px] text-lg text-y2k-blue"
                            animate={{
                                opacity: [0, 1, 0],
                                y: [0, -15, -30],
                                x: [0, 5, 10],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: 1,
                            }}
                        >
                            ♪
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={
                        shouldAnimate ? { opacity: 1 } : { opacity: 0 }
                    }
                    transition={{ delay: 2, duration: 1 }}
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <span className="font-pixel text-[8px] text-y2k-gold/60">
                            ▼ SCROLL ▼
                        </span>
                    </motion.div>
                </motion.div>
            </div>

            {/* LED dot trail at bottom */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="led-dot"
                        animate={{
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
