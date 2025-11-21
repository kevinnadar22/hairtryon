import React, { useState, useEffect, useCallback } from "react";
import { Copy, Download, Share, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ActionButton } from "../ui/ActionButton";
import {
  Comparison,
  ComparisonHandle,
  ComparisonItem,
} from "../ui/shadcn-io/comparison";
import { CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../ui/carousel";
import { cn } from "@/lib/utils";
import { copyImageToClipboard, downloadImage, shareImage } from "@/utils";
import type { components } from "@/api/schema";

type HistoryItem = components["schemas"]["UserImages"];

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItem: HistoryItem;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyItem,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Build array of all images with labels
  const images = [
    {
      src: historyItem.output_image_url,
      label: "Front",
      type: "front" as const,
    },
    ...(historyItem.side_views
      ? [
          {
            src: historyItem.side_views.left_view_url,
            label: "Left",
            type: "side" as const,
          },
          {
            src: historyItem.side_views.back_view_url,
            label: "Back",
            type: "side" as const,
          },
          {
            src: historyItem.side_views.right_view_url,
            label: "Right",
            type: "side" as const,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleThumbClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  // Get current image based on carousel position
  const getCurrentImage = () => {
    return images[current]?.src || historyItem.output_image_url || "";
  };

  // Description overlay logic
  const barberDescription = historyItem.description || "";
  const descriptionLimit = 30;
  const shouldShowDescriptionExpand =
    barberDescription.length > descriptionLimit;
  const displayDescription =
    shouldShowDescriptionExpand && !isDescriptionExpanded
      ? `${barberDescription.substring(0, descriptionLimit)}...`
      : barberDescription;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-0 bg-background overflow-hidden flex flex-col">
        <DialogHeader className="p-3 sm:p-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm sm:text-md text-foreground line-clamp-2">
              {historyItem.style_name} - {formatDate(historyItem.created_at)}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 p-2 sm:p-3 relative overflow-y-auto">
          <div className="w-full rounded-md relative overflow-hidden">
            <div className="relative z-10 mx-auto max-w-4xl">
              {/* Main Carousel */}
              <Carousel
                setApi={setApi}
                className="w-full"
                opts={{
                  watchDrag: false,
                }}
              >
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="w-full rounded-md overflow-hidden relative">
                        {image.type === "front" ? (
                          <Comparison className="aspect-square w-full max-h-[50vh] sm:max-h-[calc(95vh-16rem)]">
                            <ComparisonItem
                              position="left"
                              className="bg-muted"
                            >
                              <img
                                src={historyItem.input_image_url}
                                alt="Before"
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-border z-10">
                                <span className="text-xs font-medium text-foreground">
                                  Before
                                </span>
                              </div>
                            </ComparisonItem>
                            <ComparisonItem
                              position="right"
                              className="bg-muted"
                            >
                              <img
                                src={image.src || ""}
                                alt="After"
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-border z-10">
                                <span className="text-xs font-medium text-foreground">
                                  After
                                </span>
                              </div>
                            </ComparisonItem>
                            <ComparisonHandle />
                          </Comparison>
                        ) : (
                          <div className="relative bg-muted flex items-center justify-center max-h-[50vh] sm:max-h-[calc(95vh-16rem)]">
                            <img
                              src={image.src}
                              alt={`${image.label} view`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}

                        {/* Description Overlay - Only show on front view */}
                        {image.type === "front" && barberDescription && (
                          <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
                            <div className="bg-background/60 backdrop-blur-sm dark:bg-background/90 rounded-t-md border-t border-border/50 shadow-lg w-full max-w-80 pointer-events-auto">
                              <div className="flex items-start justify-between p-3">
                                <p className="text-foreground text-sm leading-relaxed flex-1">
                                  {displayDescription}
                                </p>
                                {shouldShowDescriptionExpand && (
                                  <button
                                    onClick={() =>
                                      setIsDescriptionExpanded(
                                        !isDescriptionExpanded
                                      )
                                    }
                                    className="ml-2 p-1 hover:bg-background/20 rounded transition-colors duration-200 shrink-0"
                                    aria-label={
                                      isDescriptionExpanded
                                        ? "Collapse description"
                                        : "Expand description"
                                    }
                                  >
                                    {isDescriptionExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-foreground" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-foreground" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Action Buttons */}
              <div className="my-4 sm:my-4 flex flex-row items-center justify-center gap-2 sm:gap-4">
                <ActionButton
                  variant="outline"
                  size="lg"
                  onClick={() => copyImageToClipboard(getCurrentImage())}
                  label={
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Copy
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        aria-hidden="true"
                      />
                    </div>
                  }
                />
                <ActionButton
                  variant="outline"
                  size="lg"
                  onClick={() => downloadImage(getCurrentImage())}
                  label={
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Download
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        aria-hidden="true"
                      />
                    </div>
                  }
                />
                <ActionButton
                  variant="outline"
                  size="lg"
                  onClick={() => shareImage(getCurrentImage())}
                  label={
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Share
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        aria-hidden="true"
                      />
                    </div>
                  }
                />
              </div>

              {/* Thumbnail Carousel */}
              <Carousel className="mt-4 w-full max-w-3xl mx-auto">
                <CarouselContent className="flex my-1 flex-row justify-center">
                  {images.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className={cn(
                        "basis-1/4 sm:basis-1/5 cursor-pointer transition-all",
                        current === index
                          ? "opacity-100"
                          : "opacity-50 hover:opacity-75"
                      )}
                      onClick={() => handleThumbClick(index)}
                    >
                      <div
                        className={cn(
                          "rounded-md transition-colors overflow-hidden",
                          current === index
                            ? "border-primary border-2"
                            : "border-transparent"
                        )}
                      >
                        <CardContent className="p-0 aspect-square relative overflow-hidden">
                          <img
                            src={image.src || ""}
                            alt={`${image.label} thumbnail`}
                            className="w-full h-full object-cover absolute inset-0"
                          />
                          <div className="absolute bottom-1 left-1 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium z-10">
                            {image.label}
                          </div>
                        </CardContent>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
