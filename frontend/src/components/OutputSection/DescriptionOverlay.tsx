import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';


const DescriptionOverlay: React.FC = () => {
  const barberDescription = useSelector((state: RootState) => state.imageSlide.barberDescription);


  const limit = 30;
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowExpand = barberDescription.length > limit;

  const displayText = shouldShowExpand && !isExpanded
    ? `${barberDescription.substring(0, limit)}...`
    : barberDescription;

  if (!barberDescription) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none">
      <div className="bg-background/50 backdrop-blur-sm dark:bg-background/90 rounded-lg border border-border/50 shadow-lg max-w-80 w-full pointer-events-auto">
        <div className="flex items-start justify-between p-3">
          <p className="text-foreground text-sm leading-relaxed flex-1">
            {displayText}
          </p>
          {shouldShowExpand && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 p-1 hover:bg-background/20 rounded transition-colors duration-200 shrink-0"
              aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-foreground" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptionOverlay;
