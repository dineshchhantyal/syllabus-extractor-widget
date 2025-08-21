"use client";
import Button from "../ui/Button";
import { SyllabusEvent } from "../../types/event";
import { generateICS } from "../../utils/generateICS";

interface Props {
    events: SyllabusEvent[];
}

export default function ExportButton({ events }: Props) {
    function handleExport() {
        if (!events.length) return;
        try {
            const { filename, blob } = generateICS(events);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to export");
        }
    }
    return (
        <Button
            onClick={handleExport}
            disabled={!events.length}
            variant="secondary"
        >
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
                    <path d="M12 3v12" />
                    <path d="M8 11l4 4 4-4" />
                    <rect x="4" y="17" width="16" height="4" rx="1" />
                </svg>
                <span>.ics</span>
            </span>
        </Button>
    );
}
