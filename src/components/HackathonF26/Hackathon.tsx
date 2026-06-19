import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Schedule from "./Schedule";
import Prizes from "./Prizes";
import Sponsors from "./Sponsors";
import FAQs from "./FAQs/FAQs";
import Footer from "../Footer";
import LoadingScreen from "./LoadingScreen";
import "./tidal-effects.css";

const REGISTER_URL = "https://tidaltamu.com/register";

const HackathonF26 = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

            <div className="min-h-screen overflow-x-hidden w-full bg-y2k-navy">
                <div className="relative overflow-x-clip overflow-y-hidden">
                    <div className="relative z-30">
                        <Navbar
                            onMenuToggle={setIsMobileMenuOpen}
                            shouldAnimate={shouldAnimate}
                            registerUrl={REGISTER_URL}
                            isMobileMenuOpen={isMobileMenuOpen}
                        />
                    </div>

                    <Hero
                        shouldAnimate={shouldAnimate}
                        registerUrl={REGISTER_URL}
                    />
                </div>

                <About />
                <Schedule />
                <Prizes />
                <Sponsors />
                <FAQs />

                <Footer />
            </div>
        </>
    );
};

export default HackathonF26;
