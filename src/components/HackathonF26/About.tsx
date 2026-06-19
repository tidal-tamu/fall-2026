import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const About = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    const [typedText, setTypedText] = useState("");
    const fullText = "You are invited !!";
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        if (!isInView) return;

        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setTypedText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [isInView]);

    useEffect(() => {
        const cursorTimer = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 530);
        return () => clearInterval(cursorTimer);
    }, []);

    const ledCount = 20;
    const [litLeds, setLitLeds] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let count = 0;
        const timer = setInterval(() => {
            if (count < ledCount) {
                count++;
                setLitLeds(count);
            } else {
                clearInterval(timer);
            }
        }, 80);
        return () => clearInterval(timer);
    }, [isInView]);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative w-full py-24 md:py-32 overflow-hidden"
            style={{
                background:
                    "linear-gradient(to bottom, #0B0B2B 0%, #0e0e35 50%, #0B0B2B 100%)",
            }}
        >
            {/* LED dot trail */}
            <div className="flex justify-center gap-2 md:gap-3 mb-16">
                {[...Array(ledCount)].map((_, i) => (
                    <div
                        key={i}
                        className={`led-dot ${i >= litLeds ? "dimmed" : ""}`}
                        style={{ transitionDelay: `${i * 50}ms` }}
                    />
                ))}
            </div>

            {/* Invitation message */}
            <div className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
                <motion.p
                    className="font-vt323 text-lg md:text-xl text-y2k-blue/70 mb-4"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    if you've received it...
                </motion.p>

                <div className="flex items-center gap-4">
                    <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl lg:text-4xl text-y2k-pink glow-text-pink">
                        {typedText}
                        <span
                            className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}
                        >
                            _
                        </span>
                    </h2>
                </div>

                {/* Acceptance phone mockup */}
                <motion.div
                    className="mt-10 flex justify-center md:justify-end"
                    initial={{ opacity: 0, x: 50, rotate: 5 }}
                    animate={
                        isInView
                            ? { opacity: 1, x: 0, rotate: 3 }
                            : { opacity: 0, x: 50, rotate: 5 }
                    }
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className="relative w-[180px] md:w-[220px] rounded-2xl border-2 border-y2k-purple/40 bg-gradient-to-b from-[#1a1a4e] to-[#12123a] p-4 shadow-[0_0_30px_rgba(155,89,182,0.2)]">
                        <div className="text-center">
                            <span className="font-pixel text-[8px] text-y2k-gold block mb-3">
                                ★ ACCEPTANCE ★
                            </span>
                            <div className="w-full h-px bg-y2k-purple/30 mb-3" />
                            <span className="font-vt323 text-sm text-white/80">
                                tidalBYTE
                            </span>
                            <br />
                            <span className="font-vt323 text-xs text-y2k-blue/60">
                                Fall 2026
                            </span>
                        </div>

                        {/* Decorative stars */}
                        <motion.span
                            className="absolute -top-3 -right-3 text-y2k-pink text-lg"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            ✦
                        </motion.span>
                        <motion.span
                            className="absolute -bottom-2 -left-2 text-y2k-gold text-sm"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.6, 1, 0.6],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ★
                        </motion.span>
                    </div>
                </motion.div>
            </div>

            {/* Plushie collectibles along the side */}
            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6">
                {["🐰", "🐧", "❓"].map((emoji, i) => (
                    <motion.div
                        key={i}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-y2k-navy border border-y2k-gold/20 flex items-center justify-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: 20 }
                        }
                        transition={{ delay: 1 + i * 0.3, duration: 0.5 }}
                    >
                        <span className="text-lg">{emoji}</span>
                    </motion.div>
                ))}
            </div>

            {/* What is tidalBYTE section */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 mt-8">
                <motion.h2
                    className="font-pixel text-xl sm:text-2xl md:text-3xl text-y2k-gold glow-text-gold text-center mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    What is tidalBYTE ?
                </motion.h2>

                {/* CRT terminal display */}
                <motion.div
                    className="relative mt-8 mx-auto max-w-3xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="crt-overlay crt-glow rounded-lg bg-gradient-to-b from-[#0a0a25] to-[#060618] p-6 md:p-10">
                        <div className="space-y-4">
                            <p className="font-vt323 text-lg md:text-xl lg:text-2xl text-green-400/90 leading-relaxed">
                                &gt; tidalBYTE is TIDAL's{" "}
                                <span className="text-y2k-pink font-bold">
                                    24-hour hackathon
                                </span>{" "}
                                at Texas A&M, built for{" "}
                                <span className="text-y2k-blue font-bold">
                                    freshmen and sophomores
                                </span>{" "}
                                to dive into data science & AI/ML.
                            </p>
                            <p className="font-vt323 text-lg md:text-xl lg:text-2xl text-green-400/90 leading-relaxed">
                                &gt; Free food, mentorship, workshops, and a
                                chance to win amazing prizes. No experience
                                needed — just bring your{" "}
                                <span className="text-y2k-gold font-bold">
                                    curiosity
                                </span>{" "}
                                and{" "}
                                <span className="text-y2k-gold font-bold">
                                    laptop
                                </span>
                                .
                            </p>
                            <p className="font-vt323 text-base md:text-lg text-green-400/50 mt-4">
                                &gt; <span className="animate-blink">_</span>
                            </p>
                        </div>
                    </div>

                    {/* Floating penguin near CRT */}
                    <motion.div
                        className="absolute -right-4 md:-right-8 -bottom-6 md:-bottom-8 text-4xl md:text-5xl"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        🐧
                    </motion.div>
                </motion.div>

                {/* LED dots below CRT that light up */}
                <motion.div
                    className="flex justify-center gap-2 mt-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="led-dot"
                            initial={{ opacity: 0.15 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default About;
