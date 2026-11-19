import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { EVENT } from "./components/HackathonF26/event";
import PixelCanvas from "./components/HackathonF26/PixelArt";
import { eventState, type ScheduleEvent } from "./schedule/events";
import { demoMode, useSchedule } from "./schedule/useSchedule";
import "./index.css";
import "./schedule/quest-log.css";

const timeZone = "America/Chicago";
const time = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" });
const date = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", month: "short", day: "numeric" });

// The optional fixed clock only applies when viewing local sample data.
const preview = new URLSearchParams(window.location.search).get("at");
const previewTime = demoMode && preview ? Date.parse(preview) : NaN;
function readClock() {
    return Number.isFinite(previewTime) ? previewTime : Date.now();
}

function EventRow({ event, state }: { event: ScheduleEvent; state: ReturnType<typeof eventState> }) {
    const current = state === "current";
    return (
        <li className={`quest-row ${state}`} aria-current={current ? "time" : undefined}>
            <div className="quest-time">
                {current && <small>Happening now</small>}
                {state === "next" && <small>Up next</small>}
                <time dateTime={new Date(event.start).toISOString()}>{time.format(event.start)}</time>
            </div>
            <div className="quest-name">
                <strong>{event.name}</strong>
                {current && event.description && <p>{event.description}</p>}
                {current && event.location && <p>{event.location}</p>}
            </div>
        </li>
    );
}

function SchedulePage() {
    const { events, failed } = useSchedule();
    const [now, setNow] = useState(readClock);
    const list = useRef<HTMLOListElement>(null);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(readClock()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    const next = events?.find(event => event.start > now);
    const current = events?.find(event => event.start <= now && now < event.end);
    const focusEvent = current ?? next ?? events?.[events.length - 1];

    // Center the active row when it changes. Visitors can still scroll through the day.
    useEffect(() => {
        const container = list.current;
        const row = container?.querySelector(".current, .next") ?? container?.lastElementChild;
        if (container && row instanceof HTMLElement) {
            container.scrollTop = row.offsetTop - (container.clientHeight - row.offsetHeight) / 2;
        }
    }, [focusEvent?.id, current?.id]);

    return (
        <main className="quest-screen">
            <div className="quest-clouds" aria-hidden="true">
                {[0, 1, 2, 3].map(i => <PixelCanvas key={i} sprite="cloud" width={16} height={16} />)}
            </div>
            <header className="quest-header">
                <a href="/" className="quest-brand">
                    <img src="/f26/pebble-caped.png" alt="" /> tidalBYTE ’26
                </a>
                <span className="quest-venue">{date.format(focusEvent?.start ?? Date.parse(EVENT.startsAt))} · {EVENT.room}</span>
                <span className="quest-clock">{time.format(now)} CT</span>
            </header>
            <section className="quest-panel" aria-labelledby="quest-title">
                <h1 id="quest-title">Quest Log</h1>
                {failed && <p role="status">{events ? "Refresh failed. Showing the last schedule received." : "Schedule temporarily unavailable."}</p>}
                {!failed && !events && <p role="status">Loading schedule…</p>}
                {events?.length === 0 && <p>No events have been published yet.</p>}
                {events && events.length > 0 && (
                    <ol ref={list} className="quest-list" tabIndex={0} aria-label="Full event schedule in Central time">
                        {events.map(event => (
                            <EventRow key={event.id} event={event} state={eventState(event, now, next?.start)} />
                        ))}
                    </ol>
                )}
            </section>
        </main>
    );
}

createRoot(document.getElementById("root")!).render(<SchedulePage />);
