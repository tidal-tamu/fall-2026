import SectionHeader from "../SectionHeader";
import Sticker from "../Sticker";
import Accordion, { type FAQItem } from "./Accordion";
import { EVENT, LINKS, STICKER } from "../event";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const faqDetails: FAQItem[] = [
    {
        id: "what",
        question: "What is tidalBYTE?",
        answer: `tidalBYTE is TIDAL's Fall 2026 hackathon: a student-run, ${EVENT.hours}-hour build day where students of all levels team up, learn new skills, and build a data science or AI/ML project (or anything else) to win prizes.`,
    },
    {
        id: "why",
        question: "Why should I participate?",
        answer: "It's a chance to challenge yourself, get hands-on experience with data science and AI, meet people who like building things, and win some prizes. Plus, it looks great on your resume.",
    },
    {
        id: "beginner",
        question: "I'm a beginner. Is that okay?",
        answer: "Absolutely. tidalBYTE is designed for freshmen and sophomores. We'll have intro workshops, mentors on standby, and a very welcoming room. No prior experience needed.",
    },
    {
        id: "overnight",
        question: "Is it overnight?",
        answer: `Nope. tidalBYTE is a one-day, ${EVENT.hours}-hour event on ${EVENT.day}, ${EVENT.date} in ${EVENT.room}. Doors open in the morning and we wrap up in the evening, so you get to sleep in your own bed.`,
    },
    {
        id: "bring",
        question: "What should I bring?",
        answer: "Your laptop, your charger, and anything else you need to build comfortably. A water bottle never hurts.",
    },
    {
        id: "in-person",
        question: "Do I need to be there in person?",
        answer: `Yes. tidalBYTE is in person, in ${EVENT.room}. You'll need to check in and stay through judging to be eligible for prizes.`,
    },
    {
        id: "teams",
        question: "How do teams work?",
        answer: (
            <>
                Teams can have up to 4 hackers. Tell us on the registration form whether you have
                a team or need one. We&apos;ll run team matchmaking after opening ceremony, but
                finding teammates early in our{" "}
                <a href={LINKS.discord} {...ext}>
                    Discord
                </a>{" "}
                is the move.
            </>
        ),
    },
    {
        id: "judging",
        question: "What's the judging criteria?",
        answer: "Details drop closer to the event. Expect to be judged on creativity, technical difficulty, and presentation, with a big emphasis on CREATIVITY.",
    },
    {
        id: "signup",
        question: "How do I sign up?",
        answer: EVENT.registrationOpen
            ? "Hit the REGISTER button at the top of this page and fill out the form. That's it!"
            : "Registration opens soon. When it does, the REGISTER button at the top of this page lights up. Fill out the form and you're in.",
    },
    {
        id: "more",
        question: "I have more questions!",
        answer: (
            <>
                Email us at <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a> or ask in our{" "}
                <a href={LINKS.discord} {...ext}>
                    Discord
                </a>
                .
            </>
        ),
    },
];

export default function FAQs() {
    return (
        <section id="faq" className="section bg-shade-100">
            <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
                <div className="relative lg:sticky lg:top-24">
                    <SectionHeader
                        track="06"
                        file="b-sides.faq"
                        title="faq"
                        dek="the b-sides. everything else you might want to know."
                    />

                    {/* A 1-bit desktop dialog, after the pitch's "you have
                        received a cat" reference. */}
                    <div className="dialog mt-10" role="group" aria-labelledby="pebble-dialog-title">
                        <div className="dialog__bar">
                            <span className="dialog__close" aria-hidden="true" />
                            <span id="pebble-dialog-title" className="dialog__title">
                                pebble.exe
                            </span>
                        </div>
                        <div className="dialog__body">
                            <img
                                src={STICKER("pebble-headphones")}
                                alt=""
                                aria-hidden="true"
                                className="dialog__icon"
                                loading="lazy"
                            />
                            <p>
                                You have received a question.
                                <br />
                                Ask a real human?
                            </p>
                        </div>
                        <div className="dialog__actions">
                            <a className="os-btn" href={LINKS.discord} {...ext}>
                                Discord
                            </a>
                            <a className="os-btn os-btn--default" href={`mailto:${LINKS.email}`}>
                                Email us
                            </a>
                        </div>
                    </div>

                    <Sticker
                        src={STICKER("panda")}
                        width={96}
                        rotate={-9}
                        className="absolute -bottom-32 right-6 hidden md:block"
                    />
                </div>

                <Accordion details={faqDetails} />
            </div>
        </section>
    );
}
