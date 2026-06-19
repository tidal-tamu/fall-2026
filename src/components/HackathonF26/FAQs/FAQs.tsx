import { motion } from "framer-motion";
import Accordion from "./Accordion";

const discordLink = "https://tinyurl.com/tidaltamudiscord";

const faqDetails = [
    {
        id: "1",
        question: "> What is tidalBYTE?",
        answer: "tidalBYTE is TIDAL's Fall 2026 hackathon — a student-led data science & AI/ML competition where students of all levels build projects to win prizes and learn new skills!",
    },
    {
        id: "2",
        question: "> Why should I participate?",
        answer: "It's a chance to challenge yourself, gain hands-on experience with data science and AI, meet like-minded people, and score some awesome prizes. Plus, it looks great on your resume!",
    },
    {
        id: "3",
        question: "> I'm a beginner — is that okay?",
        answer: "Absolutely! tidalBYTE is designed for freshmen and sophomores. We'll have introductory workshops, mentors on standby, and a super welcoming environment. No prior experience needed.",
    },
    {
        id: "4",
        question: "> What should I bring?",
        answer: "Your laptop, charger, and anything you need to hack comfortably. If you're staying overnight, a blanket and pillow help. Most importantly — don't forget deodorant.",
    },
    {
        id: "5",
        question: "> Do I need to be there in person?",
        answer: "Yes! tidalBYTE is an in-person event. You'll need to check in and be present throughout the hackathon to participate and be eligible for prizes.",
    },
    {
        id: "6",
        question: "> How do teams work?",
        answer: "Teams can have up to 4 hackers. You can specify on the registration form if you have a team or need one. We'll have team matchmaking during opening ceremony, but we recommend finding teammates beforehand through our Discord!",
    },
    {
        id: "7",
        question: "> What's the judging criteria?",
        answer: "Details will be released closer to the event. Expect to be judged on creativity, technical difficulty, and presentation — with a big emphasis on CREATIVITY!",
    },
    {
        id: "8",
        question: "> How do I sign up?",
        answer: "Hit the REGISTER button at the top of this page and fill out the form. That's it!",
    },
    {
        id: "9",
        question: "> Can I stay overnight?",
        answer: "Yes! tidalBYTE is a full 24-hour event. Keep in mind building access restrictions — if you leave after closing time, you may not be able to re-enter until the next morning.",
    },
    {
        id: "10",
        question: "> I have more questions!",
        answer: (
            <>
                Reach out to us at{" "}
                <a
                    href="mailto:tidaltamu@gmail.com"
                    className="text-y2k-pink hover:text-white underline transition-colors"
                >
                    tidaltamu@gmail.com
                </a>{" "}
                or ask in our{" "}
                <a
                    href={discordLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-y2k-pink hover:text-white underline transition-colors"
                >
                    Discord
                </a>
                !
            </>
        ),
    },
];

export default function FAQs() {
    return (
        <section
            id="faq"
            className="relative w-full py-20 md:py-32 overflow-hidden"
            style={{
                background:
                    "linear-gradient(to bottom, #0B0B2B 0%, #0e0e35 100%)",
            }}
        >
            <motion.h2
                className="font-pixel text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center text-y2k-gold glow-text-gold mb-12 md:mb-16"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                FAQ
            </motion.h2>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    {/* FAQ Accordion in CRT-style container */}
                    <motion.div
                        className="w-full lg:flex-1"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="crt-glow rounded-lg bg-gradient-to-b from-[#0a0a25] to-[#060618] p-4 md:p-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-y2k-blue/20">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="font-pixel text-[6px] text-y2k-blue/40 ml-2">
                                    faq.exe
                                </span>
                            </div>
                            <Accordion details={faqDetails} />
                        </div>
                    </motion.div>

                    {/* Decorative side */}
                    <motion.div
                        className="hidden lg:flex flex-col items-center gap-6 pt-12"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <motion.span
                            className="text-5xl"
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            🐧
                        </motion.span>
                        <motion.span
                            className="text-3xl"
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: 0.5,
                            }}
                        >
                            🐰
                        </motion.span>
                        <span className="font-pixel text-[6px] text-y2k-pink/40 rotate-12">
                            *curious*
                        </span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
