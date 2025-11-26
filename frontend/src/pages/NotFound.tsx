import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const handleHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <div className="max-w-2xl w-full">
                <div className="rounded-lg bg-card border border-border p-8 md:p-12 space-y-8">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="bg-muted p-6 rounded-full border border-border">
                            <SearchX className="w-16 h-16 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-4">
                        <h1 className="text-6xl md:text-7xl font-bold text-foreground">
                            404
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                            Page Not Found
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto">
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-muted/50 border border-border rounded-lg p-6">
                        <p className="text-sm text-muted-foreground">
                            Check the URL for typos or navigate back to continue browsing.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </Button>
                        <Button
                            onClick={handleHome}
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
