import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaDiscord,
    FaEnvelope,
} from "react-icons/fa";

const MAIN_SITE = "https://tidaltamu.com";

export default function Footer() {
    return (
        <footer
            className="relative px-6 lg:px-12 py-16 z-10"
            style={{
                background:
                    "linear-gradient(to bottom, #0e0e35, #060618)",
            }}
        >
            <div className="max-w-7xl mx-auto">
                {/* LED divider */}
                <div className="flex justify-center gap-3 mb-12">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-y2k-gold/40"
                            style={{
                                boxShadow: "0 0 3px rgba(255, 215, 0, 0.2)",
                            }}
                        />
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div>
                        <a
                            href={MAIN_SITE}
                            className="inline-flex items-center gap-2 mb-4"
                        >
                            <span className="font-pixel text-xs text-y2k-pink glow-text-pink">
                                TIDAL
                            </span>
                            <span className="font-pixel text-[8px] text-y2k-blue glow-text-blue">
                                byte
                            </span>
                        </a>
                        <p className="font-pixel text-[8px] text-white/80 mb-2">
                            TIDALTAMU
                        </p>
                        <p className="font-vt323 text-sm text-white/40">
                            The AI Wave Starts Here
                        </p>
                    </div>

                    <div>
                        <h4 className="font-pixel text-[8px] text-y2k-gold mb-4">
                            CONTACT
                        </h4>
                        <a
                            href="mailto:tidaltamu@gmail.com"
                            className="font-vt323 text-sm text-white/60 hover:text-y2k-pink transition-colors"
                        >
                            tidaltamu@gmail.com
                        </a>
                    </div>

                    <div>
                        <div className="flex gap-3 mb-6">
                            {[
                                {
                                    icon: FaInstagram,
                                    url: "https://www.instagram.com/tidaltamu/",
                                },
                                {
                                    icon: FaDiscord,
                                    url: "https://discord.gg/eQ8ScamG4H",
                                },
                                {
                                    icon: FaLinkedin,
                                    url: "https://www.linkedin.com/company/tidaltamu",
                                },
                                {
                                    icon: FaGithub,
                                    url: "https://github.com/tidal-tamu/",
                                },
                                {
                                    icon: FaEnvelope,
                                    url: "mailto:tidaltamu@gmail.com",
                                },
                            ].map(({ icon: Icon, url }) => (
                                <a
                                    key={url}
                                    href={url}
                                    target={
                                        url.startsWith("mailto")
                                            ? undefined
                                            : "_blank"
                                    }
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 border border-y2k-blue/20 rounded flex items-center justify-center text-white/40 hover:text-y2k-pink hover:border-y2k-pink/40 transition-all"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                        <div className="font-vt323 text-xs text-white/30">
                            <p className="mb-1">&copy; 2026 TIDALTAMU</p>
                            <a
                                href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white/60 transition-colors"
                            >
                                MLH Code of Conduct
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
