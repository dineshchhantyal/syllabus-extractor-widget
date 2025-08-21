import { createEvents } from "ics";
import { SyllabusEvent } from "../types/event";

export function generateICS(events: SyllabusEvent[]): {
    filename: string;
    blob: Blob;
} {
    const mapped = events.map((e) => {
        const dateObj = new Date(
            e.date + (e.startTime ? "T" + e.startTime + ":00" : "T09:00:00")
        );
        const endObj = new Date(dateObj.getTime() + 60 * 60 * 1000);
        const start: [number, number, number, number, number] = [
            dateObj.getFullYear(),
            dateObj.getMonth() + 1,
            dateObj.getDate(),
            dateObj.getHours(),
            dateObj.getMinutes(),
        ];
        const end: [number, number, number, number, number] = [
            endObj.getFullYear(),
            endObj.getMonth() + 1,
            endObj.getDate(),
            endObj.getHours(),
            endObj.getMinutes(),
        ];
        const rrule =
            e.recurrence && e.recurrence.frequency === "weekly"
                ? {
                      recurrenceRule:
                          `FREQ=WEEKLY;INTERVAL=${e.recurrence.interval || 1}` +
                          (e.recurrence.byDay && e.recurrence.byDay.length
                              ? `;BYDAY=${e.recurrence.byDay.join(",")}`
                              : "") +
                          (e.recurrence.until
                              ? `;UNTIL=${e.recurrence.until.replace(
                                    /-/g,
                                    ""
                                )}T235959Z`
                              : ""),
                  }
                : {};
        return {
            title: e.title,
            start,
            end,
            description: e.notes || "",
            categories: [e.type] as string[],
            ...rrule,
        };
    });

    const { error, value } = createEvents(mapped);
    if (error || !value) {
        throw error || new Error("Failed to generate ICS");
    }
    return {
        filename: "syllabus-events.ics",
        blob: new Blob([value], { type: "text/calendar" }),
    };
}
