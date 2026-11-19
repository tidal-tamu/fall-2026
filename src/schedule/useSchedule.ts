import { useEffect, useState } from "react";
import { readSchedule, type ScheduleEvent } from "./events";

export const demoMode = import.meta.env.DEV && !import.meta.env.VITE_SCHEDULE_URL;
const scheduleUrl = demoMode ? "/schedule-demo.json" : import.meta.env.VITE_SCHEDULE_URL;

export function useSchedule() {
    const [events, setEvents] = useState<ScheduleEvent[] | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        let timer: number;

        async function refresh() {
            try {
                if (!scheduleUrl) throw new Error("Schedule URL is missing.");
                const response = await fetch(scheduleUrl, { signal: controller.signal, cache: "no-store" });
                if (!response.ok) throw new Error("Schedule request failed.");
                const items = readSchedule(await response.json());
                if (!controller.signal.aborted) {
                    setEvents(items);
                    setFailed(false);
                }
            } catch {
                if (!controller.signal.aborted) setFailed(true);
            } finally {
                if (!controller.signal.aborted) timer = window.setTimeout(refresh, 60_000);
            }
        }

        void refresh();
        return () => {
            controller.abort();
            window.clearTimeout(timer);
        };
    }, []);

    return { events, failed };
}
