"use client";
import { useMemo, useState, useEffect } from "react";
import { SyllabusEvent } from "../../types/event";
import { eventTypeClass } from "../../utils/colorMap";

interface Props {
    events: SyllabusEvent[];
    onChange: (events: SyllabusEvent[]) => void;
    month?: number; // 0-11 optional preset
    year?: number; // optional preset
    initialFocusDate?: string; // YYYY-MM-DD to center calendar on
    onEventClick?: (event: SyllabusEvent) => void;
}

function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function formatISO(date: Date) {
    return date.toISOString().split("T")[0];
}

export default function CalendarView({
    events,
    onChange,
    month,
    year,
    initialFocusDate,
    onEventClick,
}: Props) {
    const today = new Date();
    const [cursor, setCursor] = useState(
        () =>
            new Date(year ?? today.getFullYear(), month ?? today.getMonth(), 1)
    );

    // When initialFocusDate changes, refocus month
    useEffect(() => {
        if (initialFocusDate) {
            const d = new Date(initialFocusDate);
            if (!isNaN(d.getTime())) {
                setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
            }
        }
    }, [initialFocusDate]);

    const weeks = useMemo(() => {
        const start = startOfMonth(cursor);
        const end = endOfMonth(cursor);
        const startWeekday = start.getDay();
        const days: Date[] = [];
        for (let i = 0; i < startWeekday; i++) {
            days.push(
                new Date(start.getTime() - (startWeekday - i) * 86400000)
            );
        }
        for (let d = 1; d <= end.getDate(); d++) {
            days.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
        }
        const trailing = 42 - days.length;
        for (let i = 1; i <= trailing; i++) {
            days.push(
                new Date(end.getFullYear(), end.getMonth(), end.getDate() + i)
            );
        }
        const grouped: Date[][] = [];
        for (let i = 0; i < days.length; i += 7)
            grouped.push(days.slice(i, i + 7));
        return grouped;
    }, [cursor]);

    function moveMonth(delta: number) {
        setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
    }

    function handleDrop(e: React.DragEvent, date: Date) {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/event-id");
        if (!id) return;
        const iso = formatISO(date);
        const next = events.map((ev) =>
            ev.id === id ? { ...ev, date: iso } : ev
        );
        onChange(next);
    }

    const eventsByDate = useMemo(() => {
        const map: Record<string, SyllabusEvent[]> = {};
        for (const ev of events) {
            if (!map[ev.date]) map[ev.date] = [];
            map[ev.date].push(ev);
        }
        return map;
    }, [events]);

    function drag(ev: React.DragEvent, id: string) {
        ev.dataTransfer.setData("text/event-id", id);
    }

    // centralized color mapping now via eventTypeClass

    return (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-[var(--background-alt)] dark:bg-neutral-900 shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background-muted)] dark:bg-neutral-800">
                <button
                    type="button"
                    onClick={() => moveMonth(-1)}
                    className="px-2 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                    aria-label="Previous month"
                >
                    ←
                </button>
                <h3 className="font-medium text-sm">
                    {cursor.toLocaleString(undefined, {
                        month: "long",
                        year: "numeric",
                    })}
                </h3>
                <button
                    type="button"
                    onClick={() => moveMonth(1)}
                    className="px-2 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                    aria-label="Next month"
                >
                    →
                </button>
            </div>
            <div className="hidden sm:grid grid-cols-7 text-xs font-medium border-b border-neutral-200 dark:border-neutral-700 bg-[var(--background-muted)] dark:bg-neutral-800">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="px-2 py-1 text-center">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-rows-6 grid-cols-7 text-[11px] sm:text-xs">
                {weeks.flat().map((day, i) => {
                    const inMonth = day.getMonth() === cursor.getMonth();
                    const iso = formatISO(day);
                    const dayEvents = eventsByDate[iso] || [];
                    return (
                        <div
                            key={i}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, day)}
                            className={`relative min-h-20 border border-neutral-200 dark:border-neutral-800 p-1 flex flex-col gap-1 ${
                                inMonth
                                    ? "bg-white dark:bg-neutral-950"
                                    : "bg-[var(--background-muted)] dark:bg-neutral-800 opacity-60"
                            }`}
                        >
                            <div className="text-right text-[10px] font-medium">
                                {day.getDate()}
                            </div>
                            <div className="flex flex-col gap-1 overflow-auto">
                                {dayEvents.map((ev) => (
                                    <div
                                        key={ev.id}
                                        draggable
                                        onDragStart={(e) => drag(e, ev.id)}
                                        onClick={() => onEventClick?.(ev)}
                                        className={`group rounded-md px-1.5 py-0.5 cursor-pointer select-none shadow-sm hover:shadow border text-[11px] leading-tight flex flex-col gap-0.5 transition ${eventTypeClass(
                                            ev.type
                                        )}`}
                                        title={ev.title}
                                        role="button"
                                        aria-label={`Event ${ev.title}`}
                                    >
                                        <span className="font-medium truncate block group-hover:underline underline-offset-2">
                                            {ev.title}
                                        </span>
                                        {ev.startTime && (
                                            <span className="text-[10px] opacity-70 font-mono">
                                                {ev.startTime}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
