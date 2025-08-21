import { SyllabusEvent } from "../types/event";

export function validateEvent(e: SyllabusEvent): string[] {
    const errors: string[] = [];
    if (!e.title.trim()) errors.push("Title is required");
    if (!e.date) errors.push("Date is required");
    // Simple date validation
    if (e.date && isNaN(Date.parse(e.date))) errors.push("Date is invalid");
    if (e.startTime && !/^\d{2}:\d{2}$/.test(e.startTime))
        errors.push("Start time invalid");
    if (e.endTime && !/^\d{2}:\d{2}$/.test(e.endTime))
        errors.push("End time invalid");
    return errors;
}
