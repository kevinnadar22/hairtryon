import { configureStore } from "@reduxjs/toolkit";
import {
  sideImageSlideReducer,
  imageSlideReducer,
  authReducer,
} from "@/features";

const store = configureStore({
  reducer: {
    imageSlide: imageSlideReducer,
    sideImageSlide: sideImageSlideReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
