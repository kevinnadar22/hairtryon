import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
    message?: string;
    size?: "sm" | "md" | "lg" | "fullscreen";
    variant?: "default" | "primary" | "secondary";
    className?: string;
    showMessage?: boolean;
    overlay?: boolean;
}

export default function Loading({
    message = "Loading...",
    size = "md",
    variant = "default",
    className,
    showMessage = true,
    overlay = false,
}: LoadingProps) {
    const spinnerSizes = {
        sm: "size-4",
        md: "size-8",
        lg: "size-12",
        fullscreen: "size-16",
    }[size];

    const textSizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        fullscreen: "text-lg",
    }[size];

    const variantStyles = {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
    }[variant];

    const containerStyles = {
        sm: "gap-2",
        md: "gap-3",
        lg: "gap-4",
        fullscreen: "gap-6",
    }[size];

    const content = (
        <div
            className={cn(
                "flex flex-col items-center justify-center",
                containerStyles,
                size === "fullscreen" && "min-h-screen",
                variantStyles,
                className
            )}
        >
            <Loader2 className={cn(spinnerSizes, "animate-spin")} />
            {showMessage && message && (
                <p
                    className={cn(
                        textSizes,
                        "font-medium text-muted-foreground animate-pulse"
                    )}
                >
                    {message}
                </p>
            )}
        </div>
    );

    if (overlay || size === "fullscreen") {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                {content}
            </div>
        );
    }

    return content;
}

// Additional spinner-only export for inline use
export function Spinner({
    size = "md",
    className,
}: {
    size?: "sm" | "md" | "lg";
    className?: string;
}) {
    const spinnerSizes = {
        sm: "size-4",
        md: "size-6",
        lg: "size-8",
    }[size];

    return <Loader2 className={cn(spinnerSizes, "animate-spin", className)} />;
}
