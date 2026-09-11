import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CoinProvider } from "./coinEconomy";
import LoadingScreen from "./LoadingScreen";
import Ticker from "./Ticker";
import CoinTrail from "./CoinTrail";
import StickerTray from "./StickerTray";
import Hero from "./Hero";
import "./tidal-effects.css";

const REGISTER_URL = "https://tidaltamu.com/register";

// the loader GIF is ~4.2s — dismiss just after a full playthrough
const LOADER_MS = 4600;

const HackathonF26 = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), LOADER_MS);
        return () => clearTimeout(timer);
    }, []);

    // lock scroll while the intro plays
    useEffect(() => {
        document.body.style.overflow = isLoading ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoading]);

    return (
        <CoinProvider>
            <AnimatePresence>
                {isLoading && <LoadingScreen onSkip={() => setIsLoading(false)} />}
            </AnimatePresence>

            <div className="relative w-full">
                <Ticker />
                <CoinTrail />
                <StickerTray />

                <Hero registerUrl={REGISTER_URL} />
            </div>
        </CoinProvider>
    );
};

export default HackathonF26;
