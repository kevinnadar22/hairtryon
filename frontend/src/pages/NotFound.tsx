import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card,  CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, ArrowLeft} from 'lucide-react';

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
                <Card className="p-8 md:p-12">
                    <CardHeader className="px-0">
                        <CardTitle className="text-6xl md:text-7xl text-center">
                            404
                        </CardTitle>
                        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
                            Page Not Found
                        </h2>
                        <CardDescription className="text-lg text-center max-w-md mx-auto">
                            The page you're looking for doesn't exist or has been moved.
                        </CardDescription>
                    </CardHeader>

                    <CardFooter className="px-0 flex-col items-center justify-center sm:flex-row gap-4">
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
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
