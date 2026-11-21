import { useEffect, useLayoutEffect, useRef, useState, type Ref } from "react";
import { createRoot } from "react-dom/client";
import TidalByteTitle from "./components/HackathonF26/TidalByteTitle";
import { cn, ui } from "./components/HackathonF26/ui";
import { eventState, type ScheduleEvent } from "./schedule/events";
import { demoMode, useSchedule } from "./schedule/useSchedule";
import "./index.css";
import "./schedule/quest-log.css";

const timeZone = "America/Chicago";
const time = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" });

// The optional fixed clock only applies when viewing local sample data.
const preview = new URLSearchParams(window.location.search).get("at");
const previewTime = demoMode && preview ? Date.parse(preview) : NaN;
function readClock() {
    return Number.isFinite(previewTime) ? previewTime : Date.now();
}

function EventRow({ event, state, rowRef }: {
    event: ScheduleEvent;
    state: ReturnType<typeof eventState>;
    rowRef?: Ref<HTMLLIElement>;
}) {
    const current = state === "current";
    return (
        <li ref={rowRef} className={`quest-row ${state}`} aria-current={current ? "time" : undefined}>
            <div className="quest-time">
                {current && <small>Happening now</small>}
                {state === "next" && <small>Up next</small>}
                <time dateTime={new Date(event.start).toISOString()}>{time.format(event.start)}</time>
            </div>
            <div className="quest-name">
                <strong>{event.name}</strong>
                {event.location && <p>{event.location}</p>}
                {current && event.description && <p>{event.description}</p>}
            </div>
        </li>
    );
}

function SchedulePage() {
    const { events, failed } = useSchedule();
    const [now, setNow] = useState(readClock);
    const list = useRef<HTMLOListElement>(null);
    const focusedRow = useRef<HTMLLIElement>(null);
    const hasCenteredRow = useRef(false);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(readClock()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    const next = events?.find(event => event.start > now);
    const current = events?.find(event => event.start <= now && now < event.end);
    const focusEvent = current ?? next ?? events?.[events.length - 1];

    // Center the active row when it changes. Visitors can still scroll through the day.
    useLayoutEffect(() => {
        const container = list.current;
        const row = focusedRow.current;
        if (!container || !row) {
            hasCenteredRow.current = false;
            return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        container.scrollTo({
            top: row.offsetTop - (container.clientHeight - row.offsetHeight) / 2,
            behavior: hasCenteredRow.current && !reduceMotion ? "smooth" : "auto",
        });
        hasCenteredRow.current = true;
    }, [focusEvent?.id, current?.id]);

    return (
        <main className={cn("quest-screen bg-game-sky text-game-ink", ui.focus)}>
            <header className="quest-header">
                <a href="/" className="quest-brand">
                    <TidalByteTitle />
                </a>
                <time className="quest-clock border-game-ink bg-game-light font-pixel tabular-nums" dateTime={new Date(now).toISOString()}>
                    {time.format(now)} CT
                </time>
            </header>
            <section className={cn(ui.window, "quest-panel")} aria-labelledby="quest-title">
                <h2 id="quest-title" className={cn(ui.windowTitle, "quest-title z-10 uppercase")}>Quest Log</h2>
                {failed && <p role="status">{events ? "Refresh failed. Showing the last schedule received." : "Schedule temporarily unavailable."}</p>}
                {!failed && !events && <p role="status">Loading schedule…</p>}
                {events?.length === 0 && <p>No events have been published yet.</p>}
                {events && events.length > 0 && (
                    <ol
                        ref={list}
                        className="quest-list"
                        tabIndex={0}
                        aria-label="Full event schedule in Central time"
                        onScroll={({ currentTarget }) => {
                            currentTarget.style.setProperty("--quest-scrolled", `${Math.max(0, currentTarget.scrollTop)}px`);
                        }}
                    >
                        {events.map(event => (
                            <EventRow
                                key={event.id}
                                event={event}
                                state={eventState(event, now, next?.start)}
                                rowRef={event.id === focusEvent?.id ? focusedRow : undefined}
                            />
                        ))}
                    </ol>
                )}
            </section>
        </main>
    );
}

createRoot(document.getElementById("root")!).render(<SchedulePage />);
