import React from 'react'

import { generateImage } from '@/features/imageSlide/slice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { setIsGeneratingImage, startRegeneratingImage, setIsGeneratingImageFromSide, generateSideImages } from '@/features';

import { ActionButton } from '../ui/ActionButton';
import { api } from '@/api/client';
import uploadToS3 from '@/lib/uploadS3';
import { useUploadContext } from '@/contexts';
import { useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils';

interface GenerateButtonProps extends Omit<React.ComponentProps<typeof ActionButton>, 'onClick' | 'errorMessage' | 'loadingMessage' | 'successMessage'> {
    className?: string;
}

function GenerateButton({ className, ...props }: GenerateButtonProps) {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    //  States
    const [imageId, setImageId] = React.useState<number>(0);
    const { isGenerating, generatedImage, styleId: selectedHairstyle } = useSelector((state: RootState) => state.imageSlide);
    const { userUploadedImage, selectFileFromUrl } = useUploadContext();
    const { user } = useSelector((state: RootState) => state.auth);
    const label = generatedImage ? 'Regenerate Image' : 'Generate Image';

    const fileName = userUploadedImage && typeof userUploadedImage !== 'string' ? userUploadedImage.name : 'uploaded_image';
    const fileType = userUploadedImage && typeof userUploadedImage !== 'string' ? userUploadedImage.type : 'application/octet-stream';

    // Tanstack
    const { mutate } = api.image.generateImageApiV1ImageGeneratePost.useMutation(undefined, {
        onSuccess: (data) => {
            const image_id = data.image_id;
            pollStatus(image_id);
        },
        onError: (error) => {
            dispatch(setIsGeneratingImage(false));
            toast.error(getErrorMessage(error) || 'Image generation failed. Please try again.');
        }
    });

    const presignQuery = api.files.getPresignedUrlApiV1FilesPresignGet.useQuery(
        { query: { file_name: fileName, file_type: fileType } },
        { enabled: false }
    );

    const imageStatusRes = api.image.getImageStatusApiV1ImageStatusImageIdGet.useQuery({ path: { image_id: imageId } }, { enabled: false });

    const pollStatus = async (image_id: number) => {
        setImageId(image_id);
        for (; ;) {
            try {
                const res = await imageStatusRes.refetch();
                if (res.data?.status === 'completed') {
                    dispatch(generateImage(
                        { imageUrl: res.data.output_image_url!, imageId: image_id, description: res.data.description || '' }));
                    dispatch(setIsGeneratingImage(false));

                    // Invalidate history to refetch the updated list
                    queryClient.invalidateQueries({
                        queryKey: api.user.getUserImagesApiV1UserImagesGet.getQueryKey()
                    });

                    toast.success('Image generated successfully!');
                    break;
                }
                else if (res.data?.status === 'failed') {
                    dispatch(setIsGeneratingImage(false));
                    toast.error('Image generation failed. Please try again.');
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before polling again
            }
            catch (error) {
                dispatch(setIsGeneratingImage(false));
                toast.error('Image generation failed. Please try again.');
                break;
            }
        }
    }


    const handleGenerate = async (e?: React.MouseEvent) => {
        e?.stopPropagation();

        if (!user) {
            toast.error('Please log in to generate images');
            return false;
        }

        if (!userUploadedImage) {
            toast.error('Please upload an image first');
            return false;
        }

        if (!selectedHairstyle) {
            toast.error('Please select a hairstyle first');
            return false;
        }

        // resets the previous generated image
        dispatch(startRegeneratingImage());
        // for loading state, set isGenerating to true
        dispatch(setIsGeneratingImage(true));

        let uploadUrl: string;
        if (typeof userUploadedImage === 'string') {
            uploadUrl = userUploadedImage;
        } else {
            // Step 1: Get presigned URL from the backend
            const presignResponse = await presignQuery.refetch();
            const data = presignResponse.data;
            if (!data) {
                throw new Error('Failed to get presigned URL');
            }
            const { upload_url, fields, file_url } = data;


            // Step 2: Upload the file to S3 using the presigned URL
            try {
                // @ts-ignore
                uploadUrl = await uploadToS3(upload_url, fields, file_url, userUploadedImage);
            } catch (error) {
                dispatch(setIsGeneratingImage(false));
                toast.error('Failed to upload image. Please try again.');
                return false;
            }
            selectFileFromUrl(uploadUrl);
        }

        // call the API to generate image
        mutate({ body: { image_input_url: uploadUrl, style_id: selectedHairstyle } });
        return true;
    }


    return (
        <ActionButton
            {...props}
            label={label}
            className={cn('cursor-pointer text-sm font-semibold', className)}
            onClick={handleGenerate}
            errorMessage="Please try again!"
            isLoading={isGenerating}
        />
    )
}

function SideGenerateButton({ className, ...props }: GenerateButtonProps) {
    const dispatch = useDispatch();
    // check if the user has uploaded an image
    const { isGenerating } = useSelector((state: RootState) => state.sideImageSlide);
    const { userUploadedImage } = useUploadContext();

    const handleGenerate = (e?: React.MouseEvent) => {
        e?.stopPropagation();

        if (!userUploadedImage) {
            toast.error('Please upload an image first');
            return false;
        }

        // dispatch(generateSideImages());

        return new Promise<boolean>((resolve) => {
            dispatch(setIsGeneratingImageFromSide(true));
            setTimeout(() => {
                dispatch(generateSideImages());
                dispatch(setIsGeneratingImageFromSide(false));
                resolve(true);
            }, 2000); // 2 seconds delay
        });
    }
    return (
        <ActionButton
            {...props}
            label="Generate Side Views"
            className={cn('cursor-pointer text-sm font-semibold', className)}
            onClick={handleGenerate}
            errorMessage="Please try again!"
            isLoading={isGenerating}
        />
    )
}

// make a sideGenerateButton

export default GenerateButton;
export { SideGenerateButton };