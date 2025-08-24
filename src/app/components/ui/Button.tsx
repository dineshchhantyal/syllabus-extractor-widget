import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    iconLeft,
    iconRight,
    className = "",
    ...props
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants: Record<string, string> = {
        primary:
            "btn-primary text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgb(var(--ring-primary))]",
        secondary:
            "bg-background-alt dark:bg-background-muted text-foreground hover:bg-background-muted/70 dark:hover:bg-background-alt/40 border border-foreground/20 dark:border-foreground/20",
        ghost: "bg-transparent hover:bg-background-alt dark:hover:bg-background-muted text-foreground-muted dark:text-foreground-muted",
        danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500",
    };
    const sizes: Record<string, string> = {
        sm: "text-xs px-2.5 h-8 gap-1",
        md: "text-sm px-4 h-10 gap-2",
        lg: "text-base px-6 h-12 gap-2",
    };
    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            aria-busy={loading || undefined}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Spinner className="w-4 h-4" />}
            {!loading && iconLeft}
            <span className="truncate max-w-full">{children}</span>
            {!loading && iconRight}
        </button>
    );
}

function Spinner({ className = "" }: { className?: string }) {
    return (
        <svg
            className={`animate-spin text-current ${className}`}
            viewBox="0 0 24 24"
            fill="none"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );
}
