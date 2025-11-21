import type { SideImageSlideState } from "./types";

export const initialState: SideImageSlideState = {
    isGenerating: false,
    backViewImage: null,
    rightViewImage: null,
    leftViewImage: null,
    isGenerated: false,
};


const DEFAULT_BACK_VIEW_URL = 'https://t3.ftcdn.net/jpg/15/05/74/84/360_F_1505748495_pvFsplFe5nfWrAimH3SCAvXOZfQNMx18.jpg';
const DEFAULT_LEFT_VIEW_URL = 'https://cdn.shopify.com/s/files/1/0029/0868/4397/files/Modern_Pompadour_and_Low_Taper_Fade.png?v=1747859628';
const DEFAULT_RIGHT_VIEW_URL = 'https://i.pinimg.com/736x/01/7b/28/017b28496f9092ca3e361843fbc6ede9.jpg';

export { DEFAULT_BACK_VIEW_URL, DEFAULT_LEFT_VIEW_URL, DEFAULT_RIGHT_VIEW_URL };