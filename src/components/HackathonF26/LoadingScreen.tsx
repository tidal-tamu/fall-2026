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
            className="loading-screen fixed inset-0 z-[9999] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="loading-screen__frame pointer-events-none absolute inset-3 md:inset-5" aria-hidden="true" />

            <div className="relative z-10 text-center px-6 w-full max-w-[320px]">
                <div className="loading-screen__title font-pixel text-lg md:text-xl mb-1">
                    tidalBYTE
                </div>
                <div className="loading-screen__season label mb-10">FALL 2026</div>

                <div className="loading-screen__meter p-[3px]">
                    <div
                        className="loading-screen__fill h-3 transition-[width] duration-200 ease-linear"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className="loading-screen__label label">LOADING</span>
                    <span className="loading-screen__value label tabular-nums">
                        {String(pct).padStart(3, "0")}%
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
