/* -------------------------------------------------------------------------- */
/*  Event facts the page repeats in several places (hero pills, register      */
/*  buttons, contact links). Change them here, not per section.               */
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
    registrationOpen: true,
    registerUrl: "https://portal.tidaltamu.com",
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

/* In-page links in the hero's top nav. */
export const NAV = [
    { label: "Sponsors", href: "#sponsors" },
    { label: "Updates", href: "#under-construction" },
];

/* Format event times in College Station's zone, not the visitor's, so a
   hacker checking from another timezone still sees "7:00 AM". */
export const fmtCentral = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", ...opts }).format(
        new Date(iso),
    );
