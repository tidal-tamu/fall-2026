import type { CSSProperties } from "react";
import { cn } from "./ui";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
const loadingBackground: CSSProperties = {
    "backgroundImage": "linear-gradient(rgba(38, 44, 50, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(38, 44, 50, 0.12) 1px, transparent 1px), linear-gradient(180deg, #b5c2cd, #dde5eb)",
    "backgroundSize": "80px 80px, 80px 80px, auto"
};

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
            className={cn(
                "loading-screen fixed inset-0 z-[9999] flex items-center justify-center text-[#262c32]",
                "bg-[#b5c2cd]",
            )} style={loadingBackground}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className={cn(
                "loading-screen__frame pointer-events-none absolute inset-3 md:inset-5 border-[1px] border-solid",
                "border-[#46525d] opacity-50",
            )} aria-hidden="true" />

            <div className="relative z-10 text-center px-6 w-full max-w-[320px]">
                <div className="loading-screen__title font-pixel text-lg md:text-xl mb-1 text-[#262c32]">
                    tidalBYTE
                </div>
                <div className={cn(
                    "loading-screen__season label mb-10 font-mono uppercase tracking-[0.22em] text-[11px]",
                    "text-[#46525d]",
                )}>FALL 2026</div>

                <div className={cn(
                    "loading-screen__meter p-[3px] border-2 border-solid border-[#262c32] bg-[#f5f8fa]",
                    "shadow-[4px_4px_0_#94aec4]",
                )}>
                    <div
                        className={cn(
                            "loading-screen__fill h-3 transition-[width] duration-200 ease-linear",
                            "bg-[repeating-linear-gradient(90deg,_#5b8fc4_0_6px,_#e6eef5_6px_8px)]",
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className="loading-screen__label label font-mono uppercase tracking-[0.22em] text-[11px] text-[#46525d]">LOADING</span>
                    <span className={cn(
                        "loading-screen__value label tabular-nums font-mono uppercase tracking-[0.22em] text-[11px]",
                        "text-[#262c32]",
                    )}>
                        {String(pct).padStart(3, "0")}%
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
