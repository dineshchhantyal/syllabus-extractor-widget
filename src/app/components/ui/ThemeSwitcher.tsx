"use client";
import { useEffect } from "react";

export default function ThemeSwitcher() {
    // Force dark theme on mount
    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);
    return (
        <div className="text-[11px] px-2 py-1 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 select-none">
            Dark theme
        </div>
    );
}
