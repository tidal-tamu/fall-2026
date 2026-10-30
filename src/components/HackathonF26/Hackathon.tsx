import { useState, useEffect } from "react";
import { AnimatePresence, useMotionValue } from "framer-motion";
import HeroCaped from "./heroes/HeroCaped";
import LoadingScreen from "./LoadingScreen";
import About from "./About";
import Schedule from "./Schedule";
import Prizes from "./Prizes";
import Sponsors from "./Sponsors";
import FAQs from "./FAQs";
import Register from "./Register";
import LevelSky from "./LevelSky";
import LevelNavigation from "./LevelNavigation";
import { cn, ui } from "./ui";

const HackathonF26 = () => {
    const levelProgress = useMotionValue(0);
    const staticEntry = () => window.matchMedia("(max-width: 760px), (prefers-reduced-motion: reduce)").matches;
    const [shouldAnimate, setShouldAnimate] = useState(staticEntry);
    const [isLoading, setIsLoading] = useState(() => !staticEntry());
    useEffect(() => {
        if (!isLoading)
            return;
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
            <div className={cn("w-full bg-paper text-ink", ui.focus)}>
                {/* Keep the original hero above the level's fixed sky layer. */}
                <div id="top" className="relative isolate z-10 h-screen overflow-hidden">
                    <HeroCaped shouldAnimate={shouldAnimate} />
                </div>
                <main className={cn("byte-site group/level relative isolate text-game-ink font-gameMono", ui.levelMotion)}>
                    <LevelSky progress={levelProgress} />
                    <About />
                    <Schedule />
                    <Prizes />
                    <Sponsors />
                    <FAQs />
                    <Register />
                </main>
                <LevelNavigation progress={levelProgress} />
            </div>
        </>
    );
};
export default HackathonF26;
