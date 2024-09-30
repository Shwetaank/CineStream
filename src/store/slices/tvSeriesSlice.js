import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch TV series by genre and page
export const fetchTvSeriesByGenre = createAsyncThunk(
  "tvSeries/fetchTvSeriesByGenre",
  async ({ genre, currentPage }) => {
    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    if (!apiKey) throw new Error("API key is missing");

    const responses = await Promise.all([
      axios.get(
        `https://www.omdbapi.com/?s=${genre}&page=${currentPage}&type=series&apikey=${apiKey}`
      ),
      axios.get(
        `https://www.omdbapi.com/?s=${genre}&page=${
          currentPage + 1
        }&type=series&apikey=${apiKey}`
      ),
    ]);

    const series = [];

    responses.forEach((response) => {
      if (response.data.Response === "True") {
        const detailedSeries = response.data.Search.map((series) =>
          axios.get(
            `https://www.omdbapi.com/?i=${series.imdbID}&apikey=${apiKey}`
          )
        );

        series.push(...detailedSeries);
      }
    });

    // Wait for all detailed series requests to finish
    const detailedSeries = await Promise.all(series);

    // Sort series by release year in descending order
    const sortedSeries = detailedSeries
      .map((series) => series.data)
      .sort((a, b) => {
        const yearA = parseInt(a.Released.split(" ")[2]) || 0; // Extract year
        const yearB = parseInt(b.Released.split(" ")[2]) || 0; // Extract year
        return yearB - yearA; // Sort descending
      });

    return {
      genre,
      series: sortedSeries.slice(0, 20), // Return only the first 20 series
      totalResults: sortedSeries.length,
    };
  }
);

const tvSlice = createSlice({
  name: "tvSeries",
  initialState: {
    action: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    comedy: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    drama: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    horror: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    romance: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    thriller: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    sciFi: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    fantasy: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    animation: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
  },
  reducers: {
    setPage: (state, action) => {
      const { genre, page } = action.payload;
      state[genre].currentPage = page;
    },
    resetTvSeries: (state) => {
      Object.keys(state).forEach((genre) => {
        state[genre].data = [];
        state[genre].totalResults = 0;
        state[genre].loading = false;
        state[genre].error = null;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTvSeriesByGenre.pending, (state, action) => {
        const genre = action.meta.arg.genre;
        state[genre].loading = true;
        state[genre].error = null;
      })
      .addCase(fetchTvSeriesByGenre.fulfilled, (state, action) => {
        const { genre, series, totalResults } = action.payload;
        state[genre].data = series;
        state[genre].totalResults = totalResults;
        state[genre].loading = false;
      })
      .addCase(fetchTvSeriesByGenre.rejected, (state, action) => {
        const genre = action.meta.arg.genre;
        state[genre].loading = false;
        state[genre].error = action.error.message;
      });
  },
});

export const { setPage, resetTvSeries } = tvSlice.actions;

export default tvSlice.reducer;
