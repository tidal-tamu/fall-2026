import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { ComponentType } from "react";
import Hero from "./Hero";
import HeroGlass from "./heroes/HeroGlass";
import HeroSlopes from "./heroes/HeroSlopes";
import HeroPaper from "./heroes/HeroPaper";
import HeroMusic from "./heroes/HeroMusic";
import HeroCaped from "./heroes/HeroCaped";
import { useHeroVariant, type HeroVariant } from "./heroes/variants";
import LoadingScreen from "./LoadingScreen";
import Sponsors, { type RailTone } from "./Sponsors";
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
import "./tidal-hero.css";
import "./tidal-accents.css"; // pastel blue layer; must stay last

/* The page is laid out as an album: the hero is the cover, every section
   after it is a numbered track (see TRACKS in event.ts), and the docked
   player in Navbar walks between them. */

/* Hero explorations: every version paired with the sponsor rail surface
   that sits right on it, or null where the hero runs to the bottom edge. */
const HEROES: Record<HeroVariant, { Hero: ComponentType<{ shouldAnimate?: boolean }>; rail: RailTone | null }> = {
    caped: { Hero: HeroCaped, rail: null },
    diary: { Hero, rail: null },
    glass: { Hero: HeroGlass, rail: "glass" },
    slopes: { Hero: HeroSlopes, rail: "paper" },
    paper: { Hero: HeroPaper, rail: "blue" },
    music: { Hero: HeroMusic, rail: null },
};

const HackathonF26 = () => {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const variant = useHeroVariant();
    const { Hero: CurrentHero, rail } = HEROES[variant];

    useEffect(() => {
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
                    <CurrentHero key={variant} shouldAnimate={shouldAnimate} />
                    {rail && <Sponsors tone={rail} />}
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
