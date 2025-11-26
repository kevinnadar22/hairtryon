import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

// Error fallback component with navigation hooks
function ErrorFallback({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <div className="max-w-2xl w-full">
                <Card className="p-8 md:p-12">
                    <CardHeader className="px-0">
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="bg-destructive/10 p-6 rounded-full border border-destructive/20">
                                <AlertTriangle className="w-16 h-16 text-destructive" strokeWidth={1.5} />
                            </div>
                        </div>

                        <CardTitle className="text-4xl md:text-5xl text-center">
                            Oops! Something Went Wrong
                        </CardTitle>
                        <CardDescription className="text-lg text-center max-w-md mx-auto">
                            We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        {/* Error Details */}
                        <div className="bg-muted/50 border border-border rounded-lg p-6">
                            <p className="text-sm text-muted-foreground font-mono">
                                Try refreshing the page or navigating back to continue using the app.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="px-0 flex-col sm:flex-row gap-4">
                        <Button
                            onClick={onBack}
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </Button>
                        <Button
                            onClick={onHome}
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

// Wrapper component to use hooks with class component
function ErrorBoundaryWrapper({ children }: ErrorBoundaryProps) {

    const handleBack = () => {
        window.history.back();
    };

    const handleHome = () => {
        window.location.href = '/';
    };

    return (
        <ErrorBoundaryClass onBack={handleBack} onHome={handleHome}>
            {children}
        </ErrorBoundaryClass>
    );
}

// Class component for error boundary
class ErrorBoundaryClass extends React.Component<
    ErrorBoundaryProps & { onBack: () => void; onHome: () => void },
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps & { onBack: () => void; onHome: () => void }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so next render shows fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error details (could send to external service)
        console.error('Error captured by ErrorBoundary:', error, errorInfo);

        // You can also send to an error tracking service here
        // Example: logErrorToService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback onBack={this.props.onBack} onHome={this.props.onHome} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundaryWrapper;
