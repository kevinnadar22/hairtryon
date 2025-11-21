import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ImageSlideState, GenerateImageReducerPayload } from './types';
import { initialState } from './constants';


const imageSlideSlice = createSlice({
    name: 'imageSlide',
    initialState,
    reducers: {
        setStyleId: (state, action: PayloadAction<number | null>) => {
            state.styleId = action.payload;
        },

        setGeneratedImageId: (state, action: PayloadAction<number | null>) => {
            state.generatedImageId = action.payload;
        },

        setGeneratedImage: (state, action: PayloadAction<string | null>) => {
            state.generatedImage = action.payload;
        },
        generateImage: (state: ImageSlideState, action: PayloadAction<GenerateImageReducerPayload>) => {
            state.generatedImage = action.payload.imageUrl;
            state.generatedImageId = action.payload.imageId;
            state.barberDescription = action.payload.description || '';
            state.isGenerating = false;
        },
        setIsGeneratingImage: (state, action: PayloadAction<boolean>) => {
            state.isGenerating = action.payload;
        },
        startRegeneratingImage: (state) => {
            state.isGenerating = true;
            state.generatedImage = null;
            state.generatedImageId = null;
        },
        resetImage: () => {
            // set to initial state, except the user uploaded image remains
            return {
                ...initialState
            };
        },
    },
});

export const { 
    setGeneratedImage,
    generateImage,
    setIsGeneratingImage,
    startRegeneratingImage,
    resetImage, 
    setStyleId,
} = imageSlideSlice.actions;
export default imageSlideSlice.reducer;