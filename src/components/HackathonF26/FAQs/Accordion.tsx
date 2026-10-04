import { ReactNode, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export interface FAQItem {
    id: string;
    question: string;
    answer: ReactNode;
}

interface AccordionProps {
    details: FAQItem[];
}

const AccordionItem = ({
    item,
    index,
    isOpen,
    onToggle,
}: {
    item: FAQItem;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) => {
    const reduce = useReducedMotion();
    const panelId = `faq-${item.id}`;
    const buttonId = `${panelId}-q`;

    return (
        <li className={`faq-row ${isOpen ? "is-open" : ""}`}>
            <h3>
                <button
                    id={buttonId}
                    type="button"
                    className="faq-row__btn"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={onToggle}
                >
                    <span className="faq-row__no">{String(index + 1).padStart(2, "0")}</span>
                    <span className="faq-row__q">{item.question}</span>
                    <span className="faq-row__icon" aria-hidden="true" />
                </button>
            </h3>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="answer"
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="faq-row__a">{item.answer}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    );
};

export default function Accordion({ details }: AccordionProps) {
    // First answer starts open so the list reads as expandable at a glance.
    const [openId, setOpenId] = useState<string | null>(details[0]?.id ?? null);

    return (
        <ul className="faq-list">
            {details.map((item, i) => (
                <AccordionItem
                    key={item.id}
                    item={item}
                    index={i}
                    isOpen={openId === item.id}
                    onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
            ))}
        </ul>
    );
}
