import { Suspense, lazy } from "react";
import { motion } from "framer-motion";

const PrizeCards = lazy(() => import("./PrizeCards"));

interface HeroProps {
    shouldAnimate?: boolean;
    registerUrl: string;
}

const DISCORD_URL = "https://discord.gg/tidaltamu";
const DEVPOST_URL = "https://tidalbyte.devpost.com";

const NAV = [
    { label: "About", href: "#about" },
    { label: "Schedule", href: "#schedule" },
    { label: "Prizes", href: "#prizes" },
    { label: "FAQ", href: "#faq" },
];

const CHIPS = ["NOVEMBER 2026", "MSC BETHANCOURT", "24 HOURS"];

const Hero = ({ shouldAnimate = false, registerUrl }: HeroProps) => {
    const rise = (delay: number) => ({
        initial: { y: 16, opacity: 0 },
        animate: shouldAnimate ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 },
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const, delay },
    });

    return (
        <div className="relative h-screen w-full overflow-hidden select-none bg-paper text-ink claw-cursor">
            {/* Hairline frame inset from the edge — the page as a printed sheet. */}
            <div className="pointer-events-none absolute inset-3 md:inset-5 border border-rule z-30" />

            {/* ---------------------------------------------------- navbar -- */}
            {/* The MLH badge is deliberately NOT in this row. It is ~77px tall,
                so as a flex child it set the row height and `items-center`
                centred the wordmark and links against it — dragging the whole
                nav well down the page. It is positioned separately below, and
                the row just reserves right-hand space for it. */}
            <motion.header
                className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between gap-6 px-7 md:px-12 lg:pr-[104px] pt-6 md:pt-7 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
            >
                <a
                    href="#top"
                    className="font-pixel text-[13px] md:text-[15px] tracking-tight pointer-events-auto"
                >
                    tidalBYTE
                </a>

                <nav className="flex items-center gap-5 md:gap-8 pointer-events-auto">
                    <ul className="hidden md:flex items-center gap-6 lg:gap-8">
                        {NAV.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className="label text-mid hover:text-ink transition-colors"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <a
                        href={registerUrl}
                        className="nav-pill font-pixel text-[8px] md:text-[9px]"
                    >
                        REGISTER
                        <span aria-hidden="true">[→]</span>
                    </a>

                </nav>
            </motion.header>

            {/* MLH badge, pinned to the corner just inside the frame rule so it
                can hang to its full height without affecting the nav. */}
            <motion.a
                href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=black"
                className="hidden lg:block absolute top-7 right-7 w-[48px] z-40 opacity-90 hover:opacity-100 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={shouldAnimate ? { opacity: 0.9 } : { opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
            >
                <img
                    src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-black.svg"
                    alt="Major League Hacking 2026 Hackathon Season"
                    decoding="async"
                />
            </motion.a>

            {/* ------------------------------------------------ centrepiece -- */}
            {/* pointer-events-none on the wrapper so the physics layer beneath
                stays draggable everywhere except on the actual links. */}
            {/* Padded at the foot so the block sits above centre, leaving the
                lower band clear for the prize pile. */}
            <main className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 pb-28 md:pb-36 pointer-events-none">
                <motion.p
                    className="label text-mid text-center mb-5"
                    {...rise(0.3)}
                >
                    TIDAL · TEXAS A&amp;M PRESENTS
                </motion.p>

                {/* One lockup — "tidalBYTE '26" is the wordmark, not three
                    separate words. Press Start 2P's space is a full em, which
                    reads as a gap wide enough to break the lockup apart, so the
                    year is spaced manually at roughly half that. */}
                <motion.h1
                    className="pixel-title font-pixel text-center leading-none whitespace-nowrap text-[clamp(1.05rem,5.6vw,4.4rem)] mb-9"
                    {...rise(0.42)}
                >
                    tidalBYTE
                    <span aria-hidden="true" className="inline-block w-[0.4em]" />
                    &apos;26
                </motion.h1>

                <motion.ul
                    className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5 mb-10"
                    {...rise(0.54)}
                >
                    {CHIPS.map((chip) => (
                        <li
                            key={chip}
                            className="chip label text-ink !text-[10px] md:!text-[11px]"
                        >
                            {chip}
                        </li>
                    ))}
                </motion.ul>

                <motion.div
                    className="font-mono text-[12px] md:text-[14px] text-center leading-[2.1] text-mid pointer-events-auto"
                    {...rise(0.66)}
                >
                    <p>
                        Join the{" "}
                        <a
                            href={DISCORD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink underline underline-offset-4 decoration-1 hover:opacity-60 transition-opacity"
                        >
                            Discord
                        </a>{" "}
                        and{" "}
                        <a
                            href={DEVPOST_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink underline underline-offset-4 decoration-1 hover:opacity-60 transition-opacity"
                        >
                            Devpost
                        </a>
                    </p>
                    <p>
                        and{" "}
                        <a
                            href={registerUrl}
                            className="text-ink underline underline-offset-4 decoration-1 hover:opacity-60 transition-opacity"
                        >
                            Register
                        </a>{" "}
                        to save your spot!
                    </p>
                </motion.div>
            </main>

            {/* ----------------------------------------- throwable prizes --- */}
            <Suspense fallback={null}>
                <PrizeCards />
            </Suspense>
        </div>
    );
};

export default Hero;
