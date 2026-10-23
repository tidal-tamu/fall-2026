import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import HeroCaped from "./heroes/HeroCaped";
import LoadingScreen from "./LoadingScreen";
import ByteLevel from "./ByteLevel";
import "./tidal-effects.css";
import "./tidal-paper.css";
import "./tidal-profile.css";
import "./tidal-player.css";
import "./tidal-dock.css";
import "./tidal-hero.css";
import "./tidal-accents.css"; // pastel blue layer; must stay last
import "./temporary-caped.css";

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
                {/* Keep the original hero above the level's fixed sky layer. */}
                <div id="top" className="relative isolate z-10 h-screen overflow-hidden">
                    <HeroCaped shouldAnimate={shouldAnimate} />
                </div>

                <ByteLevel />
            </div>
        </>
    );
};

export default HackathonF26;
