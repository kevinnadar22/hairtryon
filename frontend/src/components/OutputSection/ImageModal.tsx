import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import type { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import getUploadedAsUrl from "@/lib/getImageUrl";
import { useUploadContext } from "@/contexts";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose }) => {
  const [currentImage, setCurrentImage] = useState<"before" | "after">("after");
  const generatedImage = useSelector(
    (state: RootState) => state.imageSlide.generatedImage
  );
  const { userUploadedImage } = useUploadContext();

  const handlePrevious = () => {
    setCurrentImage(currentImage === "after" ? "before" : "after");
  };

  const handleNext = () => {
    setCurrentImage(currentImage === "before" ? "after" : "before");
  };

  return (
    <Dialog
      open={isOpen && !!generatedImage && !!userUploadedImage}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-6xl w-[95vw]  p-0 bg-background">
        <DialogHeader className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-foreground">
              Hair Transformation Result
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 p-3 relative">
          {/* Image Container */}
          <div className="w-full h-full max-h-[calc(95vh-8rem)] rounded-xl overflow-hidden relative shadow-2xl bg-muted/20">
            <img
              src={
                currentImage === "before"
                  ? getUploadedAsUrl(userUploadedImage)
                  : generatedImage || ""
              }
              alt={
                currentImage === "before"
                  ? "User Uploaded Image"
                  : "Generated Image"
              }
              className="w-full h-full object-contain"
            />
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 border border-border shadow-lg">
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentImage("before")}
                variant={currentImage === "before" ? "default" : "outline"}
                size="sm"
                className="px-4"
              >
                Before
              </Button>
              <Button
                onClick={() => setCurrentImage("after")}
                variant={currentImage === "after" ? "default" : "outline"}
                size="sm"
                className="px-4"
              >
                After
              </Button>
            </div>

            <Button
              onClick={handleNext}
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
