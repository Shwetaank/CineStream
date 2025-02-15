import movieReducer from "@/store/slices/movieSlice";
import tvReducer from "@/store/slices/tvSeriesSlice";
import testimonialReducer from "@/store/slices/testimonialSlice";
import bookmarkReducer from "@/store/slices/bookmarkSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    testimonials: testimonialReducer,
    movies: movieReducer,
    tvSeries: tvReducer,
    bookmarks: bookmarkReducer,
  },
});
