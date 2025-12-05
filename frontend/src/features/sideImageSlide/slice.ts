import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./constants";

const sideImageSlideSlice = createSlice({
  name: "sideImageSlide",
  initialState,
  reducers: {
    // reset, generate
    resetSideImageState: () => {
      return initialState;
    },
    generateSideImages: (
      state,
      action: PayloadAction<{
        backViewUrl?: string | null;
        rightViewUrl?: string | null;
        leftViewUrl?: string | null;
      }>
    ) => {
      if (action.payload.backViewUrl) {
        state.backViewImage = action.payload.backViewUrl;
      }
      if (action.payload.rightViewUrl) {
        state.rightViewImage = action.payload.rightViewUrl;
      }
      if (action.payload.leftViewUrl) {
        state.leftViewImage = action.payload.leftViewUrl;
      }
      // state.isGenerating = false;
      // state.isGenerated = true;
    },
    setIsGeneratingImage: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setIsSideGenerated: (state, action: PayloadAction<boolean>) => {
      state.isGenerated = action.payload;
    },
    // reset generated images
    resetSideGeneratedImages: (state) => {
      state.backViewImage = null;
      state.rightViewImage = null;
      state.leftViewImage = null;
      state.isGenerated = false;
      state.isGenerating = false;
    },
  },
});

export const {
  resetSideImageState,
  generateSideImages,
  setIsGeneratingImage,
  resetSideGeneratedImages,
  setIsSideGenerated,
} = sideImageSlideSlice.actions;
export default sideImageSlideSlice.reducer;
