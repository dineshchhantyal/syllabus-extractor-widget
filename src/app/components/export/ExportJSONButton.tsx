"use client";
import Button from "../ui/Button";
import { SyllabusEvent } from "../../types/event";

interface Props {
    events: SyllabusEvent[];
}

export default function ExportJSONButton({ events }: Props) {
    function handle() {
        const blob = new Blob([JSON.stringify(events, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "syllabus-events.json";
        a.click();
        URL.revokeObjectURL(url);
    }
    return (
        <Button onClick={handle} disabled={!events.length} variant="secondary">
            <span className="inline-flex items-center gap-1">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-80"
                >
                    <path d="M4 4h16v16H4z" />
                    <path d="M8 8h8v8H8z" />
                </svg>
                <span>JSON</span>
            </span>
        </Button>
    );
}
