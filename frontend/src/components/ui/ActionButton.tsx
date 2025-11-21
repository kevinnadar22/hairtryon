import React, { useState } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { toast } from 'sonner';

type MaybePromise<T> = T | Promise<T>;

interface ActionButtonProps {
    onClick: (e?: React.MouseEvent) => MaybePromise<boolean | void>;
    label?: string | React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
    className?: string;
    loadingMessage?: string | React.ReactNode;
    successMessage?: string | React.ReactNode;
    errorMessage?: string | React.ReactNode;

    // Add these for external state control
    isLoading?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    // onStatusChange?: (status: 'idle' | 'loading' | 'success' | 'error') => void;
}

export function ActionButton({
    onClick,
    label = 'Try On',
    variant = 'default',
    size = 'default',
    className = '',
    loadingMessage,
    successMessage,
    errorMessage,
    isLoading: externalLoading,
    isSuccess: externalSuccess,
    isError: externalError,
    ...props
}: ActionButtonProps) {
    const [internalStatus, setInternalStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const status = externalLoading ? 'loading' : externalSuccess ? 'success' : externalError ? 'error' : internalStatus;

    async function handleClick(e?: React.MouseEvent) {
        if (status === 'loading') return;
        let maybePromise: any;

        if (externalLoading !== undefined) {
            maybePromise = onClick(e);
            // await if promise is returned
            if (maybePromise && typeof maybePromise.then === 'function') {
                maybePromise = await maybePromise;
            }
            return;
        }

        try {
            setInternalStatus('loading');
            maybePromise = onClick(e);

            if (maybePromise && typeof maybePromise.then === 'function') {
                // async function
                const result = await maybePromise;
                if (typeof result === 'boolean') {
                    setInternalStatus(result ? 'success' : 'error');
                } else {
                    setInternalStatus('success');
                }
            } else {
                // sync function
                if (typeof maybePromise === 'boolean') {
                    setInternalStatus(maybePromise ? 'success' : 'error');
                } else {
                    setInternalStatus('success');
                }
            }
        } catch {
            toast.error('Failed!');
            setInternalStatus('error');
        } finally {
            setTimeout(() => setInternalStatus('idle'), 2000);
        }
    }

    const getContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {loadingMessage && <span>{loadingMessage}</span>}
                    </>
                );
            case 'success':
                return (
                    <>
                        <Check className="w-4 h-4" />
                        {successMessage && <span>{successMessage}</span>}
                    </>
                );
            case 'error':
                return (
                    <>
                        <X className="w-4 h-4" />
                        {errorMessage ? <span>{errorMessage}</span> : <span>Failed</span>}
                    </>
                );
            default:
                return label;
        }
    };

    return (
        <AnimatedButton
            onClick={handleClick}
            disabled={status === 'loading'}
            variant={variant}
            size={size}
            className={className}
            {...props}
        >
            <div className="flex items-center gap-2">
                {getContent()}
            </div>
        </AnimatedButton>
    );
}
