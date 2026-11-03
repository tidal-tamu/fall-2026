import { cn } from "./ui";
import { LINKS } from "./event";

type Sponsor = { name: string; logo: string };

const sponsorLogo = (file: string) => `${import.meta.env.BASE_URL}f26/sponsors/${file}`;

const sponsors: Sponsor[] = [
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

const SPONSOR_MAIL =
    `mailto:${LINKS.email}?subject=` + encodeURIComponent("Sponsoring tidalBYTE '26");

export default function Sponsors() {
    return (
        <section id="sponsors" className={cn(
            "caped-sponsors py-24 px-6 relative overflow-clip font-mono bg-transparent text-[#262c32]",
            "before:absolute before:w-[18px] before:h-[18px] before:border-[3px] before:border-solid",
            "before:border-[#f5f8fa] before:[transform:rotate(45deg)] before:content-[''] before:opacity-80",
            "before:top-[14%] before:right-[12%] after:absolute after:w-2.5 after:h-2.5 after:border-[3px]",
            "after:border-solid after:border-[#f5f8fa] after:[transform:rotate(45deg)] after:content-['']",
            "after:opacity-80 after:top-[35%] after:left-[8%] max-[600px]:pt-16",
        )} aria-labelledby="sponsors-title">
            <div className="caped-sponsors__inner relative z-[1] w-[min(100%,_1120px)] [margin-inline:auto]">
                <header className="caped-sponsors__head max-w-[680px] mb-16 max-[600px]:mb-12">
                    <p className="caped-sponsors__eyebrow mt-0 text-[11px] font-bold tracking-[0.18em] leading-[1.6]">THE HEROES BEHIND THE HERO</p>
                    <h2 className={cn(
                        "my-6 mx-0 font-pixel text-[clamp(2rem,_5.7vw,_4.5rem)] font-normal tracking-[-0.07em]",
                        "leading-[1.3] [overflow-wrap:anywhere] [text-shadow:4px_4px_0_#f5f8fa]",
                    )} id="sponsors-title">powered by</h2>
                    <p className="mt-0 max-w-[56ch] text-[14px] leading-[1.8]">Thanks to the sponsors helping make tidalBYTE &apos;26 possible.</p>
                </header>

                <ul className={cn(
                    "caped-sponsors__grid p-0 m-0 gap-4 grid grid-cols-5 list-none max-[800px]:grid-cols-3",
                    "max-[600px]:gap-4 max-[600px]:grid-cols-2",
                )} aria-label="Sponsors">
                    {sponsors.map((sponsor) => (
                        <li key={sponsor.name} className={cn(
                            "caped-sponsors__window p-4 grid place-items-center min-w-0 [aspect-ratio:1.45] border-[3px]",
                            "border-solid border-[#262c32] rounded-[5px] bg-[#f5f8fa] shadow-[5px_5px_0_#94aec4]",
                            "max-[600px]:[aspect-ratio:1.3]",
                        )}>
                            <img className="block w-[min(100%,_150px)] max-h-[58px] object-contain [filter:brightness(0)] opacity-[0.82]" src={sponsor.logo} alt={sponsor.name} loading="lazy" decoding="async" />
                        </li>
                    ))}
                </ul>

                <div className={cn(
                    "caped-sponsors__invite p-8 gap-8 flex items-center justify-between mt-16 border-2 border-dashed",
                    "border-[#262c32] bg-[#e6eef5] max-[600px]:p-6 max-[600px]:items-start max-[600px]:flex-col",
                    "max-[600px]:mt-12",
                )}>
                    <div>
                        <p className="caped-sponsors__eyebrow text-[11px] font-bold tracking-[0.18em] leading-[1.6]">THERE&apos;S ROOM FOR ONE MORE</p>
                        <p className="caped-sponsors__invite-title mt-0 text-[clamp(18px,_2.4vw,_24px)] font-bold leading-[1.4]">Want your logo up here?</p>
                    </div>
                    <a className={cn(
                        "py-4 px-6 gap-4 inline-flex items-center justify-center border-2 border-solid border-[#262c32]",
                        "rounded-[999px] bg-[#262c32] text-[#f5f8fa] text-[12px] font-bold tracking-[0.07em] text-center",
                        "whitespace-nowrap shadow-[4px_4px_0_#94aec4]",
                        "[transition:transform_160ms_ease-out,_box-shadow_160ms_ease-out] motion-reduce:[transition:none]",
                        "hover:[transform:translateY(-2px)] hover:shadow-[4px_6px_0_#94aec4]",
                        "active:[transform:translateY(1px)] active:shadow-[2px_2px_0_#94aec4]",
                        "focus-visible:[outline:3px_solid_#f0bd75] focus-visible:[outline-offset:4px]",
                    )} href={SPONSOR_MAIL}>SPONSOR TIDALBYTE <span aria-hidden="true">↗</span></a>
                </div>
            </div>
        </section>
    );
}
