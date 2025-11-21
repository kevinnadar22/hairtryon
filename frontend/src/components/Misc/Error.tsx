import { AlertCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorProps {
    message?: string;
    title?: string;
    variant?: "error" | "warning" | "info";
    size?: "sm" | "md" | "lg" | "fullscreen";
    onRetry?: () => void;
    onDismiss?: () => void;
    className?: string;
    showIcon?: boolean;
    retryText?: string;
    dismissText?: string;
}

export default function Error({
    message = "Something went wrong. Please try again.",
    title,
    variant = "error",
    size = "md",
    onRetry,
    onDismiss,
    className,
    showIcon = true,
    retryText = "Try Again",
    dismissText = "Dismiss",
}: ErrorProps) {
    const Icon = {
        error: XCircle,
        warning: AlertTriangle,
        info: AlertCircle,
    }[variant];

    const variantStyles = {
        error: "text-muted-foreground",
        warning: "text-muted-foreground",
        info: "text-muted-foreground",
    }[variant];

    const iconStyles = {
        error: "text-muted-foreground/40",
        warning: "text-muted-foreground/40",
        info: "text-muted-foreground/40",
    }[variant];

    const iconSizes = {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
        fullscreen: "size-16",
    }[size];

    return (
        <div className={cn(
            "flex items-center justify-center min-h-[400px] w-full py-10 px-4",
            className
        )}>
            <div className="flex flex-col items-center text-center max-w-md space-y-4">
                {showIcon && (
                    <Icon className={cn("shrink-0", iconSizes, iconStyles)} />
                )}
                <div className="space-y-2">
                    {title && (
                        <h3 className={cn(
                            "font-medium",
                            size === "sm" && "text-base",
                            size === "md" && "text-lg",
                            size === "lg" && "text-xl",
                            size === "fullscreen" && "text-2xl",
                            variantStyles
                        )}>
                            {title}
                        </h3>
                    )}
                    <p className={cn(
                        "text-muted-foreground/70",
                        size === "sm" && "text-xs",
                        size === "md" && "text-sm",
                        size === "lg" && "text-base",
                        size === "fullscreen" && "text-lg"
                    )}>
                        {message}
                    </p>
                </div>
                {(onRetry || onDismiss) && (
                    <div className="flex gap-3 pt-2">
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                variant="outline"
                                size={size === "fullscreen" ? "lg" : "default"}
                                className="gap-2"
                            >
                                <RefreshCw className="size-4" />
                                {retryText}
                            </Button>
                        )}
                        {onDismiss && (
                            <Button
                                onClick={onDismiss}
                                variant="ghost"
                                size={size === "fullscreen" ? "lg" : "default"}
                            >
                                {dismissText}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
