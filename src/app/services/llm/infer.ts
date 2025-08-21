import { SyllabusEvent } from "../../types/event";

// Infer routine sessions between min/max dates based on dominant weekdays
export function inferRoutineSessions(
    events: SyllabusEvent[],
    warnings: string[]
): SyllabusEvent[] {
    const sessionDates = events
        .filter((e) => e.type === "session")
        .map((e) => e.date)
        .sort();
    if (sessionDates.length < 3) return events;
    const counts: Record<number, number> = {};
    for (const d of sessionDates) {
        const wd = new Date(d).getDay();
        counts[wd] = (counts[wd] || 0) + 1;
    }
    const dominant = Object.entries(counts)
        .filter(([, c]) => c >= 2)
        .map(([d]) => parseInt(d, 10));
    if (!dominant.length) return events;
    const minDate = new Date(sessionDates[0]);
    const maxDate = new Date(sessionDates[sessionDates.length - 1]);
    const existingSet = new Set(sessionDates);
    const inferred: SyllabusEvent[] = [];
    for (let t = minDate.getTime(); t <= maxDate.getTime(); t += 86400000) {
        const dt = new Date(t);
        if (dominant.includes(dt.getDay())) {
            const iso = dt.toISOString().split("T")[0];
            if (!existingSet.has(iso)) {
                inferred.push({
                    id: crypto.randomUUID(),
                    title: "Lecture / Session",
                    date: iso,
                    type: "session",
                    notes: "Inferred session (pattern fill)",
                    originalTypeRaw: "inferred",
                });
                existingSet.add(iso);
            }
        }
    }
    if (inferred.length)
        warnings.push(
            `Added ${inferred.length} inferred session(s) to fill schedule gaps.`
        );
    return [...events, ...inferred].sort((a, b) =>
        a.date.localeCompare(b.date)
    );
}
