import { motion } from "framer-motion";

const day1Schedule = [
    { time: "9:00 AM", event: "Check In" },
    { time: "11:00 AM", event: "Opening Ceremony" },
    { time: "12:00 PM", event: "Start Hacking!" },
    { time: "12:30 PM", event: "Lunch" },
    { time: "2:00 PM", event: "Workshop #1" },
    { time: "4:00 PM", event: "Workshop #2" },
    { time: "6:00 PM", event: "Dinner" },
    { time: "9:00 PM", event: "Late Night Snacks" },
];

const day2Schedule = [
    { time: "8:00 AM", event: "Breakfast" },
    { time: "12:00 PM", event: "Hacking Ends!" },
    { time: "12:30 PM", event: "Lunch" },
    { time: "1:00 PM", event: "Judging" },
    { time: "3:00 PM", event: "Judging Ends" },
    { time: "3:30 PM", event: "Closing Ceremony" },
];

interface ScheduleItemProps {
    time: string;
    event: string;
    index: number;
    side: "left" | "right";
}

const ScheduleItem = ({ time, event, index, side }: ScheduleItemProps) => (
    <motion.div
        className={`flex items-center gap-3 md:gap-4 py-2 md:py-3 px-3 md:px-4 ${
            side === "right" ? "flex-row-reverse text-right" : ""
        }`}
        initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        viewport={{ once: true }}
    >
        <span className="font-pixel text-[8px] md:text-[10px] text-y2k-pink whitespace-nowrap min-w-[70px] md:min-w-[90px]">
            {time}
        </span>
        <span className="w-2 h-2 rounded-full bg-y2k-gold flex-shrink-0 shadow-[0_0_6px_#FFD700]" />
        <span className="font-vt323 text-base md:text-lg lg:text-xl text-white/90 whitespace-nowrap">
            {event}
        </span>
    </motion.div>
);

const NotebookPage = ({
    dayLabel,
    schedule,
    side,
}: {
    dayLabel: string;
    schedule: { time: string; event: string }[];
    side: "left" | "right";
}) => (
    <motion.div
        className="relative flex-1 min-w-[280px] max-w-[500px]"
        initial={{ opacity: 0, y: 30, rotateY: side === "left" ? 5 : -5 }}
        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-80px" }}
    >
        <div
            className="relative rounded-lg p-5 md:p-8"
            style={{
                background:
                    "linear-gradient(135deg, rgba(20,20,60,0.9) 0%, rgba(15,15,45,0.95) 100%)",
                border: "1px solid rgba(0, 191, 255, 0.15)",
                boxShadow:
                    "0 0 30px rgba(0, 191, 255, 0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
        >
            {/* Notebook lines */}
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                {[...Array(16)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-full h-px bg-y2k-blue/5"
                        style={{ top: `${(i + 1) * 6}%` }}
                    />
                ))}
                {/* Margin line */}
                <div
                    className="absolute top-0 bottom-0 w-px bg-y2k-pink/15"
                    style={{ left: "35px" }}
                />
            </div>

            {/* Spiral binding dots */}
            <div
                className={`absolute top-0 bottom-0 flex flex-col justify-center gap-4 ${
                    side === "left" ? "-right-3" : "-left-3"
                }`}
            >
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-y2k-blue/30 border border-y2k-blue/40"
                    />
                ))}
            </div>

            <motion.h3
                className="font-pixel text-sm md:text-base text-y2k-blue glow-text-blue mb-6 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                {dayLabel}
            </motion.h3>

            <div className="relative z-10 space-y-0">
                {schedule.map((item, index) => (
                    <ScheduleItem
                        key={index}
                        time={item.time}
                        event={item.event}
                        index={index}
                        side={side}
                    />
                ))}
            </div>
        </div>
    </motion.div>
);

const Schedule = () => {
    return (
        <section
            id="schedule"
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
                Schedule
            </motion.h2>

            {/* Open notebook layout */}
            <div className="max-w-5xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-stretch justify-center">
                    <NotebookPage
                        dayLabel="DAY 1"
                        schedule={day1Schedule}
                        side="left"
                    />

                    {/* Center spine / binding */}
                    <div className="hidden lg:flex flex-col items-center justify-center px-2">
                        <div className="w-1 h-full bg-gradient-to-b from-y2k-blue/20 via-y2k-blue/40 to-y2k-blue/20 rounded-full" />
                    </div>

                    <NotebookPage
                        dayLabel="DAY 2"
                        schedule={day2Schedule}
                        side="right"
                    />
                </div>

                {/* Pen decoration */}
                <motion.div
                    className="flex justify-end mt-6 pr-4"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-1">
                        <div className="w-24 md:w-32 h-2 rounded-full bg-gradient-to-r from-y2k-blue to-y2k-purple" />
                        <div className="w-3 h-3 rounded-full bg-y2k-gold shadow-[0_0_8px_#FFD700]" />
                    </div>
                </motion.div>
            </div>

            {/* Penguin at bottom */}
            <motion.div
                className="absolute bottom-8 left-8 text-3xl md:text-4xl"
                animate={{ y: [0, -6, 0] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                🐧
            </motion.div>
        </section>
    );
};

export default Schedule;
