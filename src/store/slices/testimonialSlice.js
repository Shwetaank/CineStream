import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch Testimonials
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchTestimonials",
  async () => {
    const response = await axios.get("/api/testimonials");
    return response.data.testimonials; 
  }
);

// Async thunk to add a new Testimonial
export const addTestimonial = createAsyncThunk(
  "testimonials/addTestimonial",
  async (testimonialData) => {
    const response = await axios.post("/api/testimonials", testimonialData);
    return response.data.testimonial; 
  }
);

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState: {
    testimonials: [],
    status: "idle",
    addStatus: "idle", 
    error: null,
    addError: null, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch testimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.testimonials = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add testimonial
      .addCase(addTestimonial.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(addTestimonial.fulfilled, (state, action) => {
        state.testimonials.push(action.payload);
        state.addStatus = "succeeded";
      })
      .addCase(addTestimonial.rejected, (state, action) => {
        state.addStatus = "failed";
        state.addError = action.error.message;
      });
  },
});

export default testimonialSlice.reducer;
