// This component is a card to display a history item with an image and optional side views indicator.

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import HistoryModal from "./Modal";
import degreeicon from "@/assets/3603d.png";
import { type components } from "@/api/schema";
import { Loader2, AlertCircle } from "lucide-react";

type Props = {
  item: components["schemas"]["UserImages"];
  className?: string;
  size?: "sm" | "md" | "lg";
};

function HistoryCardItem({ item, className = "", size = "md" }: Props) {
  const sizeClass =
    size === "sm" ? "w-20 h-20" : size === "lg" ? "w-40 h-40" : "w-32 h-32";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCompleted = item.status === "completed";
  const isPending = item.status === "pending";
  const isProcessing = item.status === "processing";
  const isFailed = item.status === "failed";

  const handleClick = () => {
    // Only open modal if the image is completed
    if (isCompleted) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={handleClick}
        className={cn(
          "group relative shrink-0 overflow-hidden transition-all duration-300 p-0 border-none shadow-sm",
          sizeClass,
          isCompleted && "cursor-pointer hover:scale-102",
          (isPending || isProcessing || isFailed) && "cursor-default",
          className
        )}
        aria-label={item.style_name || `history-item-${item.id}`}
      >
        {/* Background Image */}
        <img
          src={item.output_image_url || item.input_image_url || ""}
          alt={item.style_name ?? "generated image"}
          className={cn(
            "w-full h-full object-cover object-top",
            (isPending || isProcessing || isFailed) && "opacity-50 blur-sm"
          )}
        />

        {/* Status Overlays */}
        {(isPending || isProcessing) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/30">
            <Loader2 className="w-8 h-8 text-background animate-spin" />
            <span className="text-background text-xs mt-2 font-medium">
              {isPending ? "Pending" : "Processing"}
            </span>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/30">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <span className="text-destructive text-xs mt-2 font-medium">
              Failed
            </span>
          </div>
        )}

        {/* Side Views Indicator - Only show for completed images */}
        {isCompleted && item.side_views && (
          <div className="absolute bottom-2 right-2 bg-background rounded-full p-1">
            <img
              src={degreeicon}
              alt="3D Views Available"
              className="w-8 h-5"
            />
          </div>
        )}
      </Card>

      {/* Modal for detailed view - Only for completed images */}
      {isModalOpen && isCompleted && (
        <HistoryModal
          historyItem={item}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default HistoryCardItem;
