import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/api/client";
import { toast } from "sonner";
import {
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const trxId = searchParams.get("payment_id");
    const [countdown, setCountdown] = useState(2);

    const { data, isLoading, error } =
        api.payments.getTransactionByIdApiV1PaymentsTransactionPaymentIdGet.useQuery(
            { path: { payment_id: trxId || "" } },
            {
                enabled: !!trxId,
                retry: 2,
            }
        );

    useEffect(() => {
        if (data?.status === "succeeded") {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate("/try");
                        toast.success(`${data.quantity} credits added to your account`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [data, navigate]);

    // Effect for error toast only once
    useEffect(() => {
        if (error || (data && data.status === "failed")) {
            toast.error("Payment verification failed", {
                description: "Please try again or contact support.",
            });
        }
    }, [error, data]);

    const renderContent = () => {
        if (!trxId) {
            return (
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <AlertCircle className="w-16 h-16 text-yellow-500" />
                    </div>
                    <h1 className="text-2xl font-bold">Invalid Request</h1>
                    <p className="text-muted-foreground">
                        No transaction ID found in the URL.
                    </p>
                    <Button onClick={() => navigate("/")}>Return Home</Button>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold">Verifying Payment</h1>
                    <p className="text-muted-foreground">
                        Please wait while we confirm your transaction...
                    </p>
                </div>
            );
        }

        if (data?.status === "succeeded") {
            return (
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex justify-center"
                    >
                        <CheckCircle className="w-20 h-20 text-green-500" />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Payment Successful!</h1>
                        <p className="text-muted-foreground">
                            {data?.quantity} credits have been added to your account.
                        </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg max-w-sm mx-auto">
                        <p className="text-sm font-medium">
                            Redirecting to studio in {countdown}s...
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/try")}
                        className="w-full max-w-sm group"
                    >
                        Go to Studio Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            );
        }

        if (error || data?.status === "failed") {
            return (
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <XCircle className="w-20 h-20 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Payment Failed</h1>
                        <p className="text-muted-foreground">
                            We couldn't verify your payment. Please try again or contact
                            support.
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => navigate("/")}>
                            Home
                        </Button>
                        <Button onClick={() => navigate("/pricing")}>Try Again</Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
                <h1 className="text-2xl font-bold">Unknown Status</h1>
                <p className="text-muted-foreground">
                    Transaction status: {data?.status || "Unknown"}
                </p>
                <Button onClick={() => navigate("/")}>Return Home</Button>
            </div>
        );
    };

    return (
        <div className="min-h-[80vh] flex items-start justify-center bg-background p-4 pt-20 md:pt-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 bg-card rounded-2xl shadow-lg border border-border"
            >
                {renderContent()}
            </motion.div>
        </div>
    );
}
