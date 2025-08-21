import { SyllabusEvent } from "../types/event";

function isoToDate(iso: string): Date | null {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
}

function formatISO(d: Date): string {
    return d.toISOString().split("T")[0];
}

// Detect weekly patterns: events with same title & weekday spaced by 7 days.
export function detectWeeklyRecurrence(
    events: SyllabusEvent[]
): SyllabusEvent[] {
    const byTitle: Record<string, SyllabusEvent[]> = {};
    for (const e of events) {
        byTitle[e.title] = byTitle[e.title] || [];
        byTitle[e.title].push(e);
    }
    const result: SyllabusEvent[] = [];
    for (const [, list] of Object.entries(byTitle)) {
        if (list.length < 3) {
            // require at least 3 to consider recurrence
            result.push(...list);
            continue;
        }
        const sorted = list
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date));
        const dates = sorted
            .map((e) => isoToDate(e.date))
            .filter(Boolean) as Date[];
        const deltas = dates
            .slice(1)
            .map((d, i) => (d.getTime() - dates[i].getTime()) / 86400000);
        const weeklyLike = deltas.every((gap) => Math.abs(gap - 7) <= 1); // allow ±1 day drift
        if (!weeklyLike) {
            result.push(...sorted);
            continue;
        }
        // Consolidate into one recurring event; capture weekdays present.
        const byDay = Array.from(
            new Set(
                dates.map(
                    (d) =>
                        ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][d.getDay()]
                )
            )
        ).sort();
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        result.push({
            ...first,
            recurrence: {
                frequency: "weekly",
                interval: 1,
                byDay,
                until: formatISO(
                    last instanceof Date ? last : new Date(last.date)
                ),
            },
        });
    }
    return result;
}

// Expand recurring events into instances over a date range (inclusive)
export function expandRecurring(
    events: SyllabusEvent[],
    rangeStart: string,
    rangeEnd: string
): SyllabusEvent[] {
    const start = isoToDate(rangeStart)!;
    const end = isoToDate(rangeEnd)!;
    const out: SyllabusEvent[] = [];
    for (const e of events) {
        if (!e.recurrence) {
            out.push(e);
            continue;
        }
        if (e.recurrence.frequency !== "weekly") {
            out.push(e);
            continue;
        }
        const interval = e.recurrence.interval || 1;
        const until = e.recurrence.until ? isoToDate(e.recurrence.until) : end;
        const firstDate = isoToDate(e.date);
        if (!firstDate) continue;
        const byDaySet = new Set(e.recurrence.byDay || []);
        for (
            let d = new Date(start);
            d <= end;
            d = new Date(d.getTime() + 86400000)
        ) {
            if (d < firstDate) continue;
            if (until && d > until) break;
            // Check week alignment
            const weeksFromStart = Math.floor(
                (d.getTime() - firstDate.getTime()) / (7 * 86400000)
            );
            if (weeksFromStart < 0) continue;
            if (weeksFromStart % interval !== 0) continue;
            const code = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][d.getDay()];
            if (!byDaySet.has(code)) continue;
            out.push({
                ...e,
                id: `${e.id}-${formatISO(d)}`,
                date: formatISO(d),
                originalId: e.id,
            });
        }
    }
    return out;
}
