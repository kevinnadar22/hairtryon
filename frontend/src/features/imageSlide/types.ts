interface ImageSlideState {
    styleId: number | null;
    generatedImageId: number | null;
    generatedImage: string | null;
    isGenerating: boolean;
    barberDescription: string;
    }

interface GenerateImageReducerPayload {
    imageUrl: string;
    imageId: number;
    description?: string;
}

export type { ImageSlideState, GenerateImageReducerPayload };