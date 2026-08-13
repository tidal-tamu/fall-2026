import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "./Hero";
import LoadingScreen from "./LoadingScreen";
import "./tidal-effects.css";

// Hero-only for now. Navbar, About, Schedule, Prizes, Sponsors, FAQs and Footer
// all still live in this directory — re-import and drop them back in below when
// we start building out the rest of the page.

const REGISTER_URL = "https://tidaltamu.com/register";

const HackathonF26 = () => {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2800);

        const animTimer = setTimeout(() => {
            setShouldAnimate(true);
        }, 500);

        return () => {
            clearTimeout(timer);
            clearTimeout(animTimer);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {isLoading && <LoadingScreen />}
            </AnimatePresence>

            <div className="h-screen overflow-hidden w-full bg-paper">
                <Hero shouldAnimate={shouldAnimate} registerUrl={REGISTER_URL} />
            </div>
        </>
    );
};

export default HackathonF26;
