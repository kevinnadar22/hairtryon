import React from 'react';
import { Button, buttonVariants } from './button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e?: React.MouseEvent) => void;
    as?: 'button' | 'a' | 'div' | 'span';
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
    ButtonComponent?: React.ElementType;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    className = '',
    onClick,
    as: Component = 'button',
    href,
    type = 'button',
    disabled = false,
    variant = 'default',
    size = 'default',
    ButtonComponent = Button,
    ...props
}) => {
    const baseClasses = 'relative overflow-hidden transition-all duration-300  hover:shadow-sm group';

    const combinedClasses = cn(
        baseClasses,
        buttonVariants({ variant, size }),
        className
    );

    const lightSplash = (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
    );

    const content = (
        <>
            <span className="relative z-10">{children}</span>
            {lightSplash}
        </>
    );



    return (
        <ButtonComponent
            type={type}
            className={combinedClasses}
            variant={variant}
            size={size}
            onClick={(e?: React.MouseEvent) => onClick?.(e)}
            disabled={disabled}
            {...props}
        >
            {content}
        </ButtonComponent>
    );
};

export default AnimatedButton;
