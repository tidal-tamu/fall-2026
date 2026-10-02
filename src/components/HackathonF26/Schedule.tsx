import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Sticker from "./Sticker";
import { EVENT, STICKER, fmtCentral } from "./event";

/* -------------------------------------------------------------------------- */
/*  The schedule as a Receiptify-style receipt that "prints" into view.        */
/* -------------------------------------------------------------------------- */

/* Mirrors last fall's one-day run of show (doors at 7, out by 7). Pencilled in
   until the F26 schedule is locked. `at` is Central time, 24h. */
const RUN_OF_SHOW = [
    { at: "07:00", item: "doors open + check-in", note: "breakfast is on us" },
    { at: "07:30", item: "opening ceremony", note: "team matchmaking after" },
    { at: "08:00", item: "hacking begins" },
    { at: "08:00", item: "workshop 01" },
    { at: "09:00", item: "workshop 02" },
    { at: "10:00", item: "workshop 03" },
    { at: "13:00", item: "lunch" },
    { at: "16:30", item: "submissions due", note: "pencils down" },
    { at: "17:00", item: "judging" },
    { at: "18:30", item: "closing + awards" },
    { at: "19:00", item: "doors close" },
];

const DAY = EVENT.startsAt.slice(0, 10);
const OFFSET = EVENT.startsAt.slice(19);
const isoAt = (at: string) => `${DAY}T${at}:00${OFFSET}`;
const timeLabel = (at: string) =>
    fmtCentral(isoAt(at), { hour: "numeric", minute: "2-digit" }).replace(/\s/, " ");

const DATE_LINE = fmtCentral(EVENT.startsAt, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
}).toUpperCase();

const gcalStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
const CALENDAR_URL =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent("tidalBYTE '26")}` +
    `&dates=${gcalStamp(EVENT.startsAt)}/${gcalStamp(EVENT.endsAt)}` +
    `&location=${encodeURIComponent(`${EVENT.room}, Texas A&M, ${EVENT.city}`)}` +
    `&details=${encodeURIComponent("TIDAL's 12-hour fall hackathon. https://f26.tidaltamu.com")}`;

/* The line that is happening right now, on the day itself. */
function useCurrentSlot() {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 30_000);
        return () => clearInterval(t);
    }, []);
    return useMemo(() => {
        if (now < Date.parse(isoAt(RUN_OF_SHOW[0].at)) || now >= Date.parse(EVENT.endsAt)) {
            return null;
        }
        let current: string | null = null;
        for (const r of RUN_OF_SHOW) if (Date.parse(isoAt(r.at)) <= now) current = r.at;
        return current;
    }, [now]);
}

const SafetyPin = () => (
    <svg className="receipt__pin" viewBox="0 0 132 40" aria-hidden="true">
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 13 L104 9" stroke="#85827A" strokeWidth="3" />
            <path d="M22 27 L100 15" stroke="#5C5A54" strokeWidth="3" />
            <path d="M22 13 A7 7 0 1 0 22 27" stroke="#5C5A54" strokeWidth="3" />
            <circle cx="16" cy="20" r="3.2" stroke="#85827A" strokeWidth="2" />
            <path
                d="M98 4 H118 A7 7 0 0 1 118 18 H98 Z"
                fill="#E4E2DD"
                stroke="#383632"
                strokeWidth="2.2"
            />
            <path d="M101 8 H116" stroke="#FFFFFF" strokeWidth="1.6" />
        </g>
    </svg>
);

const Schedule = () => {
    const current = useCurrentSlot();
    const reduce = useReducedMotion();
    const receiptRef = useRef<HTMLDivElement>(null);
    const printed = useInView(receiptRef, { once: true, margin: "0px 0px -15% 0px" });

    return (
        <section id="schedule" className="section bg-shade-100">
            <div className="mx-auto grid max-w-6xl items-start gap-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-20">
                <div className="lg:sticky lg:top-24">
                    <SectionHeader
                        track="03"
                        file="schedule.rcpt"
                        title="the schedule"
                        dek={`${EVENT.day.toLowerCase()}, ${EVENT.date.toLowerCase()}. twelve hours, itemized.`}
                    />

                    <ul className="mt-10 max-w-md space-y-3 text-[13px] leading-relaxed text-shade-600">
                        <li className="flex gap-3">
                            <span aria-hidden="true">✦</span>
                            workshops run alongside hacking. drop in, drop out.
                        </li>
                        <li className="flex gap-3">
                            <span aria-hidden="true">✦</span>
                            times are pencilled in and may shift a little before the day.
                        </li>
                        <li className="flex gap-3">
                            <span aria-hidden="true">✦</span>
                            on the day, the line that&apos;s happening now gets highlighted.
                        </li>
                    </ul>

                    <a
                        href={CALENDAR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="receipt-link mt-9"
                    >
                        + add to google calendar
                    </a>
                </div>

                <div className="relative mx-auto w-full max-w-[400px]">
                    <SafetyPin />
                    <div className="receipt-shadow">
                        <div
                            ref={receiptRef}
                            className={`receipt ${printed || reduce ? "is-printed" : ""}`}
                        >
                            <p className="receipt__brand font-pixel">tidalBYTE&apos;26</p>
                            <p className="receipt__center">RECEIPTIFY · SIDE A</p>

                            <div className="receipt__meta">
                                <p>ORDER #1121 FOR: YOU ✦</p>
                                <p>{DATE_LINE}</p>
                                <p>
                                    {EVENT.room} · {EVENT.city.toUpperCase()}
                                </p>
                            </div>

                            <table className="receipt__table">
                                <thead>
                                    <tr>
                                        <th scope="col">QTY</th>
                                        <th scope="col">ITEM</th>
                                        <th scope="col">TIME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RUN_OF_SHOW.map((r, i) => (
                                        <tr
                                            key={r.item}
                                            className={r.at === current ? "is-now" : undefined}
                                        >
                                            <td>{String(i + 1).padStart(2, "0")}</td>
                                            <td>
                                                {r.item}
                                                {r.at === current && (
                                                    <span className="receipt__now"> ◀ now</span>
                                                )}
                                                {r.note && (
                                                    <span className="receipt__note">{r.note}</span>
                                                )}
                                            </td>
                                            <td>{timeLabel(r.at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <dl className="receipt__totals">
                                <div>
                                    <dt>ITEM COUNT:</dt>
                                    <dd>{RUN_OF_SHOW.length}</dd>
                                </div>
                                <div>
                                    <dt>TOTAL:</dt>
                                    <dd>{EVENT.hours}:00:00</dd>
                                </div>
                            </dl>

                            <div className="receipt__meta receipt__meta--card">
                                <p>CARD #: **** **** **** 2026</p>
                                <p>AUTH CODE: 112126</p>
                                <p>CARDHOLDER: YOU</p>
                            </div>

                            <p className="receipt__center receipt__thanks">
                                THANK YOU FOR HACKING!
                            </p>
                            <span className="barcode barcode--receipt" aria-hidden="true" />
                            <p className="receipt__center">f26.tidaltamu.com</p>
                        </div>
                    </div>

                    <Sticker
                        src={STICKER("bunny")}
                        width={84}
                        rotate={14}
                        delay={0.5}
                        className="absolute -right-2 -top-16 z-10 md:-right-12 md:top-10 md:[--sticker-w:104px]"
                    />
                    <Sticker
                        src={STICKER("cat")}
                        width={96}
                        rotate={-10}
                        delay={0.8}
                        className="absolute -bottom-12 -left-3 z-10 md:-left-28 md:bottom-20"
                    />
                </div>
            </div>
        </section>
    );
};

export default Schedule;
