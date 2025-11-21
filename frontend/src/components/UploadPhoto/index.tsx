import React, { useEffect } from "react";
import { TextAnimate } from "../ui/text-animate";
import DropZone from "./DropZone";
import PreviewSection from "./PreviewSection";
import { OutputSection } from "../OutputSection";
import { useUploadContext } from "@/contexts";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { toast } from "sonner";
import PrevUploadedPhotos from "./PrevUploadedPhotos";
import getUploadedAsUrl from "@/lib/getImageUrl";
import usePrevious from "@/hooks/usePrevious";

// main entry point for upload photo
const UploadPhotoContent: React.FC = () => {
  const { fileInputRef, selectFile, userUploadedImage } = useUploadContext();
  const prevUserUploadedImage = usePrevious(userUploadedImage);
  const { generatedImage, isGenerating } = useSelector(
    (state: RootState) => state.imageSlide
  );

  // state for accordion
  const [expanded, setExpanded] = React.useState<string>("");

  const handleFileSelect = (file: File) => {
    selectFile(file);
  };

  const handleUploadClick = () => {
    if (isGenerating) return;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGenerating) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  useEffect(() => {
    if (prevUserUploadedImage === undefined) return;
    if (userUploadedImage && userUploadedImage !== prevUserUploadedImage) {
      toast.success("Photo uploaded successfully!");
      setExpanded(""); // collapse accordion on new upload
    }
  }, [userUploadedImage, prevUserUploadedImage]);

  const textAnimated = "Try any hairstyle on you in seconds";

  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <TextAnimate
          animation="fadeIn"
          className="text-2xl font-semibold text-balance md:text-3xl"
        >
          {textAnimated}
        </TextAnimate>
      </div>
      {!userUploadedImage ? (
        <>
          <DropZone
            onFileSelect={handleFileSelect}
            onClick={handleUploadClick}
          />

          {/* here comes the previsouly uploaded photos */}
          <PrevUploadedPhotos />
        </>
      ) : !generatedImage ? (
        // show upload section
        <>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={expanded}
            onValueChange={(e) => {
              console.log(e);
              setExpanded(e);
            }}
          >
            <AccordionItem value="upload-section" className="border-none">
              <AccordionTrigger className="bg-primary/5 px-4 rounded-lg hover:bg-primary/10 hover:no-underline">
                <div className="flex items-center gap-3">
                  <img
                    src={getUploadedAsUrl(userUploadedImage)}
                    alt="Uploaded"
                    className="w-12 h-12 object-cover rounded-md border border-primary/20"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-base">Your Photo</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      Click to change the photo
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <PreviewSection onClick={handleUploadClick} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      ) : (
        // show preview section
        <div className="space-y-3">
          <OutputSection />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

const UploadPhoto: React.FC = () => {
  return <UploadPhotoContent />;
};

export default UploadPhoto;
