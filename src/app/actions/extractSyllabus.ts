"use server";
import { extractEventsFromFile } from "../services/llmApi";
import { ExtractionResult } from "../types/event";

export async function extractSyllabusAction(
    formData: FormData
): Promise<ExtractionResult> {
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
        return { events: [], warnings: ["No file uploaded"] };
    }
    const subject = formData.get("subject")?.toString();
    const syllabusType = formData.get("syllabusType")?.toString();
    const description = formData.get("context")?.toString();
    return extractEventsFromFile(file, { description, subject, syllabusType });
}
