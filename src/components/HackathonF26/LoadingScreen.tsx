import { motion } from "framer-motion";

/* Intro overlay: pixel GIF on a deep-indigo field, click anywhere to skip.
   Dismissal timing lives in Hackathon.tsx (auto after one GIF playthrough). */

interface LoadingScreenProps {
    onSkip: () => void;
}

const LoadingScreen = ({ onSkip }: LoadingScreenProps) => (
    <motion.div
        className="loader"
        onClick={onSkip}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
    >
        <img src="/f26/loader.gif" alt="loading" />
        <div className="lo-hint">CLICK TO SKIP</div>
    </motion.div>
);

export default LoadingScreen;
