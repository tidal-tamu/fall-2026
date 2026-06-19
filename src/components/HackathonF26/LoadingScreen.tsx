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

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-y2k-darkNavy"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            {/* Floating pixel stars */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-y2k-gold rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 1.5 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 text-center px-6">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        duration: 0.8,
                        type: "spring",
                        bounce: 0.5,
                    }}
                    className="mb-8"
                >
                    <span className="text-6xl">🐧</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="font-pixel text-xl md:text-2xl text-y2k-pink mb-2 glow-text-pink">
                        TIDAL
                    </h1>
                    <p className="font-pixel text-xs md:text-sm text-y2k-blue glow-text-blue">
                        byte
                    </p>
                </motion.div>

                {/* Retro progress bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-64 mx-auto"
                >
                    <div className="border-2 border-y2k-gold p-1 bg-y2k-darkNavy">
                        <div
                            className="h-3 transition-all duration-200"
                            style={{
                                width: `${Math.min(progress, 100)}%`,
                                background:
                                    "repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 6px, #0B0B2B 6px, #0B0B2B 8px)",
                            }}
                        />
                    </div>
                    <p className="font-pixel text-[8px] text-y2k-gold mt-2">
                        LOADING... {Math.min(Math.round(progress), 100)}%
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
