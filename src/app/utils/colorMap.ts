export const EVENT_TYPE_COLORS: Record<
    string,
    { container: string; text: string; badge?: string }
> = {
    session: {
        container:
            "bg-blue-100 dark:bg-blue-600 border-blue-200 dark:border-blue-500",
        text: "text-blue-800 dark:text-white",
    },
    assignment: {
        container:
            "bg-emerald-100 dark:bg-emerald-600 border-emerald-200 dark:border-emerald-500",
        text: "text-emerald-800 dark:text-white",
    },
    exam: {
        container:
            "bg-rose-100 dark:bg-rose-600 border-rose-200 dark:border-rose-500",
        text: "text-rose-800 dark:text-white",
    },
    quiz: {
        container:
            "bg-fuchsia-100 dark:bg-fuchsia-600 border-fuchsia-200 dark:border-fuchsia-500",
        text: "text-fuchsia-800 dark:text-white",
    },
    project: {
        container:
            "bg-indigo-100 dark:bg-indigo-600 border-indigo-200 dark:border-indigo-500",
        text: "text-indigo-800 dark:text-white",
    },
    deadline: {
        container:
            "bg-orange-100 dark:bg-orange-600 border-orange-200 dark:border-orange-500",
        text: "text-orange-800 dark:text-white",
    },
    holiday: {
        container:
            "bg-lime-100 dark:bg-lime-600 border-lime-200 dark:border-lime-500",
        text: "text-lime-800 dark:text-white",
    },
    reading: {
        container:
            "bg-cyan-100 dark:bg-cyan-600 border-cyan-200 dark:border-cyan-500",
        text: "text-cyan-800 dark:text-white",
    },
    other: {
        container:
            "bg-amber-100 dark:bg-amber-600 border-amber-200 dark:border-amber-500",
        text: "text-amber-800 dark:text-white",
    },
};

export function eventTypeClass(type: string) {
    const c = EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.other;
    return `${c.container} ${c.text}`;
}
