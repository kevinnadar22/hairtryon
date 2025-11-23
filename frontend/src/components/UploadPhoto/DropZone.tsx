import React, { useState } from "react";
import IsoImage from "@/components/ui/IsoImage";
import uploadiso from "@/assets/uploadiso.png";
import { TextureOverlay } from "../ui/texture-overlay";
import { Highlighter } from "../ui/highlighter";
import GenerateButton from "./GenerateButton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import CapturePhoto from "./CapturePhoto";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  onClick: () => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, onClick }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // see if files is an image
      if (!files[0].type.startsWith("image/")) {
        toast.error("Please upload an image");
        return;
      }
      onFileSelect(files[0]);
    }
  };

  const handleCameraCapture = (file: File) => {
    onFileSelect(file);
  };

  return (
    <>
      <div className="relative">
        <div
          className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer transform overflow-hidden ${
            isDragOver
              ? "border-primary bg-primary/20 scale-101 shadow-2xl shadow-primary/25 ring-4 ring-primary/30"
              : "border-primary/40 bg-primary/5 hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={onClick}
        >
          <TextureOverlay texture="dots" opacity={0.3} />

          <div className="relative z-10">
            <div className="flex flex-col items-center gap-2">
              <IsoImage src={uploadiso} alt="Upload" className="w-30 h-30" />
              <p className="text-lg font-bold">
                Drop your photo here, or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                We{" "}
                <Highlighter action="underline" color="#FF9800">
                  respect your privacy
                </Highlighter>{" "}
                - your photo is used only as reference.
              </p>

              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-muted-foreground">or</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCameraOpen(true);
                  }}
                >
                  <Camera className="w-4 h-4" />
                  Take a Photo
                </Button>
              </div>

              {/* add the generate button here too */}
              {/* <GenerateButton className="mt-4" /> */}
            </div>
          </div>
        </div>
      </div>

      <CapturePhoto
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
};

export default DropZone;
