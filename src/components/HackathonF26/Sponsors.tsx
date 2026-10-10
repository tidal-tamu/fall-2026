type Sponsor = { name: string; logo: string };

const sponsorLogo = (file: string) => `${import.meta.env.BASE_URL}f26/sponsors/${file}`;

// Heroes that show the rail lay themselves out above this height.
export const SPONSOR_RAIL_HEIGHT = 56;

// Shared with the liner-notes sticker wall further down the page.
export const sponsors: Sponsor[] = [
    { name: "Adobe", logo: sponsorLogo("adobe.png") },
    { name: "Stata", logo: sponsorLogo("stata.png") },
    { name: "Base44", logo: sponsorLogo("base44.png") },
    { name: "Diodes", logo: sponsorLogo("diodes.png") },
    { name: "ElevenLabs", logo: sponsorLogo("elevenlabs.png") },
    { name: "Google", logo: sponsorLogo("google.png") },
    { name: "Jane Street", logo: sponsorLogo("jane-street.png") },
    { name: "Microsoft", logo: sponsorLogo("microsoft.png") },
    { name: "NVIDIA", logo: sponsorLogo("nvidia.png") },
    { name: "xPerf", logo: sponsorLogo("xperf.png") },
];

/* The rail sits on whatever the hero puts behind it, so each hero version
   picks the surface: printed paper, clear over glass, or white-on-blue. */
export type RailTone = "paper" | "glass" | "blue";

const TONES: Record<RailTone, { rail: string; label: string; logo: string }> = {
    paper: {
        rail: "border-t border-rule bg-paper/95 backdrop-blur-sm",
        label: "text-mid",
        logo: "brightness-0 opacity-80",
    },
    glass: {
        rail: "border-t border-white/40 bg-white/25 backdrop-blur-md",
        label: "text-hint-deep",
        logo: "brightness-0 opacity-70",
    },
    blue: {
        rail: "border-t border-white/25 bg-transparent",
        label: "text-white/80",
        logo: "brightness-0 invert opacity-85",
    },
};

const Sponsors = ({ tone = "paper" }: { tone?: RailTone }) => (
    <aside
        aria-label="Sponsors"
        className={`absolute inset-x-0 bottom-0 z-40 px-5 py-3 md:px-8 ${TONES[tone].rail}`}
        style={{ height: SPONSOR_RAIL_HEIGHT }}
    >
        <div className="flex items-center gap-4 md:gap-7">
            <p className={`label shrink-0 !text-[8px] md:!text-[9px] ${TONES[tone].label}`}>
                Powered by
            </p>
            <div className="sponsor-rail min-w-0 flex-1">
                <div className="sponsor-rail__track">
                    {[false, true].map((duplicate) => (
                        <ul
                            key={String(duplicate)}
                            aria-hidden={duplicate || undefined}
                            className="sponsor-rail__sequence"
                        >
                            {sponsors.map((sponsor) => (
                                <li
                                    key={sponsor.name}
                                    className="flex h-7 min-w-14 shrink-0 items-center justify-center md:h-8 md:min-w-16"
                                >
                                    <img
                                        src={sponsor.logo}
                                        alt={duplicate ? "" : sponsor.name}
                                        className={`max-h-full max-w-[88px] object-contain md:max-w-[108px] ${TONES[tone].logo}`}
                                        loading="eager"
                                    />
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
        </div>
    </aside>
);

export default Sponsors;
