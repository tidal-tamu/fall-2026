type Sponsor = { name: string; logo: string };

// The physics layer uses this too, so its floor lands exactly on the rail's
// top border rather than underneath the sponsor logos.
export const SPONSOR_RAIL_HEIGHT = 56;

const sponsors: Sponsor[] = [
    { name: "Adobe", logo: "/f26/sponsors/adobe.png" },
    { name: "Amazon Web Services", logo: "/f26/sponsors/aws.png" },
    { name: "Base44", logo: "/f26/sponsors/base44.png" },
    { name: "Diodes", logo: "/f26/sponsors/diodes.png" },
    { name: "ElevenLabs", logo: "/f26/sponsors/elevenlabs.png" },
    { name: "Google", logo: "/f26/sponsors/google.png" },
    { name: "Jane Street", logo: "/f26/sponsors/jane-street.png" },
    { name: "Microsoft", logo: "/f26/sponsors/microsoft.png" },
    { name: "NVIDIA", logo: "/f26/sponsors/nvidia.png" },
    { name: "xPerf", logo: "/f26/sponsors/xperf.png" },
];

const Sponsors = () => (
    <aside
        aria-label="Sponsors"
        className="absolute inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 px-5 py-3 backdrop-blur-sm md:px-8"
        style={{ height: SPONSOR_RAIL_HEIGHT }}
    >
        <div className="flex items-center gap-4 md:gap-7">
            <p className="label shrink-0 !text-[8px] text-mid md:!text-[9px]">
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
                                        className="max-h-full max-w-[88px] object-contain brightness-0 opacity-80 md:max-w-[108px]"
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
