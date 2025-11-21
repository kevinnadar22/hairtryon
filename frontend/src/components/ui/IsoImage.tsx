import React from 'react';
import { cn } from '@/lib/utils';

interface IsoImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-20 h-20',
};

const IsoImage: React.FC<IsoImageProps> = ({
  src,
  alt,
  className,
  size = 'md',
  hover = false,
  onClick,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        sizeClasses[size],
        hover && 'transition-all duration-300 hover:scale-102 hover:rotate-12 hover:-translate-y-1 hover:drop-shadow-lg',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    />
  );
};

export default IsoImage;
