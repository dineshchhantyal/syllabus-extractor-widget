import ThemeSwitcher from "./components/ui/ThemeSwitcher";
import ClientFlow from "./components/ClientFlow";

export default function Home() {
    return (
        <main className="max-w-5xl mx-auto px-6 py-10 w-full">
            <Header />
            <ClientFlow />
        </main>
    );
}

function Header() {
    return (
        <div className="mb-10 relative overflow-hidden rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-[rgba(var(--primary-rgb)/0.08)] via-[rgba(var(--primary-rgb)/0.02)] to-[rgba(var(--primary-rgb)/0.1)]">
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2 max-w-xl">
                    <h1 className="text-4xl font-semibold tracking-tight text-fg dark:text-neutral-100">
                        Syllabus <span className="text-primary">Scraper</span>
                    </h1>
                    <p className="text-sm leading-relaxed text-fg-muted dark:text-neutral-400">
                        Transform static syllabi into actionable calendar
                        timelines. Upload, refine recurring sessions, and export
                        straight into your planner.
                    </p>
                </div>
                <ThemeSwitcher />
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.6),transparent_60%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_60%)]" />
        </div>
    );
}
