/* Persistent y2k marquee pinned to the bottom of the viewport. */

interface Sponsor {
    name: string;
    logo: string;
    light?: boolean;
}

const SPONSORS: Sponsor[] = [
    { name: "Diodes Incorporated", logo: "/f26/sponsors/diodes.png" },
    { name: "ElevenLabs", logo: "/f26/sponsors/elevenlabs.png" },
    { name: "Adobe", logo: "/f26/sponsors/adobe.png" },
    { name: "Microsoft", logo: "/f26/sponsors/microsoft.png" },
    { name: "Jane Street", logo: "/f26/sponsors/jane-street.png", light: true },
    { name: "Base44", logo: "/f26/sponsors/base44.png" },
    { name: "NVIDIA", logo: "/f26/sponsors/nvidia.png" },
    { name: "AWS", logo: "/f26/sponsors/aws.png", light: true },
    { name: "Google", logo: "/f26/sponsors/google.png" },
    { name: "XPerf", logo: "/f26/sponsors/xperf.png", light: true },
];

const Ticker = () => (
    <div className="ticker" role="region" aria-label="Sponsors">
        <div className="ticker-inner">
            {[0, 1].map((copy) => (
                <div
                    className="ticker-set"
                    key={copy}
                    aria-hidden={copy === 1 ? true : undefined}
                >
                    {SPONSORS.map(({ name, logo, light }) => (
                        <span className="ticker-item" key={name}>
                            <img
                                className={`ticker-logo${light ? " ticker-logo-light" : ""}`}
                                src={logo}
                                alt={copy === 0 ? `${name} logo` : ""}
                            />
                        </span>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export default Ticker;
