"use client";
import { SyllabusEvent } from "../../types/event";
import { useMemo } from "react";

interface Props {
    weekDate: string; // any date within week (ISO)
    events: SyllabusEvent[];
    onEventClick?: (e: SyllabusEvent) => void;
}

function startOfWeek(d: Date) {
    const day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
}
function addDays(d: Date, n: number) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
function iso(d: Date) {
    return d.toISOString().split("T")[0];
}

export default function WeekView({ weekDate, events, onEventClick }: Props) {
    const base = startOfWeek(new Date(weekDate));
    const days = Array.from({ length: 7 }, (_, i) => addDays(base, i));
    const eventsByDate = useMemo(() => {
        const m: Record<string, SyllabusEvent[]> = {};
        for (const e of events) {
            (m[e.date] ||= []).push(e);
        }
        for (const k in m)
            m[k].sort((a, b) =>
                (a.startTime || "").localeCompare(b.startTime || "")
            );
        return m;
    }, [events]);

    return (
        <div className="grid grid-cols-7 gap-px bg-neutral-300 dark:bg-neutral-700 rounded overflow-hidden text-xs">
            {days.map((d) => {
                const key = iso(d);
                const dayEvents = eventsByDate[key] || [];
                return (
                    <div
                        key={key}
                        className="min-h-40 bg-white dark:bg-neutral-900 p-1 flex flex-col gap-1"
                    >
                        <div className="text-[10px] font-semibold mb-1 flex items-center justify-between">
                            <span>
                                {d.toLocaleDateString(undefined, {
                                    weekday: "short",
                                })}
                            </span>
                            <span>{d.getDate()}</span>
                        </div>
                        <div className="flex flex-col gap-1 overflow-auto">
                            {dayEvents.map((ev) => (
                                <button
                                    key={ev.id}
                                    type="button"
                                    onClick={() => onEventClick?.(ev)}
                                    className="text-left rounded-md px-1.5 py-0.5 bg-primary-soft hover:bg-primary-softer border font-medium truncate border-[color:rgba(var(--primary-rgb)/0.3)] hover:border-[color:rgba(var(--primary-rgb)/0.45)]"
                                >
                                    {ev.startTime && (
                                        <span className="font-mono mr-1 opacity-70">
                                            {ev.startTime}
                                        </span>
                                    )}
                                    {ev.title}
                                </button>
                            ))}
                            {dayEvents.length === 0 && (
                                <div className="text-[10px] text-neutral-400 italic">
                                    —
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
