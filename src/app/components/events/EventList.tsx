"use client";
import { SyllabusEvent } from "../../types/event";
import { eventTypeClass, EVENT_TYPE_COLORS } from "../../utils/colorMap";
import EventItem from "./EventItem";
import CalendarView from "./CalendarView";
import WeekView from "./WeekView";
import AgendaView from "./AgendaView";
import { useState, useMemo } from "react";

interface Props {
    events: SyllabusEvent[];
    onChange: (events: SyllabusEvent[]) => void;
}

export default function EventList({ events, onChange }: Props) {
    const earliest = useMemo(
        () =>
            events.length
                ? events.slice().sort((a, b) => a.date.localeCompare(b.date))[0]
                      .date
                : undefined,
        [events]
    );
    const [view, setView] = useState<"calendar" | "list" | "week" | "agenda">(
        "calendar"
    );
    const [weekPivot, setWeekPivot] = useState(() => earliest);
    function updateEvent(index: number, e: SyllabusEvent) {
        const next = [...events];
        next[index] = e;
        onChange(next);
        updateById(e); // ensure usage path for lint; keeps state in sync if modal open
    }
    function deleteEvent(index: number) {
        const next = events.filter((_, i) => i !== index);
        onChange(next);
    }
    const [editing, setEditing] = useState<SyllabusEvent | null>(null);
    function updateById(updated: SyllabusEvent) {
        const idx = events.findIndex((e) => e.id === updated.id);
        if (idx !== -1) {
            const next = [...events];
            next[idx] = updated;
            onChange(next);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm flex-wrap">
                <button
                    type="button"
                    onClick={() => setView("calendar")}
                    className={`px-3 py-1 rounded ${
                        view === "calendar"
                            ? "bg-primary text-white"
                            : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                >
                    Month
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setWeekPivot(earliest);
                        setView("week");
                    }}
                    className={`px-3 py-1 rounded ${
                        view === "week"
                            ? "bg-primary text-white"
                            : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                >
                    Week
                </button>
                <button
                    type="button"
                    onClick={() => setView("agenda")}
                    className={`px-3 py-1 rounded ${
                        view === "agenda"
                            ? "bg-primary text-white"
                            : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                >
                    Agenda
                </button>
                <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`px-3 py-1 rounded ${
                        view === "list"
                            ? "bg-primary text-white"
                            : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                >
                    List
                </button>
            </div>
            {view === "list" && (
                <div className="space-y-4">
                    {events.map((e, i) => (
                        <EventItem
                            key={e.id}
                            event={e}
                            onChange={(ev) => updateEvent(i, ev)}
                            onDelete={() => deleteEvent(i)}
                        />
                    ))}
                    {events.length === 0 && (
                        <p className="text-sm text-neutral-500">
                            No events extracted yet.
                        </p>
                    )}
                </div>
            )}
            {view === "calendar" && (
                <CalendarView
                    events={events}
                    onChange={onChange}
                    initialFocusDate={earliest}
                    onEventClick={(e) => setEditing(e)}
                />
            )}
            {view === "week" && weekPivot && (
                <WeekView
                    weekDate={weekPivot}
                    events={events}
                    onEventClick={(e) => setEditing(e)}
                />
            )}
            {view === "agenda" && (
                <AgendaView
                    events={events}
                    onEventClick={(e) => setEditing(e)}
                />
            )}
            {editing && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Edit event"
                >
                    <div className="w-full max-w-lg rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral-500">
                                Edit Event
                            </h3>
                            <button
                                onClick={() => setEditing(null)}
                                aria-label="Close"
                                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                <span className="block w-4 h-4">✕</span>
                            </button>
                        </div>
                        <form
                            onSubmit={(ev) => {
                                ev.preventDefault();
                                setEditing(null);
                            }}
                            className="p-5 space-y-5 text-sm"
                        >
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500">
                                    Title
                                </label>
                                <input
                                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    value={editing.title}
                                    onChange={(e) => {
                                        const val = {
                                            ...editing,
                                            title: e.target.value,
                                        };
                                        setEditing(val);
                                        updateById(val);
                                    }}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-neutral-500">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        value={editing.date}
                                        onChange={(e) => {
                                            const val = {
                                                ...editing,
                                                date: e.target.value,
                                            };
                                            setEditing(val);
                                            updateById(val);
                                        }}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-neutral-500">
                                        Type
                                    </label>
                                    <div className="flex flex-wrap gap-1">
                                        {Object.keys(EVENT_TYPE_COLORS).map(
                                            (t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => {
                                                        const val = {
                                                            ...editing,
                                                            type: t as SyllabusEvent["type"],
                                                        };
                                                        setEditing(val);
                                                        updateById(val);
                                                    }}
                                                    className={`px-2 py-1 rounded-md border text-[11px] font-medium transition ${
                                                        editing.type === t
                                                            ? eventTypeClass(
                                                                  t
                                                              ) +
                                                              " ring-2 ring-offset-1 ring-primary/40 dark:ring-offset-neutral-900"
                                                            : "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-neutral-500">
                                        Start time
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        value={editing.startTime || ""}
                                        onChange={(e) => {
                                            const val = {
                                                ...editing,
                                                startTime: e.target.value,
                                            };
                                            setEditing(val);
                                            updateById(val);
                                        }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-neutral-500 flex items-center justify-between">
                                        End time
                                        <button
                                            type="button"
                                            className="text-[10px] underline ml-2"
                                            onClick={() => {
                                                if (editing.startTime) {
                                                    // quick add 50 minutes
                                                    const [h, m] =
                                                        editing.startTime
                                                            .split(":")
                                                            .map(Number);
                                                    const d = new Date();
                                                    d.setHours(h);
                                                    d.setMinutes(m + 50);
                                                    const hh = String(
                                                        d.getHours()
                                                    ).padStart(2, "0");
                                                    const mm = String(
                                                        d.getMinutes()
                                                    ).padStart(2, "0");
                                                    const val = {
                                                        ...editing,
                                                        endTime: `${hh}:${mm}`,
                                                    };
                                                    setEditing(val);
                                                    updateById(val);
                                                }
                                            }}
                                        >
                                            +50m
                                        </button>
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        value={editing.endTime || ""}
                                        onChange={(e) => {
                                            const val = {
                                                ...editing,
                                                endTime: e.target.value,
                                            };
                                            setEditing(val);
                                            updateById(val);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500">
                                    Notes
                                </label>
                                <textarea
                                    placeholder="Add contextual notes (optional)"
                                    className="w-full min-h-[80px] resize-y rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    value={editing.notes || ""}
                                    onChange={(e) => {
                                        const val = {
                                            ...editing,
                                            notes: e.target.value,
                                        };
                                        setEditing(val);
                                        updateById(val);
                                    }}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="px-4 py-2 rounded-md text-xs font-medium bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                                >
                                    Done
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
