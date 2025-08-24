import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default:
            "AI Syllabus to Calendar Converter | Export University Schedule to ICS",
        template: "%s | Syllabus Calendar AI",
    },
    description:
        "Convert any syllabus PDF or screenshot into calendar events. Extract lectures, exams, holidays, deadlines, readings & projects with AI and export to ICS or JSON.",
    keywords: [
        "syllabus calendar",
        "syllabus to ics",
        "academic schedule generator",
        "extract syllabus dates",
        "university timetable export",
        "AI syllabus parser",
    ],
    authors: [{ name: "Dinesh Chhantyal", url: "https://dineshchhantyal.com" }],
    creator: "Dinesh Chhantyal",
    publisher: "Dinesh Chhantyal",
    openGraph: {
        title: "AI Syllabus to Calendar Converter",
        description:
            "Upload a syllabus PDF or screenshot and instantly export all course dates to your calendar.",
        url: "https://dineshchhantyal.com",
        siteName: "Syllabus Calendar AI",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Syllabus to Calendar Converter",
        description:
            "Convert any syllabus PDF or screenshot into calendar events (lectures, exams, deadlines).",
        creator: "@dineshchhantyal",
    },
    metadataBase: new URL("https://dineshchhantyal.com"),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
            >
                <header className="w-full border-b border-foreground-muted bg-gradient-to-r from-[rgba(var(--primary-rgb)/0.15)] via-background to-[rgba(var(--primary-rgb)/0.15)] dark:from-[rgba(var(--primary-rgb)/0.12)] dark:via-background-muted dark:to-[rgba(var(--primary-rgb)/0.12)] backdrop-blur supports-[backdrop-filter]:bg-background-alt dark:supports-[backdrop-filter]:bg-background-muted z-10">
                    <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-6">
                        <Link
                            href="/"
                            className="text-sm font-semibold tracking-tight flex items-center gap-2 text-foreground"
                        >
                            <span
                                className="inline-block w-6 h-6 rounded-md bg-gradient-to-br from-[rgb(var(--primary-rgb))] to-[rgb(var(--primary-rgb-accent))] shadow-sm"
                                aria-hidden
                            />
                            <span>Syllabus Calendar AI</span>
                        </Link>
                        <nav className="flex items-center gap-4 text-xs font-medium">
                            <Link
                                href="/todo"
                                className="px-2 py-1 rounded hover:bg-primary-softer hover:text-[color:rgba(var(--primary-rgb)/0.9)] transition text-foreground-muted"
                            >
                                Roadmap
                            </Link>
                            <a
                                href="https://dineshchhantyal.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 rounded hover:bg-primary-softer hover:text-[color:rgba(var(--primary-rgb)/0.9)] transition text-foreground-muted"
                            >
                                Author
                            </a>
                        </nav>
                    </div>
                </header>
                <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
                    {children}
                </main>
                <footer className="mt-12 border-t border-foreground-muted py-6 text-center text-[11px] text-foreground-muted">
                    <p>
                        {" "}
                        Created by{" "}
                        <a
                            className="underline text-foreground"
                            href="https://dineshchhantyal.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Dinesh Chhantyal
                        </a>{" "}
                        ·{" "}
                        <Link
                            className="underline text-foreground"
                            href="/todo"
                        >
                            Roadmap
                        </Link>
                    </p>
                </footer>
                {/* Light mode intentionally deferred; forced dark theme. */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            name: "AI Syllabus to Calendar Converter",
                            applicationCategory: "Education",
                            operatingSystem: "Web",
                            url: "https://dineshchhantyal.com",
                            description:
                                "Convert syllabus PDFs and screenshots into calendar events (.ics) with AI.",
                            offers: {
                                "@type": "Offer",
                                price: "0",
                                priceCurrency: "USD",
                            },
                        }),
                    }}
                />
            </body>
        </html>
    );
}
