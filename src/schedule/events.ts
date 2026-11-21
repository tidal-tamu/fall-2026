export interface ScheduleEvent {
    id: string;
    name: string;
    location: string;
    description: string;
    tags: string[];
    start: number;
    end: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function parseEvent(value: unknown): ScheduleEvent {
    if (!isRecord(value) || typeof value.id !== "string" || typeof value.event_name !== "string" ||
        typeof value.start_time !== "string" || typeof value.end_time !== "string") {
        throw new Error("Schedule event is missing required fields.");
    }

    const start = Date.parse(value.start_time);
    const end = Date.parse(value.end_time);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
        throw new Error("Invalid schedule event time.");
    }

    return {
        id: value.id,
        name: value.event_name,
        location: typeof value.location === "string" ? value.location : "",
        description: typeof value.description === "string" ? value.description : "",
        tags: Array.isArray(value.tags) ? value.tags.filter((tag): tag is string => typeof tag === "string") : [],
        start,
        end,
    };
}

export function readSchedule(body: unknown): ScheduleEvent[] {
    if (!isRecord(body)) throw new Error("Expected a schedule response.");

    // Harp wraps its list in data.schedule. Our existing proxy returns events.
    const items = isRecord(body.data) ? body.data.schedule : body.events;
    if (!Array.isArray(items)) throw new Error("Missing schedule list.");
    return items.map(parseEvent).sort((a, b) => a.start - b.start);
}

export function eventState(event: ScheduleEvent, now: number, nextStart?: number) {
    if (now >= event.end) return "past";
    if (now >= event.start) return "current";
    if (event.start === nextStart) return "next";
    return "later";
}
