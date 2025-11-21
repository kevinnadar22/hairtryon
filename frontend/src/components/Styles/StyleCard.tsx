import React from 'react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';

interface StyleCardProps {
    id: number;
    name: string;
    image: string;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

const StyleCard: React.FC<StyleCardProps> = ({
    id,
    name,
    image,
    isSelected,
    onSelect
}) => {
    return (
        <label className="cursor-pointer">
            <input
                className="peer sr-only"
                type="radio"
                checked={isSelected}
                onChange={() => onSelect(id)}
            />
            <Card className={cn(
                "overflow-hidden transition-all duration-300 relative p-0",
                "peer-checked:border-primary/40 peer-checked:ring-1 peer-checked:ring-primary/30",
                "peer-checked:before:absolute peer-checked:before:inset-0 peer-checked:before:pointer-events-none",
                "peer-checked:before:bg-gradient-to-br peer-checked:before:from-primary/30 peer-checked:before:via-transparent",
                "peer-checked:before:to-primary/30 peer-checked:before:opacity-80 peer-checked:before:animate-pulse"
            )}>
                <img
                    alt={name}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover object-top"
                    src={image}
                />
                <div className="px-2 pb-1 text-center">
                    <span className="text-sm font-medium">{name}</span>
                </div>
            </Card>
        </label>
    );
};

export default StyleCard;
