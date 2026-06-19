import { motion } from "framer-motion";

type Sponsor = {
    id: number;
    name: string;
    logo: string | null;
    tier: "gold" | "silver" | "bronze";
};

const sponsors: Sponsor[] = [
    // Placeholder sponsors - replace with actual sponsors when confirmed
    { id: 1, name: "Sponsor 1", logo: null, tier: "gold" },
    { id: 2, name: "Sponsor 2", logo: null, tier: "silver" },
    { id: 3, name: "Sponsor 3", logo: null, tier: "silver" },
    { id: 4, name: "Sponsor 4", logo: null, tier: "bronze" },
    { id: 5, name: "Sponsor 5", logo: null, tier: "bronze" },
    { id: 6, name: "Sponsor 6", logo: null, tier: "bronze" },
];

const TVMonitor = ({
    sponsor,
    index,
}: {
    sponsor: Sponsor;
    index: number;
}) => (
    <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 6 - 3 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
    >
        <motion.div
            animate={{
                rotate: [0, 1, -0.5, 0.5, 0],
                y: [0, -3, 1, -2, 0],
            }}
            transition={{
                duration: 6 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
            }}
        >
            {/* CRT TV frame */}
            <div
                className="relative w-[140px] h-[120px] md:w-[180px] md:h-[150px] rounded-lg"
                style={{
                    background:
                        "linear-gradient(145deg, #2a2a4e 0%, #1a1a3e 50%, #12123a 100%)",
                    border: "3px solid #3a3a5e",
                    boxShadow:
                        "0 0 20px rgba(0, 191, 255, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.5), 4px 4px 0 #0a0a20",
                }}
            >
                {/* Screen */}
                <div className="absolute inset-2 md:inset-3 rounded bg-gradient-to-b from-[#0a0a25] to-[#060618] overflow-hidden crt-overlay">
                    <div className="w-full h-full flex items-center justify-center p-3">
                        {sponsor.logo ? (
                            <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                className="max-w-full max-h-full object-contain"
                                loading="lazy"
                            />
                        ) : (
                            <span className="font-pixel text-[7px] md:text-[8px] text-y2k-blue/60 text-center leading-relaxed">
                                {sponsor.name}
                            </span>
                        )}
                    </div>

                    {/* Screen glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-y2k-blue/5 pointer-events-none" />
                </div>

                {/* Power LED */}
                <div className="absolute bottom-1 right-2 md:bottom-1.5 md:right-3">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-green-500"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.4,
                        }}
                        style={{ boxShadow: "0 0 4px #22c55e" }}
                    />
                </div>

                {/* TV antenna nubs */}
                <div className="absolute -top-2 left-4 w-1 h-3 bg-[#3a3a5e] rounded-t" />
                <div className="absolute -top-3 left-8 w-1 h-4 bg-[#3a3a5e] rounded-t" />
            </div>
        </motion.div>
    </motion.div>
);

const Sponsors = () => {
    return (
        <section
            id="sponsors"
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
                Sponsors
            </motion.h2>

            <div className="max-w-5xl mx-auto px-4 md:px-8">
                {/* TV grid layout */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
                    {sponsors.map((sponsor, index) => (
                        <TVMonitor
                            key={sponsor.id}
                            sponsor={sponsor}
                            index={index}
                        />
                    ))}
                </div>

                {/* Interested in sponsoring */}
                <motion.div
                    className="mt-16 md:mt-20 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <p className="font-vt323 text-lg md:text-xl text-white/60 mb-4">
                        Interested in sponsoring tidalBYTE?
                    </p>
                    <a
                        href="mailto:tidaltamu@gmail.com"
                        className="font-pixel text-[8px] md:text-[10px] text-y2k-pink hover:text-white transition-colors border border-y2k-pink/40 hover:border-y2k-pink px-4 py-2 inline-block"
                    >
                        CONTACT US →
                    </a>
                </motion.div>
            </div>

            {/* Decorative static TV in corner */}
            <div className="absolute bottom-4 left-4 opacity-20">
                <span className="text-4xl">📺</span>
            </div>
        </section>
    );
};

export default Sponsors;
