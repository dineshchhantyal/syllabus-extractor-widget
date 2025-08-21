export const EVENT_TYPE_COLORS: Record<
    string,
    { container: string; text: string; badge?: string }
> = {
    session: {
        container:
            "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
        text: "text-blue-700 dark:text-blue-300",
    },
    assignment: {
        container:
            "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-300",
    },
    exam: {
        container:
            "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
        text: "text-rose-700 dark:text-rose-300",
    },
    quiz: {
        container:
            "bg-fuchsia-50 dark:bg-fuchsia-950/40 border-fuchsia-200 dark:border-fuchsia-800",
        text: "text-fuchsia-700 dark:text-fuchsia-300",
    },
    project: {
        container:
            "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
        text: "text-indigo-700 dark:text-indigo-300",
    },
    deadline: {
        container:
            "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800",
        text: "text-orange-700 dark:text-orange-300",
    },
    holiday: {
        container:
            "bg-lime-50 dark:bg-lime-950/40 border-lime-200 dark:border-lime-800",
        text: "text-lime-700 dark:text-lime-300",
    },
    reading: {
        container:
            "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800",
        text: "text-cyan-700 dark:text-cyan-300",
    },
    other: {
        container:
            "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-300",
    },
};

export function eventTypeClass(type: string) {
    const c = EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.other;
    return `${c.container} ${c.text}`;
}
