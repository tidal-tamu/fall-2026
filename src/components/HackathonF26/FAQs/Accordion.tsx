import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    id: string;
    question: string;
    answer: string | React.ReactNode;
}

interface AccordionProps {
    details: FAQItem[];
}

const AccordionItem = ({
    item,
    isOpen,
    onToggle,
}: {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
}) => (
    <div className="border-b border-y2k-blue/10 last:border-b-0">
        <button
            className="w-full flex items-center justify-between py-4 px-3 text-left group"
            onClick={onToggle}
        >
            <span className="font-vt323 text-base md:text-lg text-white/90 group-hover:text-y2k-pink transition-colors pr-4">
                {item.question}
            </span>
            <motion.span
                className="font-pixel text-xs text-y2k-pink flex-shrink-0"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
            >
                +
            </motion.span>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="px-3 pb-4">
                        <div className="font-vt323 text-sm md:text-base text-white/60 leading-relaxed pl-2 border-l-2 border-y2k-gold/30">
                            {item.answer}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default function Accordion({ details }: AccordionProps) {
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <div>
            {details.map((item) => (
                <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() =>
                        setOpenId(openId === item.id ? null : item.id)
                    }
                />
            ))}
        </div>
    );
}
