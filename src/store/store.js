import testimonialReducer from "@/store/slices/testimonialSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    testimonials: testimonialReducer,
  },
});
