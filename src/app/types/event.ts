export type EventType =
    | "assignment"
    | "exam"
    | "project"
    | "session" // regular class meeting
    | "holiday"
    | "deadline"
    | "quiz"
    | "reading"
    | "other";

export interface SyllabusEvent {
    id: string;
    title: string;
    date: string; // ISO date or date-time
    startTime?: string; // HH:mm (24h)
    endTime?: string; // HH:mm
    type: EventType;
    notes?: string;
    originalTypeRaw?: string; // free-form type string from LLM before mapping
    userContext?: {
        description?: string; // free-form user supplied context
        subject?: string; // legacy
        syllabusType?: string; // legacy
    };
    sourceFile?: string; // original filename
    recurrence?: {
        frequency: "weekly";
        interval?: number; // default 1
        byDay?: string[]; // e.g. ['MO','WE']
        until?: string; // YYYY-MM-DD
    };
    originalId?: string; // if this is an expanded instance
}

export interface ExtractionResult {
    events: SyllabusEvent[];
    warnings?: string[];
    rawText?: string;
}
