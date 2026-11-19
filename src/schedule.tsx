import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

type Event = { id: string; event_name: string; location: string; start_time: string; end_time: string };
const demo = import.meta.env.DEV && !import.meta.env.VITE_SCHEDULE_URL;
const url = import.meta.env.VITE_SCHEDULE_URL || (demo ? "/schedule-demo.json" : "");
const previewTime = demo ? Date.parse(new URLSearchParams(location.search).get("at") || "") : NaN;
const clock = () => Number.isFinite(previewTime) ? previewTime : Date.now();
const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" });
const day = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeZone: "America/Chicago" });

function rows(events: Event[]) {
    return events.map(e => <li key={e.id} className="border-b border-game-blue py-3">
        <strong>{e.event_name}</strong>
        <div>{time.format(Date.parse(e.start_time))} – {time.format(Date.parse(e.end_time))}{e.location && " · " + e.location}</div>
    </li>);
}

function SchedulePage() {
    const [events, setEvents] = useState<Event[] | null>(null);
    const [error, setError] = useState(false);
    const [now, setNow] = useState(clock);
    useEffect(() => {
        const controller = new AbortController();
        let timer: number;
        async function refresh() {
            try {
                if (!url) throw new Error();
                const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
                if (!response.ok) throw new Error();
                const body = await response.json();
                if (!Array.isArray(body.events)) throw new Error();
                const items: Event[] = body.events;
                if (!items.every(e => e && typeof e.event_name === "string" &&
                    Number.isFinite(Date.parse(e.start_time)) && Number.isFinite(Date.parse(e.end_time)))) throw new Error();
                setEvents(items.sort((a, b) => Date.parse(a.start_time) - Date.parse(b.start_time)));
                setError(false);
            } catch {
                if (!controller.signal.aborted) setError(true);
            } finally {
                if (!controller.signal.aborted) timer = window.setTimeout(refresh, 60000);
            }
        }
        void refresh();
        const tick = window.setInterval(() => setNow(clock()), 1000);
        return () => { controller.abort(); clearTimeout(timer); clearInterval(tick); };
    }, []);
    const current = events?.filter(e => Date.parse(e.start_time) <= now && now < Date.parse(e.end_time)) ?? [];
    const future = events?.filter(e => Date.parse(e.start_time) > now) ?? [];
    const next = future.filter(e => Date.parse(e.start_time) === Date.parse(future[0].start_time));
    const days = new Map<string, Event[]>();
    for (const event of events ?? []) {
        const date = day.format(Date.parse(event.start_time));
        if (!days.has(date)) days.set(date, []);
        days.get(date)!.push(event);
    }
    return <main className="min-h-screen bg-game-sky text-game-ink px-5 py-10">
        <div className="mx-auto max-w-3xl space-y-6">
            <a href="/" className="underline">← Fall homepage</a>
            <h1 className="font-pixel text-2xl">Event schedule</h1>
            <p>All times Central.{demo && " Showing demo events."}</p>
            {error && <p role="status">{events ? "Refresh failed. Showing the last schedule received." : "Schedule temporarily unavailable."}</p>}
            {!events && !error && <p>Loading schedule…</p>}
            {events?.length === 0 && <p>No events have been published yet.</p>}
            {!!events?.length && <>
                <section className="rounded-xl border-2 border-game-ink bg-game-cream p-5">
                    <h2 className="font-pixel text-sm">Happening now</h2>
                    {current.length ? <ul>{rows(current)}</ul> : <p className="mt-3">No event is running right now.</p>}
                </section>
                <section className="rounded-xl border-2 border-game-ink bg-game-window p-5">
                    <h2 className="font-pixel text-sm">Up next</h2>
                    {next.length ? <><p className="mt-3">{day.format(Date.parse(next[0].start_time))}</p><ul>{rows(next)}</ul></> : <p className="mt-3">No upcoming events.</p>}
                </section>
                <h2 className="font-pixel text-sm">Full schedule</h2>
                {[...days].map(([date, items]) => <section key={date}><h3 className="font-bold">{date}</h3><ul>{rows(items)}</ul></section>)}
            </>}
        </div>
    </main>;
}

createRoot(document.getElementById("root")!).render(<SchedulePage />);
