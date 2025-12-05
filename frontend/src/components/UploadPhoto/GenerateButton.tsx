import React, { useState } from "react";

import { generateImage } from "@/features/imageSlide/slice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    setIsGeneratingImage,
    startRegeneratingImage,
    generateSideImages,
    setIsGeneratingImageFromSide,
    resetSideGeneratedImages,
    setIsSideGenerated,
} from "@/features";

import { ActionButton } from "../ui/ActionButton";
import { api } from "@/api/client";
import uploadToS3 from "@/lib/uploadS3";
import { useUploadContext } from "@/contexts";
import { getErrorMessage } from "@/utils";
import { CreditPurchaseModal } from "../Payments/CreditPurchaseModal";
import { LoginPopup } from "../Auth/LoginPopup";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";

interface GenerateButtonProps
    extends Omit<
        React.ComponentProps<typeof ActionButton>,
        "onClick" | "errorMessage" | "loadingMessage" | "successMessage"
    > {
    className?: string;
}

function GenerateButton({ className, ...props }: GenerateButtonProps) {
    const dispatch = useDispatch();

    const [showCreditModal, setShowCreditModal] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const { invalidateMeQueries, invalidateUserImages } = useInvalidateQuery();

    const {
        isGenerating,
        generatedImage,
        styleId: selectedHairstyle,
    } = useSelector((state: RootState) => state.imageSlide);
    const { isGenerating: isGeneratingSideImage } = useSelector(
        (state: RootState) => state.sideImageSlide
    );
    const { userUploadedImage, selectFileFromUrl } = useUploadContext();
    const { user } = useSelector((state: RootState) => state.auth);
    const label = generatedImage ? "Regenerate Image" : "Generate Image";

    const fileName =
        userUploadedImage && typeof userUploadedImage !== "string"
            ? userUploadedImage.name
            : "uploaded_image";
    const fileType =
        userUploadedImage && typeof userUploadedImage !== "string"
            ? userUploadedImage.type
            : "application/octet-stream";

    // Tanstack
    const { mutate } = api.image.generateImageApiV1ImageGeneratePost.useMutation(
        undefined,
        {
            onSuccess: (data) => {
                const image_id = data.image_id;
                pollStatus(image_id);
            },
            onError: (error) => {
                dispatch(setIsGeneratingImage(false));
                toast.error(
                    getErrorMessage(error) || "Image generation failed. Please try again."
                );
            },
        }
    );

    const presignQuery = api.files.getPresignedUrlApiV1FilesPresignGet.useQuery(
        { query: { file_name: fileName, file_type: fileType } },
        { enabled: false }
    );

    const invalidateQueries = () => {
        invalidateMeQueries();
        invalidateUserImages();
    };

    const pollStatus = async (image_id: number) => {
        for (; ;) {
            try {
                const res = await api.image.getImageStatusApiV1ImageStatusImageIdGet({
                    parameters: { path: { image_id: image_id } },
                });
                if (res.data?.status === "completed") {
                    dispatch(
                        generateImage({
                            imageUrl: res.data.output_image_url!,
                            imageId: image_id,
                            description: res.data.description || "",
                        })
                    );
                    dispatch(setIsGeneratingImage(false));

                    invalidateQueries();

                    toast.success("Image generated successfully!");
                    break;
                } else if (res.data?.status === "failed") {
                    dispatch(setIsGeneratingImage(false));
                    toast.error("Image generation failed. Please try again.");
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 1 second before polling again
            } catch (error) {
                dispatch(setIsGeneratingImage(false));
                toast.error("Image generation failed. Please try again.");
                break;
            }
        }
    };

    const handleGenerate = async (e?: React.MouseEvent) => {
        e?.stopPropagation();

        if (!userUploadedImage) {
            toast.error("Please upload an image first");
            return false;
        }
        if (!user) {
            setShowLoginPopup(true);
            return false;
        }

        if (!selectedHairstyle) {
            toast.error("Please select a hairstyle first");
            return false;
        }

        // check if user has credits
        if (user.credits < 1) {
            // toast.error('You have no credits left. Please purchase more credits to generate images');
            setShowCreditModal(true);
            return false;
        }

        // resets the previous generated image
        dispatch(startRegeneratingImage());
        // for loading state, set isGenerating to true
        dispatch(setIsGeneratingImage(true));

        let uploadUrl: string;
        if (typeof userUploadedImage === "string") {
            uploadUrl = userUploadedImage;
        } else {
            // Step 1: Get presigned URL from the backend
            const presignResponse = await presignQuery.refetch();
            const data = presignResponse.data;
            if (!data) {
                throw new Error("Failed to get presigned URL");
            }
            const { upload_url, fields, file_url } = data;

            // Step 2: Upload the file to S3 using the presigned URL
            try {
                uploadUrl = await uploadToS3(
                    upload_url,
                    // @ts-ignore 
                    fields,
                    file_url,
                    userUploadedImage
                );
            } catch (error: any) {
                dispatch(setIsGeneratingImage(false));
                toast.error(error?.message || "Failed to upload image to S3");
                return false;
            }
            selectFileFromUrl(uploadUrl);
        }

        // call the API to generate image
        mutate({
            body: { image_input_url: uploadUrl, style_id: selectedHairstyle },
        });
        return true;
    };

    return (
        <>
            <ActionButton
                {...props}
                label={label}
                className={cn("cursor-pointer text-sm font-semibold", className)}
                onClick={handleGenerate}
                errorMessage="Please try again!"
                isLoading={isGenerating || isGeneratingSideImage}
            />
            <CreditPurchaseModal
                isOpen={showCreditModal}
                onClose={() => setShowCreditModal(false)}
            />
            <LoginPopup
                isOpen={showLoginPopup}
                onClose={() => setShowLoginPopup(false)}
            />
        </>
    );
}

function SideGenerateButton({ className, ...props }: GenerateButtonProps) {
    const dispatch = useDispatch();
    const { isGenerating } = useSelector(
        (state: RootState) => state.sideImageSlide
    );
    const { generatedImageId } = useSelector(
        (state: RootState) => state.imageSlide
    );
    const { userUploadedImage } = useUploadContext();

    // Mutation for generating view images
    const { mutate } =
        api.image.generateViewImagesApiV1ImageViewGeneratePost.useMutation(
            undefined,
            {
                onSuccess: (data) => {
                    const image_id = data.image_id;
                    pollViewStatus(image_id);
                },
                onError: (error) => {
                    dispatch(setIsGeneratingImageFromSide(false));
                    toast.error(
                        getErrorMessage(error) ||
                        "View generation failed. Please try again."
                    );
                },
            }
        );

    const pollViewStatus = async (image_id: number) => {
        for (; ;) {
            try {
                const res = await api.image.getImageStatusApiV1ImageStatusImageIdGet({
                    parameters: { path: { image_id: image_id } },
                });

                // if res.data is null, then break
                if (!res.data) {
                    continue;
                }

                dispatch(
                    generateSideImages({
                        backViewUrl: res.data.back_view_url,
                        rightViewUrl: res.data.right_view_url,
                        leftViewUrl: res.data.left_view_url,
                    })
                );

                // Check if all three view URLs are available
                if (
                    res.data?.status === "completed" ||
                    (res.data.right_view_url &&
                        res.data.left_view_url &&
                        res.data.back_view_url)
                ) {
                    dispatch(setIsGeneratingImageFromSide(false));
                    dispatch(setIsSideGenerated(true));
                    toast.success("Side views generated successfully!");
                    break;
                } else if (res.data?.status === "failed") {
                    dispatch(setIsGeneratingImageFromSide(false));
                    toast.error("View generation failed. Please try again.");
                    break;
                }

                // Continue polling if still processing
                await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 3 seconds before polling again
            } catch (error) {
                dispatch(setIsGeneratingImageFromSide(false));
                toast.error("View generation failed. Please try again.");
                break;
            }
        }
    };

    const handleGenerate = async (e?: React.MouseEvent) => {
        e?.stopPropagation();

        if (!userUploadedImage) {
            toast.error("Please upload an image first");
            return false;
        }

        if (!generatedImageId) {
            toast.error("Please generate an image first");
            return false;
        }

        // reset generated images
        dispatch(resetSideGeneratedImages());

        // Set loading state
        dispatch(setIsGeneratingImageFromSide(true));

        // Call the API to generate view images
        mutate({ body: { image_id: generatedImageId } });
        return true;
    };

    return (
        <ActionButton
            {...props}
            label="Generate Side Views"
            className={cn("cursor-pointer text-sm font-semibold", className)}
            onClick={handleGenerate}
            errorMessage="Please try again!"
            isLoading={isGenerating}
        />
    );
}

// make a sideGenerateButton

export default GenerateButton;
export { SideGenerateButton };
