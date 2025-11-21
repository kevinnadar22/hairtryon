import React, { useState, useEffect } from 'react';
import { FadeInTransition } from '@/components/ui/FadeInTransition';
import { TextAnimate } from '@/components/ui/text-animate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/api/client';
import { cleanPath, getErrorMessage } from '@/utils';


const ResetPassword: React.FC = () => {
    const [initialError, setInitialError] = useState<string | null>(null);
    const token = new URLSearchParams(window.location.search).get('token') || '';
    const navigate = useNavigate();

    const { mutate: verifyToken, isPending: isVerifying } = api.auth.verifyResetTokenApiV1AuthVerifyResetTokenPost.useMutation(
        undefined,
        {
            onError: (error) => {
                const msg = getErrorMessage(error, 'Invalid or expired token');
                setInitialError(msg);
            },
            onSuccess: (data) => {
                if (!data.valid) {
                    setInitialError('Invalid or expired token');
                } else {
                    setInitialError(null);
                }
            }
        }
    );

    const { mutate: resetPassword, isPending: isResetting } = api.auth.resetPasswordApiV1AuthResetPasswordPost.useMutation(
        undefined,
        {
            onError: (error) => {
                const msg = getErrorMessage(error, 'Failed to reset password');
                toast.error(msg);
            },
            onSuccess: () => {
                toast.success('Password reset successfully');
                cleanPath();
                navigate('/login');
            }
        }
    );

    useEffect(() => {
        verifyToken({ body: { token } });
    }, [token, verifyToken]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const newPassword = formData.get('new-password') as string;
        const confirmPassword = formData.get('confirm-password') as string;

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        resetPassword({ body: { token, new_password: newPassword, confirm_password: confirmPassword } });
    };

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
                                        <TextAnimate animation="blurInUp">Reset Password</TextAnimate>
                                    </CardTitle>

                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {isVerifying ? (
                                        <div className="text-center space-y-4">
                                            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                                            <p className="text-sm text-foreground/70">Verifying token...</p>
                                        </div>
                                    ) : initialError ? (
                                        <div className="text-center space-y-4">
                                            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                                            <p className="text-sm text-foreground/70">{initialError}</p>
                                            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Request new reset link</Link>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mt-0 text-sm text-foreground/70">Enter your new password below.</p>

                                            <form className="mt-2 space-y-4" aria-label="reset-password-form" onSubmit={handleSubmit}>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-password">New Password</Label>
                                                    <Input
                                                        id="new-password"
                                                        name="new-password"
                                                        type="password"
                                                        placeholder="Enter new password"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                                    <Input
                                                        id="confirm-password"
                                                        name="confirm-password"
                                                        type="password"
                                                        placeholder="Confirm new password"
                                                        required
                                                    />
                                                </div>

                                                <Button disabled={isResetting} type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                                    {isResetting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;