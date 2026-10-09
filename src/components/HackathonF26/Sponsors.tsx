type Sponsor = { name: string; logo: string };

const sponsorLogo = (file: string) => `${import.meta.env.BASE_URL}f26/sponsors/${file}`;

// The sponsor wall in LinerNotes.tsx.
export const sponsors: Sponsor[] = [
    { name: "Adobe", logo: sponsorLogo("adobe.png") },
    { name: "Amazon Web Services", logo: sponsorLogo("aws.png") },
    { name: "Base44", logo: sponsorLogo("base44.png") },
    { name: "Diodes", logo: sponsorLogo("diodes.png") },
    { name: "ElevenLabs", logo: sponsorLogo("elevenlabs.png") },
    { name: "Google", logo: sponsorLogo("google.png") },
    { name: "Jane Street", logo: sponsorLogo("jane-street.png") },
    { name: "Microsoft", logo: sponsorLogo("microsoft.png") },
    { name: "NVIDIA", logo: sponsorLogo("nvidia.png") },
    { name: "xPerf", logo: sponsorLogo("xperf.png") },
];
