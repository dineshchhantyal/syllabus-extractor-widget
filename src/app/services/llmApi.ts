import { ExtractionResult, SyllabusEvent } from "../types/event";
import { google } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";
import * as fs from "node:fs";
import * as path from "node:path";
import {
    buildSystemInstruction,
    responseSchema,
    LLMEventSchema,
    transformRawEvents,
    inferRoutineSessions,
} from "./llm";

/**
 * Extract events directly from an uploaded file (PDF or image) by sending a base64
 * representation to the Gemini model.
 */
export async function extractEventsFromFile(
    file: File,
    userContext?: {
        description?: string;
        subject?: string;
        syllabusType?: string;
    }
): Promise<ExtractionResult> {
    console.log(
        `[llmApi] Starting event extraction for file: ${file.name} (size: ${file.size} bytes, type: ${file.type})`
    );

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error(
            "[llmApi] Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable."
        );
        return {
            events: [],
            warnings: ["Missing GOOGLE_GENERATIVE_AI_API_KEY"],
            rawText: "",
        };
    }

    const arrayBuffer = await file.arrayBuffer();
    // Limit extremely large files (simple guard – real impl might chunk or reject)
    if (arrayBuffer.byteLength > 8 * 1024 * 1024) {
        // 8MB safeguard
        console.warn(
            `[llmApi] File is too large: ${arrayBuffer.byteLength} bytes.`
        );
        return { events: [], warnings: ["File too large (>8MB)"], rawText: "" };
    }
    const mime = file.type || "application/octet-stream";
    const fileBytes = new Uint8Array(arrayBuffer);
    const base64Data = Buffer.from(fileBytes).toString("base64");

    // Optional temp save (debugging only; auto-deletes on ephemeral fs in serverless)
    try {
        const tmpDir = "/tmp";
        if (fs.existsSync(tmpDir)) {
            const tmpPath = path.join(
                tmpDir,
                `upload-${Date.now()}-${file.name}`
            );
            fs.writeFileSync(tmpPath, fileBytes);
            console.log("[llmApi] Temp saved file at", tmpPath);
        }
    } catch (e) {
        console.warn("[llmApi] Failed temp save:", e);
    }

    // For images we can pass as an image content part. For PDFs we fall back to text extraction attempt later (TODO) – for now send as inlineData which Gemini can sometimes handle directly.
    const isImage = mime.startsWith("image/");

    const contextLines = [] as string[];
    if (userContext?.subject)
        contextLines.push(`Course/Subject: ${userContext.subject}`);
    if (userContext?.syllabusType)
        contextLines.push(`Syllabus Type: ${userContext.syllabusType}`);
    if (userContext?.description)
        contextLines.push(`User Context: ${userContext.description}`);
    const systemInstruction = buildSystemInstruction(contextLines);

    const model = google("gemini-2.5-flash");
    let structured: { events: LLMEventSchema[] } | null = null;
    const structuredWarnings: string[] = [];

    try {
        const { object } = await generateObject({
            model,
            schema: responseSchema,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: systemInstruction },
                        (isImage
                            ? { type: "image", image: base64Data }
                            : {
                                  type: "file",
                                  mediaType: mime,
                                  data: base64Data,
                              }) as
                            | { type: "image"; image: string }
                            | { type: "file"; mediaType: string; data: string },
                        { type: "text", text: "Produce events now." },
                    ],
                },
            ],
        });
        structured = object as { events: LLMEventSchema[] };
        console.log("[llmApi] Structured extraction succeeded.");
    } catch (e) {
        console.warn(
            "[llmApi] Structured extraction failed, retrying with fallback JSON prompt.",
            e
        );
        structuredWarnings.push(
            "Structured extraction failed; used fallback JSON mode."
        );
    }

    // Fallback path if structured failed: send classic JSON prompt using generateText
    if (!structured) {
        const fallbackPrompt = `Provide ONLY JSON {"events":[{"title":"","date":"YYYY-MM-DD","startTime":"HH:MM?","endTime":"HH:MM?","type":"assignment|exam|project|other","notes":""}]}. Remove question marks from times.`;
        const { text: fb } = await generateText({
            model,
            prompt: fallbackPrompt,
        });
        try {
            const cleaned = fb
                .replace(/```[a-zA-Z]*\n?|```/g, "")
                .replace(/,\s*([}\]])/g, "$1");
            structured = JSON.parse(cleaned);
        } catch (e) {
            console.error("[llmApi] Fallback parse failed.", e);
            return {
                events: [],
                warnings: ["Failed to extract events"],
                rawText: fb,
            };
        }
    }

    const rawEvents = structured?.events || [];
    const normalizationWarnings: string[] = [];
    let events: SyllabusEvent[] = transformRawEvents(
        rawEvents,
        normalizationWarnings
    );
    if (events.length) {
        events = inferRoutineSessions(events, normalizationWarnings);
    }
    const allWarnings = [...structuredWarnings, ...normalizationWarnings];
    return {
        events,
        rawText: "",
        warnings: allWarnings.length ? allWarnings : undefined,
    };
}
