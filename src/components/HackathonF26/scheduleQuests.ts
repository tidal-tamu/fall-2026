import type { ScheduleEvent } from "../../schedule/events";

const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
});

const questStyles = [
    { tag: "required", kind: "main", icon: "star" },
    { tag: "food", kind: "food", icon: "fish" },
    { tag: "workshops", kind: "side", icon: "monster" },
] as const;

export function toScheduleQuest(event: ScheduleEvent) {
    const tags = event.tags.map(tag => tag.trim().toLowerCase());
    const style = questStyles.find(({ tag }) => tags.includes(tag));

    return {
        id: event.id,
        time: time.format(event.start),
        name: event.name,
        note: [event.location, event.description].filter(Boolean).join(" · "),
        kind: style?.kind,
        icon: style?.icon ?? "star",
    };
}

export type ScheduleQuest = ReturnType<typeof toScheduleQuest>;
