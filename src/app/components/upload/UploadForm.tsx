"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "../ui/Button";

interface Props {
    onFileSelected: (file: File, meta: { context?: string }) => void;
    isLoading?: boolean;
}

export default function UploadForm({ onFileSelected, isLoading }: Props) {
    const [error, setError] = useState<string | null>(null);
    const [contextText, setContextText] = useState("");
    const [pasteMode, setPasteMode] = useState(false);
    const [pasted, setPasted] = useState("");
    const onDrop = useCallback(
        (accepted: File[]) => {
            if (!accepted.length) return;
            accepted.forEach((file) => {
                if (!/(pdf|png|jpg|jpeg)$/i.test(file.name)) {
                    setError("Unsupported file type: " + file.name);
                    return;
                }
                setError(null);
                onFileSelected(file, { context: contextText || undefined });
            });
        },
        [onFileSelected, contextText]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    return (
        <div className="relative space-y-4">
            <div className="flex items-center gap-3 text-xs">
                <button
                    type="button"
                    onClick={() => setPasteMode(false)}
                    className={`px-3 py-1.5 rounded-md border transition ${
                        !pasteMode
                            ? "border-primary bg-primary-soft text-neutral-100"
                            : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    }`}
                >
                    Upload Files
                </button>
                <button
                    type="button"
                    onClick={() => setPasteMode(true)}
                    className={`px-3 py-1.5 rounded-md border transition ${
                        pasteMode
                            ? "border-primary bg-primary-soft text-neutral-100"
                            : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    }`}
                >
                    Paste Text
                </button>
                <span className="text-neutral-500">
                    No data stored server-side.
                </span>
            </div>
            {pasteMode && (
                <div className="rounded-xl border border-neutral-700 p-5 bg-neutral-900/50 space-y-3">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                        Raw Syllabus Text
                    </label>
                    <textarea
                        value={pasted}
                        onChange={(e) => setPasted(e.target.value)}
                        placeholder="Paste copied syllabus or table text here..."
                        className="w-full min-h-48 resize-y rounded-md px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb)/0.5)]"
                    />
                    <div className="text-left flex flex-col gap-1">
                        <label className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                            Context (optional)
                        </label>
                        <textarea
                            value={contextText}
                            onChange={(e) => setContextText(e.target.value)}
                            placeholder="e.g. CS101 Fall 2025 meets Mon/Wed 10:00-10:50; include exams, holidays, deadlines"
                            className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-sm min-h-20 resize-y"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            size="md"
                            variant="primary"
                            disabled={!pasted.trim() || isLoading}
                            loading={isLoading}
                            onClick={() => {
                                if (!pasted.trim()) return;
                                const blob = new Blob([pasted], {
                                    type: "text/plain",
                                });
                                const synthetic = new File(
                                    [blob],
                                    `pasted-${Date.now()}.txt`,
                                    { type: "text/plain" }
                                );
                                onFileSelected(synthetic, {
                                    context: contextText || undefined,
                                });
                                setPasted("");
                            }}
                        >
                            {isLoading ? "Processing…" : "Extract From Text"}
                        </Button>
                        {error && (
                            <span className="text-red-500 text-xs">
                                {error}
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Tip: Copy from a PDF viewer or LMS page. Line breaks for
                        each row/date improve accuracy. You can still refine and
                        delete events after extraction.
                    </p>
                </div>
            )}
            {isLoading && (
                <div className="absolute inset-0 rounded-xl bg-neutral-950/5 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-sm text-neutral-700 dark:text-neutral-200 flex items-center gap-2">
                        <span className="animate-pulse">Processing file…</span>
                    </div>
                </div>
            )}
            {!pasteMode && (
                <div
                    {...getRootProps()}
                    className={`group border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer relative overflow-hidden ${
                        isDragActive
                            ? "border-primary bg-primary-softer"
                            : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
                    } ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
                >
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                    <input {...getInputProps()} />
                    <div className="space-y-4">
                        <div className="text-left flex flex-col gap-1">
                            <label className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                                Context (optional)
                            </label>
                            <textarea
                                value={contextText}
                                onChange={(e) => setContextText(e.target.value)}
                                placeholder="Describe what the file(s) contain: e.g. 'Fall 2025 CS101 lecture schedule with weekly classes Mon/Wed 10-11, midterm in October, final exam first week of December' or 'Daily training camp agenda with sessions and breaks'"
                                className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm min-h-24 resize-y"
                            />
                            <p className="text-[11px] text-neutral-500 leading-relaxed">
                                This guidance helps the AI interpret ambiguous
                                dates (e.g. differentiate weekly lectures vs.
                                one-off events, identify midterms/finals, or
                                treat lines as session blocks). Leave blank if
                                unsure.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <p className="text-base font-medium">
                                Drag & drop syllabus files
                            </p>
                            <p className="text-xs text-neutral-500">
                                PDF, PNG or JPG • Multiple files supported •
                                Processed with Gemini
                            </p>
                            {error && (
                                <p className="text-red-600 text-xs font-medium">
                                    {error}
                                </p>
                            )}
                            <Button
                                type="button"
                                loading={isLoading}
                                size="md"
                                variant="primary"
                            >
                                {isLoading ? "Uploading…" : "Select Files"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
