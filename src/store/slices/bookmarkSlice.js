import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch bookmarks
export const fetchBookmarks = createAsyncThunk('bookmarks/fetchBookmarks', async () => {
  const response = await axios.get('/api/bookmark');
  return response.data.bookmarks; // Ensure this matches your API response structure
});

// Async thunk to create a new bookmark
export const addBookmark = createAsyncThunk('bookmarks/addBookmark', async (bookmarkData) => {
  const response = await axios.post('/api/bookmark', bookmarkData);
  return response.data.bookmark; // Ensure this matches your API response structure
});

// Async thunk to delete a bookmark
export const deleteBookmark = createAsyncThunk('bookmarks/deleteBookmark', async (id) => {
  await axios.delete('/api/bookmark', { data: { id } });
  return id; // Return the id of the deleted bookmark
});

// Initial state
const initialState = {
  bookmarks: [],
  loading: false,
  error: null,
};

// Create bookmark slice
const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    clearBookmarks: (state) => {
      state.bookmarks = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch bookmarks
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload; // Populate bookmarks from payload
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
        console.error("Error fetching bookmarks:", action.error.message);
      })
      // Add bookmark
      .addCase(addBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks.push(action.payload); // Add new bookmark to the state
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
        console.error("Error adding bookmark:", action.error.message);
      })
      // Delete bookmark
      .addCase(deleteBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the bookmark from the state
        state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== action.payload);
      })
      .addCase(deleteBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
        console.error("Error deleting bookmark:", action.error.message);
      });
  },
});

// Export actions
export const { clearBookmarks } = bookmarkSlice.actions;

// Export reducer
export default bookmarkSlice.reducer;
