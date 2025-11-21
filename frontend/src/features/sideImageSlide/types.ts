interface SideImageSlideState {
    // back view url, right and left view url, 
    isGenerating: boolean;
    backViewImage: string | null;
    rightViewImage: string | null;
    leftViewImage: string | null;
    isGenerated: boolean;
}

export type { SideImageSlideState };