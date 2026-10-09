import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import HeroCaped from "./heroes/HeroCaped";
import LoadingScreen from "./LoadingScreen";
import LinerNotes from "./LinerNotes";
import UnderConstruction from "./UnderConstruction";
import "./temporary-caped.css";

/* Temporary site: keep the hero and sponsor wall while the full event page
   is being prepared. */

const HackathonF26 = () => {
    const staticEntry = () =>
        window.matchMedia("(max-width: 760px), (prefers-reduced-motion: reduce)").matches;
    const [shouldAnimate, setShouldAnimate] = useState(staticEntry);
    const [isLoading, setIsLoading] = useState(() => !staticEntry());

    useEffect(() => {
        if (!isLoading) return;
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2800);

        // entrances start as the loading screen begins to fade, not under it
        const animTimer = setTimeout(() => {
            setShouldAnimate(true);
        }, 2500);

        return () => {
            clearTimeout(timer);
            clearTimeout(animTimer);
        };
    }, [isLoading]);

    // hold the page still while the loading screen covers it
    useEffect(() => {
        document.body.style.overflow = isLoading ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoading]);

    return (
        <>
            <AnimatePresence>
                {isLoading && <LoadingScreen />}
            </AnimatePresence>

            <div className="w-full bg-paper text-ink">
                <div id="top" className="relative h-screen overflow-hidden">
                    <HeroCaped shouldAnimate={shouldAnimate} />
                </div>

                <LinerNotes />
                <UnderConstruction />
            </div>
        </>
    );
};

export default HackathonF26;
