import type { ImageSlideState } from "./types";

const initialState: ImageSlideState = {
    styleId: null,
    generatedImageId: null,
    generatedImage: null,
    barberDescription: '',
    isGenerating: false,
}

const DEFAULT_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdozAHnzDOjuITBo4xUmeoRMkTIQNr4SS_KAGAYyMxtU2ZN5plJoOMNFJWptsX6APJ1R_QlIJyEaBJCxh81rwPfwsC2DM96lkyPOqGPY-1Ppf8FFsI-I9AWmE7eyUzAWTzfuvGW3BiLs0tAeSi7YlRRFkKn7DOUll6TuhSLYvEigsMChHaVogCCuoSffyjwD8qKqk-lN3UOQne-r4WO84KpsxWbrA_YMeFyzlsCsYwlRUkaH7SbDodH90-f6qxl50wZV1xKZSsHKI';
export { initialState, DEFAULT_IMAGE_URL };