import DescriptionOverlay from "./DescriptionOverlay";
import ActionButtons from "./ActionButtons";
import { Button } from "../ui/button";
import { Maximize2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useState } from "react";
import ImageModal from "./ImageModal";
import { useUploadContext } from "@/contexts/Upload/context";
import { api } from "@/api/client";
import { useRef } from "react";
import { useEffect } from "react";
import usePrevious from "@/hooks/usePrevious";

function FrontView() {
  const imageView = useRef<HTMLImageElement | null>(null);
  const { generatedImage, generatedImageId } = useSelector(
    (state: RootState) => state.imageSlide
  );
  const prevGeneratedImage = usePrevious(generatedImage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { reset } = useUploadContext();

  // Tanstack
  const likeMutation =
    api.image.likeImageApiV1ImageLikeImageIdPost.useMutation();
  const dislikeMutation =
    api.image.dislikeImageApiV1ImageDislikeImageIdPost.useMutation();

  useEffect(() => {
    // skip on mount (prev undefined)
    if (prevGeneratedImage === undefined) return;
    // only run when generatedImage changed and is truthy
    if (generatedImage && generatedImage !== prevGeneratedImage) {
      imageView.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [generatedImage, prevGeneratedImage]);

  const handleFullscreen = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLike = async () => {
    if (generatedImageId) {
      await likeMutation.mutateAsync({ path: { image_id: generatedImageId } });
    }
  };

  const handleDislike = async () => {
    if (generatedImageId) {
      await dislikeMutation.mutateAsync({
        path: { image_id: generatedImageId },
      });
    }
  };

  return (
    <>
      <div className="relative">
        {/* Simple Image Display */}
        <div className="w-full max-w-xs mx-auto rounded-lg overflow-hidden relative shadow-md">
          <div ref={imageView}>
            <img
              src={generatedImage || undefined}
              alt="Generated Result"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Fullscreen Button */}
          <Button
            onClick={handleFullscreen}
            size="sm"
            className="absolute top-2 right-2 bg-background/95 hover:bg-background text-primary border-2 border-primary shadow-lg  transform hover:scale-102 transition-all duration-200 z-20"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        <DescriptionOverlay />
      </div>

      <ActionButtons
        onReset={() => {
          reset();
          return true;
        }}
        url={generatedImage}
        showIcons={{
          regenerate: true,
          copy: true,
          share: true,
          download: true,
          likeDislike: true,
        }}
        onLike={handleLike}
        onDislike={handleDislike}
      />
      {/* <ActionButtons /> */}
      <ImageModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default FrontView;
