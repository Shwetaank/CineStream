import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch TV series by genre and page
export const fetchTvSeriesByGenre = createAsyncThunk(
  "tvSeries/fetchTvSeriesByGenre",
  async ({ genre, currentPage }) => {
    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    if (!apiKey) throw new Error("API key is missing");

    const response = await axios.get(
      `https://www.omdbapi.com/?s=${genre}&page=${currentPage}&type=series&apikey=${apiKey}`
    );

    if (response.data.Response === "True") {
      const detailedSeries = await Promise.all(
        response.data.Search.map((series) =>
          axios.get(
            `https://www.omdbapi.com/?i=${series.imdbID}&apikey=${apiKey}`
          )
        )
      );

      return {
        genre,
        series: detailedSeries.map((series) => series.data),
        totalResults: response.data.totalResults,
      };
    }

    throw new Error("TV series not found");
  }
);

// Async thunk to fetch a random TV series
export const fetchRandomTvSeries = createAsyncThunk(
  "tvSeries/fetchRandomTvSeries",
  async () => {
    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    if (!apiKey) throw new Error("API key is missing");

    // Generate a random year or a random genre to get a random TV series
    const randomYear = Math.floor(Math.random() * (2023 - 1950 + 1)) + 1950; // Random year between 1950 and 2023
    const response = await axios.get(
      `https://www.omdbapi.com/?s=series&y=${randomYear}&type=series&apikey=${apiKey}`
    );

    if (response.data.Response === "True") {
      // Select a random series from the fetched results
      const randomSeries =
        response.data.Search[
          Math.floor(Math.random() * response.data.Search.length)
        ];

      const detailedSeriesResponse = await axios.get(
        `https://www.omdbapi.com/?i=${randomSeries.imdbID}&apikey=${apiKey}`
      );

      return detailedSeriesResponse.data;
    }

    throw new Error("Random TV series not found");
  }
);

const tvSlice = createSlice({
  name: "tvSeries",
  initialState: {
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
    thriller: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    random: { data: null, loading: false, error: null },
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
      state.random.data = null;
      state.random.loading = false;
      state.random.error = null;
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
      })
      .addCase(fetchRandomTvSeries.pending, (state) => {
        state.random.loading = true;
        state.random.error = null;
      })
      .addCase(fetchRandomTvSeries.fulfilled, (state, action) => {
        state.random.data = action.payload;
        state.random.loading = false;
      })
      .addCase(fetchRandomTvSeries.rejected, (state, action) => {
        state.random.loading = false;
        state.random.error = action.error.message;
      });
  },
});

export const { setPage, resetTvSeries } = tvSlice.actions;

export default tvSlice.reducer;
