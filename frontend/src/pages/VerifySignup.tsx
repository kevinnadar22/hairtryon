import React, { useState, useEffect } from "react";
import { FadeInTransition } from "@/components/ui/FadeInTransition";
import { TextAnimate } from "@/components/ui/text-animate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { api } from "@/api/client";
import { getErrorMessage } from "@/utils";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const VerifySignup: React.FC = () => {
    const token = new URLSearchParams(window.location.search).get('token') || '';

    const [error, setError] = useState<string | null>(null);
    const [otp, setOtp] = useState("");
    const { login } = useGoogleAuth();

    const { mutate: verifyToken, isPending: isVerifyingToken } = api.auth.verifyCodeTokenApiV1AuthVerifyCodeTokenPost.useMutation(
        undefined,
        {
            onError: (err) => {
                setError(getErrorMessage(err) || "An error occurred while verifying your email.");
            },
            onSuccess: (data) => {
                if (!data.valid) {
                    setError("Invalid or expired verification link");
                } else {
                    setError(null);
                }
            }
        }
    )

    const { mutate: verifyOtp, isPending: isVerifyingOtp } = api.auth.verifySignupApiV1AuthVerifySignupPost.useMutation(
        undefined,
        {
            onSuccess: () => {
                toast.success("Email verified successfully.");
                login();
            },
            onError: (err) => {
                const msg = getErrorMessage(err, "Failed to verify email");
                toast.error(msg);
            }
        }
    );

    useEffect(() => {
        if (!token) {
            setError("Invalid verification link");
            return;
        }
        verifyToken({ body: { token } });
    }, [token, verifyToken]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("Please enter the 6-digit code");
            return;
        }
        verifyOtp({ body: { token, code: otp } });
    };


    return (
        <div className="min-h-screen w-full relative">
            <div
                className="absolute inset-0 z-0"
                style={{
                    background:
                        "linear-gradient(45deg, #ff9898ff 0%, #fec4c4ff 20%, #ffc7c7ff 40%, #ffe6e6ff 60%, #f6c6c6ff 80%, #fea5a5ff 100%)",
                }}
            />
            <div className="w-full relative">
                <div className="grid md:grid-cols-1 gap-10 min-h-screen relative max-w-5xl mx-auto px-4 md:px-0">
                    <div className="flex items-center justify-center">
                        <Card className="w-full max-w-md shadow-lg">
                            <FadeInTransition>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl font-bold text-foreground mb-1">
                                        <TextAnimate animation="blurInUp">Verify Email</TextAnimate>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 flex flex-col items-center justify-center">
                                    {isVerifyingToken ? (
                                        <div className="text-center space-y-4 flex flex-col items-center justify-center">
                                            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                                            <p className="text-sm text-foreground/70 text-center">Verifying code...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="text-center space-y-4 flex flex-col items-center justify-center">
                                            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                                            <p className="text-sm text-foreground/70 text-center">{error}</p>
                                            <Link to="/login" className="text-sm font-medium text-primary hover:underline">Back to login</Link>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mt-0 text-sm text-foreground/70 text-center">Enter the 6-digit code sent to your email.</p>
                                            <form className="mt-2 space-y-4 flex flex-col items-center justify-center w-full" aria-label="verify-email-form" onSubmit={handleSubmit}>
                                                <div className="space-y-2 w-full flex flex-col items-center justify-center">
                                                    <div className="flex justify-center w-full">
                                                        <InputOTP
                                                            maxLength={6}
                                                            value={otp}
                                                            onChange={setOtp}
                                                            id="otp"
                                                            name="otp"
                                                            required
                                                        >
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={0} />
                                                                <InputOTPSlot index={1} />
                                                                <InputOTPSlot index={2} />
                                                            </InputOTPGroup>
                                                            <InputOTPSeparator />
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={3} />
                                                                <InputOTPSlot index={4} />
                                                                <InputOTPSlot index={5} />
                                                            </InputOTPGroup>
                                                        </InputOTP>
                                                    </div>
                                                </div>
                                                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isVerifyingToken || isVerifyingOtp}>
                                                    {isVerifyingToken || isVerifyingOtp ? "Verifying..." : "Verify Email"}
                                                </Button>
                                                <div className="relative w-full flex justify-center">
                                                    <Separator />
                                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-foreground/60 text-center">
                                                        or
                                                    </span>
                                                </div>
                                                <div className="text-center w-full">
                                                    <Link to="/login" className="text-sm font-medium text-primary hover:underline">Back to login</Link>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </CardContent>
                            </FadeInTransition>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifySignup;
