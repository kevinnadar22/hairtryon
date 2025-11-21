import React from "react";
import { X } from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useUploadContext } from "@/contexts/Upload/context";
import getUploadedAsUrl from "@/lib/getImageUrl";

interface PreviewSectionProps {
  onClick: () => void;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ onClick }) => {
  const { isGenerating } = useSelector((state: RootState) => state.imageSlide);
  const { resetAll, userUploadedImage } = useUploadContext();

  return (
    <Card
      className="relative flex flex-col items-center justify-center gap-4  p-12 text-center transition-all duration-300 cursor-pointer transform overflow-hidden bg-primary/5"
      onClick={onClick}
    >
      <div className="relative z-10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={getUploadedAsUrl(userUploadedImage)}
              alt="Preview"
              className="max-w-48 max-h-48 object-contain rounded-lg shadow-lg"
              style={{ aspectRatio: "auto" }}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            {/* <p className="text-lg font-bold text-primary">Photo uploaded successfully!</p> */}
            <p className="text-sm text-muted-foreground">
              Click to upload a different photo
            </p>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              resetAll();
            }}
            variant="ghost"
            className="bg-primary/10 hover:bg-primary/20"
            title="Reset"
            disabled={isGenerating}
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            <span>Reset </span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PreviewSection;
