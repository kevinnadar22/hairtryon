import { Copy, Download, Heart, ThumbsDown, RotateCcw } from "lucide-react";
import { ActionButton } from "../ui/ActionButton";
import { Toggle } from "@/components/ui/toggle";
import { copyImageToClipboard, downloadImage } from "@/utils";
import { useState } from "react";


interface ActionButtonsProps {
  onReset?: () => Promise<boolean> | boolean;
  url: string | null;
  showIcons: {
    regenerate?: boolean;
    likeDislike?: boolean;
    copy?: boolean;
    download?: boolean;
  };
  onLike?: () => void;
  onDislike?: () => void;
}

function ActionButtons({
  onReset,
  url,
  showIcons,
  onLike,
  onDislike,
}: ActionButtonsProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  function handleLike(next: boolean) {
    setLiked(next);
    if (next) setDisliked(false);
    if (onLike) onLike();
  }
  function handleDislike(next: boolean) {
    setDisliked(next);
    if (next) setLiked(false);
    if (onDislike) onDislike();
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* All 5 icons in one row */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {/* Like / Dislike toggles - Left side */}

        {showIcons.likeDislike && (
          <div className="flex items-center gap-2">
            <Toggle
              aria-label="Toggle like"
              size="sm"
              variant="outline"
              pressed={liked}
              onPressedChange={handleLike}
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-primary data-[state=on]:*:[svg]:stroke-primary"
            >
              <Heart className="w-5 h-5" />
              <span className="sr-only">Like</span>
            </Toggle>
            <Toggle
              aria-label="Toggle dislike"
              size="sm"
              variant="outline"
              pressed={disliked}
              onPressedChange={handleDislike}
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-primary data-[state=on]:*:[svg]:stroke-primary"
            >
              <ThumbsDown className="w-5 h-5" />
              <span className="sr-only">Dislike</span>
            </Toggle>
          </div>
        )}

        <div className="flex items-center gap-2">
          {showIcons.copy && (
            <ActionButton
              variant="outline"
              size="icon-sm"
              onClick={() => {
                url && copyImageToClipboard(url);
                return true;
              }}
              aria-label="Copy image"
              label={<Copy className="w-5 h-5" />}
            ></ActionButton>
          )}

          {showIcons.download && (
            <ActionButton
              variant="outline"
              size="icon-sm"
              onClick={() => {
                url && downloadImage(url);
                return true;
              }}
              aria-label="Download image"
              label={<Download className="w-5 h-5" />}
            ></ActionButton>
          )}


          {showIcons.regenerate && onReset && (
            <ActionButton
              variant="outline"
              size="icon-sm"
              onClick={onReset}
              label={
                <RotateCcw aria-hidden="true" className="w-5 h-5" />
              }
            />
          )}

        </div>
      </div>


    </div>
  );
}
export default ActionButtons;
