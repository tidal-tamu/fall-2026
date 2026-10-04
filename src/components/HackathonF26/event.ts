/* -------------------------------------------------------------------------- */
/*  Event facts the page repeats in several places (hero tagline, ticket,     */
/*  receipt, profile, dock countdown). Change them here, not per section.      */
/* -------------------------------------------------------------------------- */

export const EVENT = {
    date: "November 21, 2026",
    day: "Saturday",
    room: "MSC 2304",
    city: "College Station, TX",
    hours: 12,
    /* Doors open / close. Nov 21 is after the DST change, so Central is -06. */
    startsAt: "2026-11-21T07:00:00-06:00",
    endsAt: "2026-11-21T19:00:00-06:00",
    registrationOpen: false,
    registerUrl: "",
};

export const LINKS = {
    email: "tidaltamu@gmail.com",
    discord: "https://discord.gg/eQ8ScamG4H",
    instagram: "https://www.instagram.com/tidaltamu/",
    linkedin: "https://www.linkedin.com/company/tidaltamu",
    github: "https://github.com/tidal-tamu/",
    site: "https://tidaltamu.com",
    mlhCoc: "https://static.mlh.io/docs/mlh-code-of-conduct.pdf",
};

/* The page as an album. Order here is scroll order, and the dock's
   prev/next buttons walk this list. */
export const TRACKS = [
    { id: "top", title: "intro" },
    { id: "invite", title: "the invite" },
    { id: "about", title: "about" },
    { id: "schedule", title: "schedule" },
    { id: "prizes", title: "prizes" },
    { id: "sponsors", title: "liner notes" },
    { id: "faq", title: "b-sides" },
] as const;

export const STICKER = (name: string) => `/f26/stickers/${name}.webp`;

/* In-page links every hero's top nav shares. */
export const NAV = [
    { label: "About", href: "#about" },
    { label: "Schedule", href: "#schedule" },
    { label: "Prizes", href: "#prizes" },
    { label: "FAQ", href: "#faq" },
];

/* Whole days until doors open, for the "N days to go" bits. */
export const daysToDoors = (now = Date.now()) =>
    Math.max(0, Math.ceil((Date.parse(EVENT.startsAt) - now) / 86_400_000));

/* Format event times in College Station's zone, not the visitor's, so a
   hacker checking from another timezone still sees "7:00 AM". */
export const fmtCentral = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", ...opts }).format(
        new Date(iso),
    );
