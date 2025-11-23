import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";

interface CapturePhotoProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CapturePhoto: React.FC<CapturePhotoProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>(16 / 9);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraReady(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please check permissions.");
      onClose();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraReady(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageDataUrl);
        // Stop the camera stream after capturing
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Restart the camera when retaking
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      // Convert data URL to File
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "captured-photo.png", {
            type: "image/png",
          });
          onCapture(file);
          onClose();
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Take a Photo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div
            className="relative w-full bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: videoAspectRatio }}
          >
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  if (video.videoWidth && video.videoHeight) {
                    setVideoAspectRatio(video.videoWidth / video.videoHeight);
                  }
                }}
                className="w-full h-full object-contain transform -scale-x-100" // Mirror effect
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-contain transform -scale-x-100" // Mirror effect to match preview
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
        <DialogFooter className="sm:justify-between flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!capturedImage ? (
            <Button onClick={handleCapture} disabled={!isCameraReady}>
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          ) : (
            <div className="flex gap-2 w-full justify-end">
              <Button variant="secondary" onClick={handleRetake}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button onClick={handleConfirm}>
                <Check className="mr-2 h-4 w-4" />
                Use Photo
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CapturePhoto;
