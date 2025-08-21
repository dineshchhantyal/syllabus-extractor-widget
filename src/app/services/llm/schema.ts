import { z } from "zod";

// Looser schema (accepts null/"null" strings) to reduce model rejection; we sanitize later.
export const eventSchema = z.object({
    title: z.string().min(1).max(160),
    date: z.union([z.string(), z.null()]).optional(),
    startTime: z.union([z.string(), z.null()]).optional(),
    endTime: z.union([z.string(), z.null()]).optional(),
    type: z.union([z.string(), z.null()]).optional(),
    notes: z.union([z.string(), z.null()]).optional(),
});

export const responseSchema = z.object({ events: z.array(eventSchema) });
export type LLMEventSchema = z.infer<typeof eventSchema>;
