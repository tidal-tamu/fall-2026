import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaDiscord,
    FaEnvelope,
} from "react-icons/fa";

interface FooterProps {
    registerUrl: string;
}

const SOCIALS = [
    { icon: FaInstagram, url: "https://www.instagram.com/tidaltamu/", label: "Instagram" },
    { icon: FaDiscord, url: "https://discord.gg/eQ8ScamG4H", label: "Discord" },
    { icon: FaLinkedin, url: "https://www.linkedin.com/company/tidaltamu", label: "LinkedIn" },
    { icon: FaGithub, url: "https://github.com/tidal-tamu/", label: "GitHub" },
    { icon: FaEnvelope, url: "mailto:tidaltamu@gmail.com", label: "Email" },
];

export default function Footer({ registerUrl }: FooterProps) {
    return (
        <footer className="byte-footer">
            <div className="big px">
                READY PLAYER YOU?
                <br />
                <span style={{ color: "var(--pink)" }}>INSERT COIN TO CONTINUE</span>
            </div>
            <a
                className="gbtn reg px"
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                ▶ REGISTER NOW<small>free · all students welcome</small>
            </a>
            <div className="socials">
                {SOCIALS.map(({ icon: Icon, url, label }) => (
                    <a
                        key={url}
                        href={url}
                        aria-label={label}
                        target={url.startsWith("mailto") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                    >
                        <Icon style={{ width: 15, height: 15 }} />
                    </a>
                ))}
            </div>
            <div className="fine">
                TIDALbyte 2026 · made with ♥ + too much boba ·{" "}
                <a
                    href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--ink-dim)" }}
                >
                    MLH Code of Conduct
                </a>
            </div>
        </footer>
    );
}
