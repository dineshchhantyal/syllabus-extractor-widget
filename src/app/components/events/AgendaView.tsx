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
        return <p className="text-sm text-foreground-muted">No events.</p>;

    return (
        <div className="space-y-6">
            {grouped.map(([date, list]) => (
                <div key={date} className="space-y-2">
                    <div className="text-xs font-semibold tracking-wide text-foreground-muted flex items-center gap-2">
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
                                        className="w-full text-left px-4 py-2.5 rounded-lg bg-background-alt dark:bg-background-muted border border-foreground/10 dark:border-foreground/20 hover:border-primary/60 hover:bg-background-muted/70 dark:hover:bg-background-alt/40 flex flex-col gap-1 transition focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {ev.startTime && (
                                                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-background dark:bg-background-alt border border-foreground/15 dark:border-foreground/25 text-foreground">
                                                    {ev.startTime}
                                                </span>
                                            )}
                                            <span className="text-sm font-medium truncate max-w-[50%] text-foreground">
                                                {ev.title}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md bg-primary-soft text-[color:rgba(var(--primary-rgb)/0.85)] dark:text-[color:rgba(var(--primary-rgb)/0.9)] border border-[color:rgba(var(--primary-rgb)/0.35)] font-semibold">
                                                {ev.type}
                                            </span>
                                        </div>
                                        {ev.notes && (
                                            <p className="text-[11px] text-foreground-muted line-clamp-2">
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
