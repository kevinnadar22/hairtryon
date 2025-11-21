// useUpload.ts
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetImage, resetSideImageState } from '@/features';


export function useUpload() {
    const dispatch = useDispatch();

    // states

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userUploadedImage, setUserUploadedImage] = useState<string | File | null>(null);

    // functions
    const selectFile = (newFile: File) => {
        setUserUploadedImage(newFile);
    };

    // have a method where selectFileFromUrl can be called with a url string
    const selectFileFromUrl = (url: string) => {
        setUserUploadedImage(url);
    };

    const reset = () => {
        // reset generated image
        dispatch(resetImage());
        dispatch(resetSideImageState());
    };

    const resetAll = () => {
        // reset generated image and uploaded file
        if (fileInputRef.current) fileInputRef.current.value = '';
        setUserUploadedImage(null);
        dispatch(resetImage());
        dispatch(resetSideImageState());
    }

    return { userUploadedImage, fileInputRef, selectFile, selectFileFromUrl, reset, resetAll };
}
