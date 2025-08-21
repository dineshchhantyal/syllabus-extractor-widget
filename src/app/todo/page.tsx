import React from "react";

export const metadata = {
    title: "Roadmap & TODO | Syllabus Calendar AI",
};

interface Item {
    title: string;
    detail: string;
    stage: "planned" | "in-progress" | "done" | "idea";
    priority: "high" | "med" | "low";
}

const items: Item[] = [
    {
        title: "Universal File Support & Validation",
        detail: "Accept and validate all major file types (PDF, image, text, docx, etc) with robust type/size/content checks.",
        stage: "planned",
        priority: "high",
    },
    {
        title: "Multimodal LLM Extraction",
        detail: "Leverage Gemini's multimodal capabilities for richer extraction: images, tables, OCR, layout, and context-aware parsing.",
        stage: "planned",
        priority: "high",
    },
    {
        title: "Multi-file Preview & Deletion",
        detail: "Gallery of uploaded files with inline preview and removal syncing associated events.",
        stage: "in-progress",
        priority: "med",
    },
    {
        title: "Light Mode Support",
        detail: "Implement polished accessible light theme using existing design tokens.",
        stage: "planned",
        priority: "med",
    },
    {
        title: "Advanced Recurrence (biweekly/monthly)",
        detail: "Support interval >1 patterns & monthly by day-of-week or date.",
        stage: "planned",
        priority: "high",
    },
    {
        title: "Timezone & Default Duration",
        detail: "User-selectable timezone, apply to ICS (VTIMEZONE) + default session length.",
        stage: "planned",
        priority: "high",
    },
    {
        title: "Bulk Select & Batch Edit",
        detail: "Multi-select events for type/date/time changes or delete.",
        stage: "planned",
        priority: "high",
    },
    {
        title: "Toggle Inferred Sessions",
        detail: "UI control to hide/show gap-filled session events.",
        stage: "planned",
        priority: "med",
    },
    {
        title: "Confidence Scoring",
        detail: "Surface AI certainty; flag low-confidence rows for review.",
        stage: "idea",
        priority: "med",
    },
    {
        title: "Topic Auto-Summarization",
        detail: "Summarize long topic text into concise titles; push full text to notes.",
        stage: "idea",
        priority: "low",
    },
    {
        title: "Export Filters",
        detail: "Allow exporting only assessments or only sessions.",
        stage: "idea",
        priority: "low",
    },
    {
        title: "Local Persistence",
        detail: "Persist events to localStorage/session to survive refresh.",
        stage: "planned",
        priority: "med",
    },
    {
        title: "User Accounts (Optional)",
        detail: "Auth + saving multiple syllabi collections.",
        stage: "idea",
        priority: "low",
    },
    {
        title: "Accessibility Audit",
        detail: "Formal pass with axe & keyboard trap checks.",
        stage: "planned",
        priority: "med",
    },
    {
        title: "Performance Profiling",
        detail: "Virtualize long event lists; measure extraction latency metrics.",
        stage: "idea",
        priority: "low",
    },
    {
        title: "ICS Description Enrichment",
        detail: "Include context + notes + originalTypeRaw in description.",
        stage: "planned",
        priority: "med",
    },
    {
        title: "Advanced PDF Multi-Column Handling",
        detail: "Pre-OCR layout segmentation for complex scanned syllabi.",
        stage: "idea",
        priority: "low",
    },
    {
        title: "Offline Mode Fallback",
        detail: "Queue uploads and sync when back online.",
        stage: "idea",
        priority: "low",
    },
    {
        title: "Analytics Opt-In",
        detail: "Anonymous usage patterns to guide features.",
        stage: "idea",
        priority: "low",
    },
];

const badgeColors: Record<Item["stage"], string> = {
    planned: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "in-progress":
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    idea: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300",
};

const priorityColors: Record<Item["priority"], string> = {
    high: "text-rose-600 dark:text-rose-400",
    med: "text-amber-600 dark:text-amber-400",
    low: "text-neutral-500 dark:text-neutral-400",
};

export default function RoadmapPage() {
    return (
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-fg dark:text-neutral-100">
                    Product Roadmap & Technical TODO
                </h1>
                <p className="text-sm text-fg-muted dark:text-neutral-400 max-w-2xl">
                    Planned enhancements and exploration ideas for improving
                    extraction accuracy, usability, performance, and
                    interoperability.
                </p>
            </header>
            <ul className="space-y-4">
                {items.map((item) => (
                    <li
                        key={item.title}
                        className="rounded-md border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900 shadow-sm flex flex-col gap-2"
                    >
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-medium text-sm flex-1">
                                {item.title}
                            </h2>
                            <span
                                className={`px-2 py-0.5 rounded text-[10px] font-medium border border-transparent ${
                                    badgeColors[item.stage]
                                }`}
                            >
                                {item.stage}
                            </span>
                            <span
                                className={`text-[11px] font-medium uppercase tracking-wide ${
                                    priorityColors[item.priority]
                                }`}
                            >
                                {item.priority}
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-fg-muted dark:text-neutral-400">
                            {item.detail}
                        </p>
                    </li>
                ))}
            </ul>
            <div className="text-[10px] text-fg-muted dark:text-neutral-500 pt-4">
                Have suggestions? Open an issue or reach out via{" "}
                <a
                    className="underline"
                    href="https://dineshchhantyal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    dineshchhantyal.com
                </a>
                .
            </div>
        </div>
    );
}
