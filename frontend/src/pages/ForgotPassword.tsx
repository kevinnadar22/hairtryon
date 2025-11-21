import React, { useState } from 'react';
import { FadeInTransition } from '@/components/ui/FadeInTransition';
import { TextAnimate } from '@/components/ui/text-animate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { api } from '@/api/client';
import { toast } from 'sonner';

const ForgotPassword: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const { mutate, isPending } = api.auth.forgotPasswordApiV1AuthForgotPasswordPost.useMutation(
        undefined, {
        onSuccess: () => {
            setSubmitted(true);
        },
        onError: (error) => {
            //@ts-ignore
            const msg = error?.detail?.[0]?.msg ?? error?.detail ?? 'Failed to send reset link';
            toast.error(msg);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('forgot-email') as string;
        mutate({ body: { email } });
    }

    return (
        <div className="min-h-screen w-full relative">
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(45deg, #ff9898ff 0%, #fec4c4ff 20%, #ffc7c7ff 40%, #ffe6e6ff 60%, #f6c6c6ff 80%, #fea5a5ff 100%)`,
                }}
            />

            <div className="w-full relative">
                <div className="grid md:grid-cols-1 gap-10 min-h-screen relative max-w-5xl mx-auto px-4 md:px-0">


                    <div className="flex items-center justify-center">
                        <Card className="w-full max-w-md shadow-lg">
                            <FadeInTransition>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl font-bold text-foreground mb-1">
                                        <TextAnimate animation="blurInUp">{submitted ? 'Check Your Email' : 'Reset Password'}</TextAnimate>
                                    </CardTitle>

                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {submitted ? (
                                        <div className="text-center space-y-4">
                                            <div className="text-6xl">📧</div>
                                            <p className="text-sm text-foreground/70">We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.</p>
                                            <Link to="/login" className="text-sm font-medium text-primary hover:underline">Back to login</Link>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mt-0 text-sm text-foreground/70">Enter the email associated with your account and we'll send a link to reset your password.</p>

                                            <form className="mt-2 space-y-4" aria-label="forgot-password-form" onSubmit={handleSubmit}>
                                                <div className="space-y-2">
                                                    <Label htmlFor="forgot-email">Email</Label>
                                                    <Input
                                                        id="forgot-email"
                                                        name="forgot-email"
                                                        type="email"
                                                        placeholder="you@company.com"
                                                        required
                                                    />

                                                </div>

                                                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                                    Send reset link {isPending ? '...' : ''}
                                                </Button>

                                                <div className="relative">
                                                    <Separator />
                                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-foreground/60">
                                                        or
                                                    </span>
                                                </div>

                                                <div className="text-center">
                                                    <Link to="/login" className="text-sm font-medium text-primary hover:underline">Back to login</Link>
                                                </div>

                                                <div className="mt-2 text-xs text-foreground/60">
                                                    We will send a password reset link to the provided email if it exists on our system.
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

export default ForgotPassword;
