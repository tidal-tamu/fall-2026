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
    startsAt: "2026-11-21T09:00:00-06:00",
    endsAt: "2026-11-21T22:30:00-06:00",
    registrationOpen: true,
    registerUrl: "https://portal.tidaltamu.com",
    judgeMentorApplyUrl: "https://forms.gle/o5SJCeBpQUMuLyUz6",
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

export const STICKER = (name: string) => `${import.meta.env.BASE_URL}f26/stickers/${name}.webp`;

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
   hacker checking from another timezone still sees "9:00 AM". */
export const fmtCentral = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", ...opts }).format(
        new Date(iso),
    );

// Hacker-facing events, shared by the schedule and its downloadable PNG.
export const QUESTS = [
    {
        "time": "9:00 AM",
        "name": "hacker check-in + doors open",
        "note": "",
        "kind": "main",
        "icon": "pebble",
        "highlight": false
    },
    {
        "time": "9:00 AM",
        "name": "breakfast",
        "note": "breakfast tacos",
        "kind": "food",
        "icon": "fish",
        "highlight": false
    },
    {
        "time": "9:30 AM",
        "name": "opening ceremony",
        "note": "",
        "kind": "main",
        "icon": "mic",
        "highlight": false
    },
    {
        "time": "10:00 AM",
        "name": "hacking begins",
        "note": "",
        "kind": "main",
        "icon": "star",
        "highlight": true
    },
    {
        "time": "10:30 AM",
        "name": "team formation + intro to agents",
        "note": "",
        "kind": "side",
        "icon": "monster",
        "highlight": false
    },
    {
        "time": "12:30 PM",
        "name": "lunch",
        "note": "Mai Shun Yun",
        "kind": "food",
        "icon": "fish",
        "highlight": false
    },
    {
        "time": "4:00 PM",
        "name": "totebag painting",
        "note": "run by Google",
        "kind": "side",
        "icon": "heart",
        "highlight": false
    },
    {
        "time": "6:00 PM",
        "name": "dinner",
        "note": "Domino’s",
        "kind": "food",
        "icon": "fish",
        "highlight": false
    },
    {
        "time": "8:00 PM",
        "name": "hacking ends / submissions close",
        "note": "",
        "kind": "boss",
        "icon": "clock",
        "highlight": true
    },
    {
        "time": "8:00–9:30 PM",
        "name": "project judging",
        "note": "",
        "kind": "main",
        "icon": "gem",
        "highlight": false
    },
    {
        "time": "10:00–10:30 PM",
        "name": "closing ceremony & awards",
        "note": "",
        "kind": "main",
        "icon": "star",
        "highlight": false
    }
] as const;
