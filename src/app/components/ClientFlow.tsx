"use client";
import { useState, useMemo } from "react";
import UploadForm from "./upload/UploadForm";
import EventList from "./events/EventList";
import ExportButton from "./export/ExportButton";
import ExportJSONButton from "./export/ExportJSONButton";
import { EVENT_TYPE_COLORS } from "../utils/colorMap";
import { extractSyllabusAction } from "../actions/extractSyllabus";
import { SyllabusEvent } from "../types/event";
import {
    detectWeeklyRecurrence,
    expandRecurring,
} from "../utils/detectRecurrence";
import FilePreview from "./file/FilePreview";
import Button from "./ui/Button";

export default function ClientFlow() {
    const [files, setFiles] = useState<File[]>([]);
    const [rawEvents, setRawEvents] = useState<SyllabusEvent[]>([]); // original extracted
    const [collapsedEvents, setCollapsedEvents] = useState<SyllabusEvent[]>([]); // with recurrence collapsed
    const [useExpanded, setUseExpanded] = useState(false);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showJson, setShowJson] = useState(false);
    const [announce, setAnnounce] = useState<string>("");
    const [processingIndex, setProcessingIndex] = useState<number | null>(null);
    const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

    async function handleFileSelected(f: File, meta: { context?: string }) {
        // queue file
        setFiles((prev) => [...prev, f]);
        setLoading(true);
        setProcessingIndex((prev) => (prev === null ? 0 : prev));
        try {
            const formData = new FormData();
            formData.append("file", f);
            if (meta.context) formData.append("context", meta.context);
            const result = await extractSyllabusAction(formData);
            const enriched = result.events.map((ev) => ({
                ...ev,
                userContext: { description: meta.context },
                sourceFile: f.name,
            }));
            setRawEvents((prev) => [...prev, ...enriched]);
            const collapsed = detectWeeklyRecurrence([
                ...rawEvents,
                ...enriched,
            ]);
            setCollapsedEvents(collapsed);
            setWarnings(result.warnings || []);
            setAnnounce(`Extraction complete for ${f.name}`);
            setActiveFileIndex(files.length); // newly added becomes active
        } catch (e) {
            console.error(e);
            setWarnings([`Extraction failed for ${f.name}`]);
            setAnnounce(`Extraction failed for ${f.name}`);
        } finally {
            setProcessingIndex((idx) => {
                if (idx === null) return null;
                const nextIdx = idx + 1;
                if (nextIdx >= files.length + 1) {
                    // +1 because files state updates after first add
                    setLoading(false);
                    return null;
                }
                return nextIdx;
            });
            setLoading(false);
        }
    }

    // Determine semester span from earliest and latest raw events
    const semesterRange = useMemo(() => {
        if (!rawEvents.length) return null;
        const dates = rawEvents
            .map((e) => new Date(e.date))
            .sort((a, b) => a.getTime() - b.getTime());
        return {
            start: dates[0].toISOString().split("T")[0],
            end: dates[dates.length - 1].toISOString().split("T")[0],
        };
    }, [rawEvents]);

    const expandedEvents = useMemo(() => {
        if (!semesterRange) return collapsedEvents;
        return expandRecurring(
            collapsedEvents,
            semesterRange.start,
            semesterRange.end
        );
    }, [collapsedEvents, semesterRange]);

    const activeEvents = useExpanded ? expandedEvents : collapsedEvents;

    function setActiveEvents(next: SyllabusEvent[]) {
        // If editing while expanded, propagate edits back to collapsed where possible
        if (useExpanded) {
            // Map by originalId/id to update base events
            const baseMap = new Map(collapsedEvents.map((e) => [e.id, e]));
            for (const ev of next) {
                const targetId = ev.originalId || ev.id;
                if (baseMap.has(targetId)) {
                    baseMap.set(targetId, {
                        ...baseMap.get(targetId)!,
                        ...ev,
                        id: targetId,
                    });
                }
            }
            const updatedCollapsed = Array.from(baseMap.values());
            setCollapsedEvents(updatedCollapsed);
        } else {
            setCollapsedEvents(next);
        }
    }

    return (
        <div className="space-y-10">
            <section>
                <UploadForm
                    onFileSelected={handleFileSelected}
                    isLoading={loading}
                />
                <div className="sr-only" aria-live="polite">
                    {announce}
                </div>
                {warnings.length > 0 && (
                    <ul className="mt-4 text-xs text-amber-600 list-disc list-inside">
                        {warnings.map((w) => (
                            <li key={w}>{w}</li>
                        ))}
                    </ul>
                )}
            </section>
            {files.length > 0 && (
                <div className="mt-4 text-xs text-neutral-500">
                    Processed {rawEvents.length} events from {files.length}{" "}
                    file(s)
                    {processingIndex !== null &&
                        loading &&
                        ` • Processing file ${processingIndex + 1}/${
                            files.length
                        }`}
                </div>
            )}
            {files.length > 0 && (
                <section className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="space-y-6 lg:col-span-1">
                        <div className="space-y-3">
                            <FilePreview
                                file={files[activeFileIndex] || null}
                            />
                            {files.length > 1 && (
                                <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 space-y-2">
                                    <div className="text-[10px] uppercase tracking-wide font-semibold text-neutral-400">
                                        Files
                                    </div>
                                    <ul className="space-y-1 max-h-48 overflow-auto pr-1">
                                        {files.map((f, i) => {
                                            const count = rawEvents.filter(
                                                (ev) => ev.sourceFile === f.name
                                            ).length;
                                            return (
                                                <li
                                                    key={f.name}
                                                    className={`group flex items-center gap-2 text-xs rounded px-2 py-1 border ${
                                                        i === activeFileIndex
                                                            ? "border-primary bg-primary-soft"
                                                            : "border-neutral-700 hover:border-neutral-600"
                                                    } transition`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setActiveFileIndex(
                                                                i
                                                            )
                                                        }
                                                        className="flex-1 text-left truncate"
                                                    >
                                                        {f.name}
                                                        <span className="ml-1 text-[10px] text-neutral-500">
                                                            ({count})
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        aria-label={`Remove file ${f.name}`}
                                                        className="text-neutral-500 hover:text-red-400 px-1"
                                                        onClick={() => {
                                                            if (
                                                                !confirm(
                                                                    `Remove file and its events?`
                                                                )
                                                            )
                                                                return;
                                                            setFiles((prev) =>
                                                                prev.filter(
                                                                    (_, idx) =>
                                                                        idx !==
                                                                        i
                                                                )
                                                            );
                                                            setRawEvents(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (ev) =>
                                                                            ev.sourceFile !==
                                                                            f.name
                                                                    )
                                                            );
                                                            setCollapsedEvents(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (ev) =>
                                                                            ev.sourceFile !==
                                                                            f.name
                                                                    )
                                                            );
                                                            if (
                                                                activeFileIndex ===
                                                                i
                                                            )
                                                                setActiveFileIndex(
                                                                    0
                                                                );
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="rounded-lg border border-foreground-muted dark:border-foreground bg-background-alt dark:bg-background-muted shadow-sm">
                            <div className="px-3 py-2 border-b border-foreground-muted dark:border-foreground text-xs font-semibold tracking-wide uppercase text-foreground-muted dark:text-foreground">
                                Workflow
                            </div>
                            <ol className="p-4 space-y-3 text-sm">
                                <li
                                    className={`flex flex-col gap-1 ${
                                        !rawEvents.length
                                            ? "opacity-100"
                                            : "opacity-60"
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium bg-primary text-on-primary">
                                            1
                                        </span>{" "}
                                        Upload syllabus
                                    </div>
                                    {!rawEvents.length && (
                                        <p className="text-[11px] text-foreground-muted dark:text-foreground">
                                            Drop or select your PDF/image to
                                            begin.
                                        </p>
                                    )}
                                </li>
                                <li
                                    className={`flex flex-col gap-1 ${
                                        rawEvents.length
                                            ? "opacity-100"
                                            : "opacity-60"
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium bg-primary text-on-primary">
                                            2
                                        </span>{" "}
                                        Review & edit events
                                    </div>
                                    {rawEvents.length && (
                                        <p className="text-[11px] text-foreground-muted dark:text-foreground">
                                            Click events in calendar to
                                            fine‑tune details.
                                        </p>
                                    )}
                                </li>
                                <li
                                    className={`flex flex-col gap-1 ${
                                        collapsedEvents.length
                                            ? "opacity-100"
                                            : "opacity-60"
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium bg-primary text-on-primary">
                                            3
                                        </span>{" "}
                                        Expand recurrence
                                    </div>
                                    {collapsedEvents.length && (
                                        <p className="text-[11px] text-foreground-muted dark:text-foreground">
                                            Toggle recurrence to see all
                                            sessions.
                                        </p>
                                    )}
                                </li>
                                <li
                                    className={`flex flex-col gap-1 ${
                                        collapsedEvents.length
                                            ? "opacity-100"
                                            : "opacity-60"
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium bg-primary text-on-primary">
                                            4
                                        </span>{" "}
                                        Export
                                    </div>
                                    {collapsedEvents.length && (
                                        <p className="text-[11px] text-foreground-muted dark:text-foreground">
                                            Download .ics or JSON for calendar
                                            import.
                                        </p>
                                    )}
                                </li>
                            </ol>
                        </div>
                        {false && (
                            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                                <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    <span>Debug JSON</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowJson((s) => !s)}
                                    >
                                        {showJson ? "Hide" : "Show"}
                                    </Button>
                                </div>
                                {showJson && (
                                    <pre className="p-3 text-[10px] max-h-56 overflow-auto whitespace-pre-wrap leading-relaxed text-neutral-600 dark:text-neutral-300">
                                        {JSON.stringify(activeEvents, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <h2 className="text-lg font-medium">
                                    Extracted Events
                                </h2>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <label className="relative group text-xs flex items-center gap-1 px-2 py-1 rounded bg-background-alt dark:bg-background-muted border border-foreground-muted dark:border-foreground text-foreground-muted dark:text-foreground">
                                        <input
                                            type="checkbox"
                                            className="scale-110"
                                            checked={useExpanded}
                                            onChange={(e) =>
                                                setUseExpanded(e.target.checked)
                                            }
                                        />
                                        Show repeated sessions
                                        <span className="hidden group-hover:block absolute -bottom-8 left-0 text-[10px] bg-background-muted text-foreground px-2 py-1 rounded shadow">
                                            Displays every occurrence of weekly
                                            patterns detected.
                                        </span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm("Clear all events?")) {
                                                setRawEvents([]);
                                                setCollapsedEvents([]);
                                                setFiles([]);
                                                setWarnings([]);
                                            }
                                        }}
                                        className="text-xs px-2 py-1 rounded bg-background-alt dark:bg-background-muted border border-foreground-muted dark:border-foreground text-foreground-muted dark:text-foreground hover:bg-background dark:hover:bg-background-alt"
                                    >
                                        Reset
                                    </button>
                                    <ExportButton events={activeEvents} />
                                    <ExportJSONButton events={activeEvents} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center text-[10px]">
                                {Object.entries(EVENT_TYPE_COLORS).map(
                                    ([k, v]) => (
                                        <span
                                            key={k}
                                            className={`px-2 py-0.5 rounded-md border text-[10px] font-medium tracking-wide inline-flex items-center gap-1 ${v.container} ${v.text} shadow-sm/50`}
                                            role="status"
                                            aria-label={`${k} event label`}
                                        >
                                            {k}
                                        </span>
                                    )
                                )}
                            </div>
                            <EventList
                                events={activeEvents}
                                onChange={setActiveEvents}
                            />
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
