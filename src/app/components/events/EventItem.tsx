"use client";
import { SyllabusEvent } from "../../types/event";
import { validateEvent } from "../../utils/validateEvent";
import { useState } from "react";

interface Props {
    event: SyllabusEvent;
    onChange: (e: SyllabusEvent) => void;
    onDelete: () => void;
}

export default function EventItem({ event, onChange, onDelete }: Props) {
    const [errors, setErrors] = useState<string[]>([]);

    function update<K extends keyof SyllabusEvent>(
        key: K,
        value: SyllabusEvent[K]
    ) {
        const updated = { ...event, [key]: value };
        setErrors(validateEvent(updated));
        onChange(updated);
    }

    return (
        <div className="grid gap-2 sm:grid-cols-6 items-start border-b border-neutral-200 dark:border-neutral-800 py-3">
            <input
                className="sm:col-span-2 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800"
                value={event.title}
                onChange={(e) => update("title", e.target.value)}
            />
            <input
                type="date"
                className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800"
                value={event.date}
                onChange={(e) => update("date", e.target.value)}
            />
            <input
                placeholder="Start"
                className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800"
                value={event.startTime || ""}
                onChange={(e) => update("startTime", e.target.value)}
            />
            <input
                placeholder="End"
                className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800"
                value={event.endTime || ""}
                onChange={(e) => update("endTime", e.target.value)}
            />
            <select
                className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800"
                value={event.type}
                onChange={(e) =>
                    update("type", e.target.value as SyllabusEvent["type"])
                }
            >
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
                <option value="project">Project</option>
                <option value="other">Other</option>
            </select>
            <textarea
                placeholder="Notes"
                className="sm:col-span-6 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800"
                value={event.notes || ""}
                onChange={(e) => update("notes", e.target.value)}
            />
            {errors.length > 0 && (
                <div className="sm:col-span-6 text-xs text-red-600">
                    {errors.join(", ")}
                </div>
            )}
            <button
                type="button"
                onClick={onDelete}
                className="text-red-600 text-sm justify-self-start"
            >
                Delete
            </button>
        </div>
    );
}
