import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15 + 5;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    const pct = Math.min(Math.round(progress), 100);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-paper text-ink"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="pointer-events-none absolute inset-3 md:inset-5 border border-rule" />

            <div className="relative z-10 text-center px-6 w-full max-w-[320px]">
                <div className="font-pixel text-lg md:text-xl mb-1">
                    tidalBYTE
                </div>
                <div className="label text-mid mb-10">FALL 2026</div>

                {/* Chunky stepped bar — the pixel-era progress meter, in ink. */}
                <div className="border border-ink p-[3px]">
                    <div
                        className="h-3 transition-[width] duration-200 ease-linear"
                        style={{
                            width: `${Math.min(progress, 100)}%`,
                            background:
                                "repeating-linear-gradient(90deg,#111110 0px,#111110 5px,#ffffff 5px,#ffffff 8px)",
                        }}
                    />
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className="label text-dim">LOADING</span>
                    <span className="label text-ink tabular-nums">
                        {String(pct).padStart(3, "0")}%
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
