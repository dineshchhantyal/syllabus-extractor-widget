"use client";
import { SyllabusEvent } from "../../types/event";
import { useMemo } from "react";

interface Props {
    events: SyllabusEvent[];
    onEventClick?: (e: SyllabusEvent) => void;
}

export default function AgendaView({ events, onEventClick }: Props) {
    const grouped = useMemo(() => {
        const map: Record<string, SyllabusEvent[]> = {};
        for (const e of events
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))) {
            (map[e.date] ||= []).push(e);
        }
        return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
    }, [events]);

    if (!grouped.length)
        return <p className="text-sm text-neutral-500">No events.</p>;

    return (
        <div className="space-y-6">
            {grouped.map(([date, list]) => (
                <div key={date} className="space-y-2">
                    <div className="text-xs font-semibold tracking-wide text-neutral-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {new Date(date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                    <ul className="space-y-1">
                        {list
                            .sort((a, b) =>
                                (a.startTime || "").localeCompare(
                                    b.startTime || ""
                                )
                            )
                            .map((ev) => (
                                <li key={ev.id}>
                                    <button
                                        type="button"
                                        onClick={() => onEventClick?.(ev)}
                                        className="w-full text-left px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[color:rgba(var(--primary-rgb)/0.5)] hover:bg-primary-softer flex flex-col gap-1 transition"
                                    >
                                        <div className="flex items-center gap-2">
                                            {ev.startTime && (
                                                <span className="text-[11px] font-mono px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                                    {ev.startTime}
                                                </span>
                                            )}
                                            <span className="text-sm font-medium truncate">
                                                {ev.title}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary-soft text-[color:rgba(var(--primary-rgb)/0.85)] dark:text-[color:rgba(var(--primary-rgb)/0.9)] border border-[color:rgba(var(--primary-rgb)/0.3)]">
                                                {ev.type}
                                            </span>
                                        </div>
                                        {ev.notes && (
                                            <p className="text-[11px] text-neutral-500 line-clamp-2">
                                                {ev.notes}
                                            </p>
                                        )}
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
