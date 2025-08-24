"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
    file: File | null;
}

export default function FilePreview({ file }: Props) {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    if (!file) return null;
    const isImage = /^image\//.test(file.type);
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);

    return (
        <div className="rounded-lg border border-foreground/15 dark:border-foreground/20 overflow-hidden bg-background-alt dark:bg-background-muted shadow-sm">
            <div className="px-3 py-2 flex items-center justify-between text-xs font-medium border-b border-foreground/10 dark:border-foreground/15 bg-background-muted dark:bg-background-alt">
                <span className="truncate">{file.name}</span>
                <span className="text-foreground-muted">
                    {(file.size / 1024).toFixed(1)} KB
                </span>
            </div>
            <div className="p-3 max-h-80 overflow-auto">
                {isImage && objectUrl && (
                    <Image
                        src={objectUrl}
                        alt="Uploaded preview"
                        width={600}
                        height={400}
                        className="mx-auto max-h-72 w-auto h-auto object-contain"
                    />
                )}
                {isPdf && objectUrl && (
                    <object
                        data={objectUrl}
                        type="application/pdf"
                        className="w-full h-72 rounded"
                        aria-label="PDF preview"
                    >
                        <p className="text-xs text-foreground-muted">
                            PDF preview not supported in this browser.
                        </p>
                    </object>
                )}
                {!isImage && !isPdf && (
                    <p className="text-xs text-foreground-muted">
                        Preview not available for this file type.
                    </p>
                )}
            </div>
        </div>
    );
}
