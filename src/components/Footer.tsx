import { FaDiscord, FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import Sticker from "./HackathonF26/Sticker";
import { EVENT, LINKS, STICKER } from "./HackathonF26/event";

const SOCIALS = [
    { label: "Instagram", icon: FaInstagram, url: LINKS.instagram },
    { label: "Discord", icon: FaDiscord, url: LINKS.discord },
    { label: "LinkedIn", icon: FaLinkedin, url: LINKS.linkedin },
    { label: "GitHub", icon: FaGithub, url: LINKS.github },
    { label: "Email", icon: FaEnvelope, url: `mailto:${LINKS.email}` },
];

/* The one inverted block on the page: the album runs out, the player reads
   12:00:00 / 12:00:00, and there's a button to play it again from the top. */
export default function Footer() {
    return (
        <footer className="footer">
            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="label !text-[10px] text-dim">END OF SIDE A</p>
                    <p className="font-lcd text-[15px] font-extrabold tracking-[0.12em] text-shade-300">
                        {EVENT.hours}:00:00 / {EVENT.hours}:00:00
                    </p>
                </div>
                <div className="footer__bar mt-4" aria-hidden="true" />

                <h2 className="headline mt-16 text-paper">
                    see you on
                    <br />
                    the 21st.
                </h2>
                <p className="dek mt-6 !text-shade-300">
                    {EVENT.day.toLowerCase()}, {EVENT.date.toLowerCase()} · {EVENT.room} ·{" "}
                    {EVENT.hours} hours
                </p>

                <a href="#top" className="footer__replay mt-10">
                    <span aria-hidden="true" className="font-mono text-[15px] leading-none">
                        ↺
                    </span>{" "}
                    play it again
                </a>

                <div className="mt-20 grid gap-10 border-t border-white/15 pt-10 md:grid-cols-3">
                    <div>
                        <a href={LINKS.site} target="_blank" rel="noopener noreferrer" className="inline-block">
                            <img
                                src={`${import.meta.env.BASE_URL}f26/tidal-wordmark.webp`}
                                alt="TIDAL"
                                width={680}
                                height={102}
                                className="h-5 w-auto invert"
                                loading="lazy"
                            />
                        </a>
                        <p className="mt-4 text-[12px] text-dim">The AI Wave Starts Here</p>
                    </div>

                    <div>
                        <p className="label !text-[10px] text-dim">Contact</p>
                        <a href={`mailto:${LINKS.email}`} className="footer__link mt-3 inline-block text-[13px]">
                            {LINKS.email}
                        </a>
                    </div>

                    <div>
                        <ul className="flex flex-wrap gap-2.5">
                            {SOCIALS.map(({ label, icon: Icon, url }) => (
                                <li key={label}>
                                    <a
                                        href={url}
                                        aria-label={label}
                                        target={url.startsWith("mailto") ? undefined : "_blank"}
                                        rel="noopener noreferrer"
                                        className="footer__social"
                                    >
                                        <Icon aria-hidden="true" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 text-[11px] leading-relaxed text-dim">
                            © 2026 tidalTAMU ·{" "}
                            <a
                                href={LINKS.mlhCoc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__link"
                            >
                                MLH Code of Conduct
                            </a>
                        </p>
                    </div>
                </div>

                <Sticker
                    src={STICKER("cow")}
                    width={110}
                    rotate={-8}
                    className="absolute -top-6 right-0 md:right-6 md:top-16 md:[--sticker-w:150px]"
                />
            </div>
        </footer>
    );
}
