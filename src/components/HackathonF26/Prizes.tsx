import { motion } from "framer-motion";

interface PrizeCardProps {
    place: string;
    prize: string;
    emoji: string;
    color: string;
    delay: number;
    size?: "large" | "medium";
}

const PrizeCard = ({
    place,
    prize,
    emoji,
    color,
    delay,
    size = "medium",
}: PrizeCardProps) => (
    <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
    >
        {/* Carnival booth frame */}
        <div
            className={`carnival-booth rounded-lg p-4 md:p-6 ${
                size === "large"
                    ? "w-[260px] md:w-[320px]"
                    : "w-[220px] md:w-[260px]"
            }`}
        >
            {/* Prize display area */}
            <div className="relative bg-gradient-to-b from-[#12123a] to-[#0a0a25] rounded p-6 md:p-8 min-h-[140px] md:min-h-[180px] flex flex-col items-center justify-center border border-y2k-gold/10">
                {/* Crosshatch lines for carnival booth look */}
                <div className="absolute inset-0 overflow-hidden rounded pointer-events-none opacity-10">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-px bg-y2k-gold"
                            style={{
                                top: `${(i + 1) * 15}%`,
                                transform: `rotate(${45 - i * 15}deg)`,
                            }}
                        />
                    ))}
                </div>

                {/* Plushie / prize emoji */}
                <motion.span
                    className={`${size === "large" ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"} mb-3`}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: delay * 2,
                    }}
                >
                    {emoji}
                </motion.span>

                <span
                    className="font-pixel text-[8px] md:text-[10px] text-center"
                    style={{ color }}
                >
                    {place}
                </span>
            </div>

            {/* Prize label */}
            <div
                className="mt-3 text-center py-2 px-4 rounded"
                style={{
                    background: `linear-gradient(90deg, transparent, ${color}15, transparent)`,
                    borderTop: `1px solid ${color}30`,
                }}
            >
                <span
                    className="font-pixel text-[8px] md:text-[10px]"
                    style={{ color }}
                >
                    {prize}
                </span>
            </div>
        </div>
    </motion.div>
);

const Prizes = () => {
    return (
        <section
            id="prizes"
            className="relative py-20 md:py-32 overflow-hidden"
            style={{
                background:
                    "linear-gradient(to bottom, #0B0B2B 0%, #0e0e35 50%, #0B0B2B 100%)",
            }}
        >
            <motion.h2
                className="font-pixel text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center text-y2k-gold glow-text-gold mb-16 md:mb-20"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                Prizes
            </motion.h2>

            <div className="max-w-6xl mx-auto px-4 md:px-8">
                {/* 1st Place - Featured */}
                <div className="flex justify-center mb-12 md:mb-16">
                    <PrizeCard
                        place="★ 1ST PLACE ★"
                        prize="TBD"
                        emoji="🏆"
                        color="#FFD700"
                        delay={0}
                        size="large"
                    />
                </div>

                {/* 2nd and 3rd */}
                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12 md:mb-16">
                    <PrizeCard
                        place="2ND PLACE"
                        prize="TBD"
                        emoji="🥈"
                        color="#C0C0C0"
                        delay={0.15}
                    />
                    <PrizeCard
                        place="3RD PLACE"
                        prize="TBD"
                        emoji="🥉"
                        color="#CD7F32"
                        delay={0.3}
                    />
                </div>

                {/* Track prizes */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {[
                        {
                            place: "BEST DESIGN",
                            prize: "TBD",
                            emoji: "🎨",
                            color: "#FF69B4",
                        },
                        {
                            place: "BEST BEGINNER",
                            prize: "TBD",
                            emoji: "🌟",
                            color: "#00BFFF",
                        },
                        {
                            place: "BEST SOLO",
                            prize: "TBD",
                            emoji: "🎯",
                            color: "#9B59B6",
                        },
                    ].map((track, i) => (
                        <motion.div
                            key={track.place}
                            className="flex flex-col items-center gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            viewport={{ once: true }}
                        >
                            <div className="w-[180px] md:w-[200px] rounded-lg border border-y2k-gold/20 bg-gradient-to-b from-[#1a1a4e] to-[#0e0e30] p-4 md:p-6 text-center">
                                <motion.span
                                    className="text-3xl block mb-3"
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        delay: i * 0.5,
                                    }}
                                >
                                    {track.emoji}
                                </motion.span>
                                <span
                                    className="font-pixel text-[7px] md:text-[8px] block mb-2"
                                    style={{ color: track.color }}
                                >
                                    {track.place}
                                </span>
                                <span className="font-vt323 text-sm text-white/60">
                                    {track.prize}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Character looking at prizes */}
            <motion.div
                className="absolute bottom-12 right-8 md:right-16"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl md:text-4xl">🧑‍💻</span>
                    <span className="font-pixel text-[6px] text-y2k-blue/40">
                        *gazing*
                    </span>
                </div>
            </motion.div>
        </section>
    );
};

export default Prizes;
