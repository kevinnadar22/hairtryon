import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_BACK_VIEW_URL, DEFAULT_LEFT_VIEW_URL, DEFAULT_RIGHT_VIEW_URL, initialState } from './constants';

const sideImageSlideSlice = createSlice({
    name: 'sideImageSlide',
    initialState,
    reducers: {
        // reset, generate
        resetSideImageState: () => {
            return initialState;
        },
        generateSideImages: (state) => {
            state.backViewImage = DEFAULT_BACK_VIEW_URL;
            state.rightViewImage = DEFAULT_RIGHT_VIEW_URL;
            state.leftViewImage = DEFAULT_LEFT_VIEW_URL;
            state.isGenerating = false;
            state.isGenerated = true;
        },
        setIsGeneratingImage: (state, action: PayloadAction<boolean>) => {
            state.isGenerating = action.payload;
        }
    },
});

export const { resetSideImageState, generateSideImages, setIsGeneratingImage } = sideImageSlideSlice.actions;
export default sideImageSlideSlice.reducer;