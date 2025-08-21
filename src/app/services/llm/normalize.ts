import { SyllabusEvent } from "../../types/event";
import { LLMEventSchema } from "./schema";

// Date normalization helpers
export function normalizeSlashDate(
    d: string,
    currentYear: number
): string | null {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const m = d.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
    if (!m) return null;
    const month = parseInt(m[1], 10);
    const day = parseInt(m[2], 10);
    let year = m[3] ? parseInt(m[3], 10) : currentYear;
    if (year < 100) year += 2000;
    try {
        const dt = new Date(year, month - 1, day);
        const now = new Date();
        if (dt.getTime() < now.getTime() - 30 * 24 * 60 * 60 * 1000) {
            year += 1;
        }
    } catch {}
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
}

export function parseNaturalDate(
    input: string,
    currentYear: number
): string | null {
    const trimmed = input.trim();
    const noWeekday = trimmed.replace(
        /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*,?\s+/i,
        ""
    );
    const monthNames: Record<string, number> = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
    };
    const m1 = noWeekday.match(
        /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:,\s*(\d{4}|\d{2}))?$/i
    );
    if (m1) {
        const month = monthNames[m1[1].toLowerCase()];
        const day = parseInt(m1[2], 10);
        let year = m1[3] ? parseInt(m1[3], 10) : currentYear;
        if (year < 100) year += 2000;
        const mm = String(month).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return `${year}-${mm}-${dd}`;
    }
    const parsed = Date.parse(noWeekday);
    if (!isNaN(parsed)) {
        const d = new Date(parsed);
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${d.getFullYear()}-${mm}-${dd}`;
    }
    return null;
}

export function mapType(raw?: string): SyllabusEvent["type"] {
    if (!raw) return "other";
    const r = raw.toLowerCase();
    if (/lecture|class|session/.test(r)) return "session";
    if (/exam|midterm|final/.test(r)) return "exam";
    if (/quiz/.test(r)) return "quiz";
    if (/holiday|break|no class/.test(r)) return "holiday";
    if (/project/.test(r)) return "project";
    if (/(assignment|hw|homework)/.test(r)) return "assignment";
    if (/reading/.test(r)) return "reading";
    if (/deadline|withdraw/.test(r)) return "deadline";
    return "other";
}

export function transformRawEvents(
    rawEvents: LLMEventSchema[],
    warnings: string[]
): SyllabusEvent[] {
    const currentYear = new Date().getFullYear();
    const normalizationWarnings: string[] = warnings;
    let skippedUndated = 0;
    const events: SyllabusEvent[] = rawEvents
        .map((e) => {
            const title = (e.title || "Untitled").toString();
            const rawDate = (
                e.date === null || e.date === undefined ? "" : e.date
            )
                .toString()
                .trim();
            const rawType = (
                e.type === null || e.type === undefined ? "" : e.type
            ).toString();
            const rawStart = (
                e.startTime === null ? "" : e.startTime || ""
            ).toString();
            const rawEnd = (
                e.endTime === null ? "" : e.endTime || ""
            ).toString();
            const rawNotes = (
                e.notes === null ? undefined : e.notes
            )?.toString();

            const chosen = mapType(rawType || title);
            const startCandidate =
                rawStart.toLowerCase() === "null" ? "" : rawStart;
            const endCandidate = rawEnd.toLowerCase() === "null" ? "" : rawEnd;
            const timeRegex = /^\d{1,2}:\d{2}$/;
            const normStart = timeRegex.test(startCandidate)
                ? startCandidate.padStart(5, "0")
                : undefined;
            const normEnd = timeRegex.test(endCandidate)
                ? endCandidate.padStart(5, "0")
                : undefined;

            let normDate: string | null = null;
            if (rawDate && rawDate.toLowerCase() !== "null") {
                normDate = normalizeSlashDate(rawDate, currentYear);
                if (!normDate)
                    normDate = parseNaturalDate(rawDate, currentYear);
            }
            if (!normDate) {
                skippedUndated += 1;
                return null; // skip
            }
            return {
                id: crypto.randomUUID(),
                title: title.slice(0, 120).trim(),
                date: normDate || rawDate,
                startTime: normStart,
                endTime: normEnd,
                type: chosen,
                originalTypeRaw: rawType || undefined,
                notes: rawNotes || undefined,
            } as SyllabusEvent;
        })
        .filter(
            (ev): ev is SyllabusEvent =>
                !!ev && /\d{4}-\d{2}-\d{2}/.test(ev.date)
        );
    if (skippedUndated) {
        normalizationWarnings.push(
            `Skipped ${skippedUndated} item(s) with missing/invalid date (model produced entries without a concrete date).`
        );
    }
    return events;
}
