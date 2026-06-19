import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaDiscord,
} from "react-icons/fa";

const MAIN_SITE = "https://tidaltamu.com";

type NavLink = {
    title: string;
    path: string;
    isExternal?: boolean;
};

const navLinks: NavLink[] = [
    { title: "About", path: "about" },
    { title: "Schedule", path: "schedule" },
    { title: "Prizes", path: "prizes" },
    { title: "Sponsors", path: "sponsors" },
    { title: "FAQ", path: "faq" },
];

interface NavbarProps {
    onMenuToggle?: (isOpen: boolean) => void;
    shouldAnimate?: boolean;
    registerUrl: string;
    isMobileMenuOpen: boolean;
}

export default function Navbar({
    onMenuToggle,
    shouldAnimate = false,
    registerUrl,
}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const handleAnchorClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        path: string,
    ) => {
        if (!path.startsWith("/") && !path.startsWith("http")) {
            e.preventDefault();
            const element = document.getElementById(path);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                setIsOpen(false);
            }
        }
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.width = "100%";
        } else {
            const scrollY = document.body.style.top;
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || "0") * -1);
            }
        }
        onMenuToggle?.(isOpen);
    }, [isOpen, onMenuToggle]);

    return (
        <motion.nav
            className={`fixed top-0 w-full z-[9999] transition-all duration-300 ${
                scrolled
                    ? "bg-y2k-darkNavy/90 backdrop-blur-md border-b border-y2k-pink/20"
                    : "bg-transparent"
            }`}
        >
            <div className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">
                <motion.a
                    href={MAIN_SITE}
                    className="flex items-center gap-2 z-50"
                    initial={{ opacity: 0 }}
                    animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <span className="font-pixel text-sm text-y2k-pink glow-text-pink">
                        TIDAL
                    </span>
                    <span className="font-pixel text-[10px] text-y2k-blue glow-text-blue">
                        byte
                    </span>
                </motion.a>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link, i) => (
                        <motion.a
                            key={link.title}
                            href={`#${link.path}`}
                            onClick={(e) => handleAnchorClick(e, link.path)}
                            className="font-vt323 text-lg text-gray-300 hover:text-y2k-pink transition-colors duration-200"
                            initial={{ opacity: 0, y: -10 }}
                            animate={
                                shouldAnimate
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: -10 }
                            }
                            transition={{ delay: 0.1 * i, duration: 0.5 }}
                        >
                            {link.title}
                        </motion.a>
                    ))}
                    <motion.a
                        href={registerUrl}
                        className="y2k-button font-pixel text-[8px] px-4 py-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={
                            shouldAnimate
                                ? { opacity: 1, scale: 1 }
                                : { opacity: 0, scale: 0.8 }
                        }
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        REGISTER
                    </motion.a>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 z-50 text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            <motion.div
                className="md:hidden fixed inset-0 bg-y2k-darkNavy/95 backdrop-blur-xl z-[9998]"
                initial={{ x: "100%", opacity: 0 }}
                animate={{
                    x: isOpen ? "0%" : "100%",
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ display: isOpen ? "block" : "none" }}
            >
                <div className="flex flex-col h-full px-6 py-12">
                    <div className="flex-1 flex flex-col items-center justify-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.title}
                                href={`#${link.path}`}
                                onClick={(e) => {
                                    handleAnchorClick(e, link.path);
                                    setIsOpen(false);
                                }}
                                className="font-pixel text-sm text-gray-300 hover:text-y2k-pink transition-colors"
                            >
                                {link.title}
                            </a>
                        ))}
                        <a
                            href={registerUrl}
                            className="y2k-button font-pixel text-[10px] px-6 py-3 mt-4"
                        >
                            REGISTER
                        </a>
                    </div>

                    <div className="flex justify-center gap-4 pb-16">
                        {[
                            {
                                icon: FaGithub,
                                url: "https://github.com/tidal-tamu/",
                            },
                            {
                                icon: FaLinkedin,
                                url: "https://www.linkedin.com/company/tidaltamu",
                            },
                            {
                                icon: FaInstagram,
                                url: "https://www.instagram.com/tidaltamu/",
                            },
                            {
                                icon: FaDiscord,
                                url: "https://discord.gg/eQ8ScamG4H",
                            },
                        ].map(({ icon: Icon, url }) => (
                            <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/5 border border-y2k-pink/30 rounded flex items-center justify-center text-gray-400 hover:text-y2k-pink hover:border-y2k-pink transition-all"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.nav>
    );
}
