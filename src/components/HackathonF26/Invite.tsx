import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Sticker from "./Sticker";
import { EVENT, STICKER, fmtCentral } from "./event";

/* -------------------------------------------------------------------------- */
/*  The invite: an ADMIT ONE movie ticket (theme pitch, "acceptance ideas").   */
/*  The headline line types itself out the first time the ticket is in view.   */
/* -------------------------------------------------------------------------- */

const PHRASE = "you are invited!!!";

const month = fmtCentral(EVENT.startsAt, { month: "short" }).toUpperCase();
const day = fmtCentral(EVENT.startsAt, { day: "numeric" });
const year = fmtCentral(EVENT.startsAt, { year: "numeric" });
const doors = fmtCentral(EVENT.startsAt, { hour: "numeric", minute: "2-digit" });
const weekday = EVENT.day.toUpperCase();
const roomNumber = EVENT.room.replace(/\D/g, "");

const Invite = () => {
    const reduce = useReducedMotion();
    const [typed, setTyped] = useState(0);
    const ticketRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (reduce) {
            setTyped(PHRASE.length);
            return;
        }
        const el = ticketRef.current;
        if (!el) return;

        let timer: ReturnType<typeof setTimeout>;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                obs.disconnect();
                let i = 0;
                const tick = () => {
                    i += 1;
                    setTyped(i);
                    if (i < PHRASE.length) timer = setTimeout(tick, i < 4 ? 140 : 65);
                };
                timer = setTimeout(tick, 350);
            },
            { threshold: 0.55 },
        );
        obs.observe(el);
        return () => {
            obs.disconnect();
            clearTimeout(timer);
        };
    }, [reduce]);

    return (
        <section id="invite" className="section dot-grid">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    track="01"
                    file="invite.tix"
                    title="the invite"
                    dek="one day. one room. twelve hours of building. hold onto your stub."
                />

                {/* The sticker is a sibling of .ticket-shadow, not a child:
                    that wrapper's drop-shadow filter would outline it too. */}
                <div className="relative mx-auto mt-16 w-full max-w-[880px] md:mt-20">
                    <div className="ticket-shadow">
                        <article
                            ref={ticketRef}
                            className="ticket"
                            aria-label={`Admit one: tidalBYTE '26, ${EVENT.day}, ${EVENT.date}, ${EVENT.room}`}
                        >
                            <div className="ticket__main">
                                <p className="label !text-[9px] text-mid md:!text-[11px]">
                                    TIDAL @ TEXAS A&amp;M · PRESENTS
                                </p>

                                <p className="pixel-title font-pixel ticket__title">
                                    tidalBYTE
                                    <span aria-hidden="true" className="inline-block w-[0.4em]" />
                                    &apos;26
                                </p>

                                <p className="ticket__typed">
                                    <span className="sr-only">{PHRASE}</span>
                                    <span aria-hidden="true">{PHRASE.slice(0, typed)}</span>
                                    <span aria-hidden="true" className="caret" />
                                </p>

                                <dl className="ticket__facts">
                                    <div>
                                        <dt className="label">Date</dt>
                                        <dd>
                                            <span className="ticket__big">{day}</span>
                                            <span className="ticket__small">
                                                {month} · {year}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="label">Doors</dt>
                                        <dd>
                                            <span className="ticket__big">{doors.replace(/\s?[AP]M/, "")}</span>
                                            <span className="ticket__small">
                                                {doors.slice(-2)} · {weekday}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="label">Room</dt>
                                        <dd>
                                            <span className="ticket__big">{roomNumber}</span>
                                            <span className="ticket__small">MSC · TAMU</span>
                                        </dd>
                                    </div>
                                </dl>

                                <p className="ticket__fine">
                                    {EVENT.hours} hours · beginner friendly · built for freshmen &amp;
                                    sophomores · bring one (1) sleepy brain
                                </p>

                                {!EVENT.registrationOpen && (
                                    <span className="ticket__stamp" aria-hidden="true">
                                        Registration
                                        <br />
                                        opens soon
                                    </span>
                                )}
                            </div>

                            <div className="ticket__stub" aria-hidden="true">
                                <span className="ticket__admit font-pixel">ADMIT ONE</span>
                                <span className="ticket__serial">
                                    No. {year.slice(2)}
                                    {month}
                                    {day}
                                </span>
                                <span className="barcode" />
                            </div>
                        </article>
                    </div>

                    <Sticker
                        src={STICKER("pebble-bow")}
                        width={100}
                        rotate={12}
                        className="absolute -top-20 right-1 z-10 md:-top-16 md:right-[196px] md:[--sticker-w:140px]"
                    />
                </div>
            </div>
        </section>
    );
};

export default Invite;
