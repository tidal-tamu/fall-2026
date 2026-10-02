import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "./Hero";
import LoadingScreen from "./LoadingScreen";
import Sponsors from "./Sponsors";
import Invite from "./Invite";
import About from "./About";
import Schedule from "./Schedule";
import Prizes from "./Prizes";
import LinerNotes from "./LinerNotes";
import FAQs from "./FAQs/FAQs";
import Navbar from "./Navbar";
import Footer from "../Footer";
import "./tidal-effects.css";
import "./tidal-paper.css";
import "./tidal-profile.css";
import "./tidal-player.css";
import "./tidal-dock.css";

/* The page is laid out as an album: the hero is the cover, every section
   after it is a numbered track (see TRACKS in event.ts), and the docked
   player in Navbar walks between them. */

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
                    <Hero shouldAnimate={shouldAnimate} />
                    <Sponsors />
                </div>

                <Invite />
                <About />
                <Schedule />
                <Prizes />
                <LinerNotes />
                <FAQs />
                <Footer />
            </div>

            <Navbar />
        </>
    );
};

export default HackathonF26;
