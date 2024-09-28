// slice 
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch movies by genre and page
export const fetchMoviesByGenre = createAsyncThunk(
  "movies/fetchMoviesByGenre",
  async ({ genre, currentPage }) => {
    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    if (!apiKey) throw new Error("API key is missing");

    const response = await axios.get(
      `https://www.omdbapi.com/?s=${genre}&page=${currentPage}&apikey=${apiKey}`
    );

    if (response.data.Response === "True") {
      const detailedMovies = await Promise.all(
        response.data.Search.map((movie) =>
          axios.get(
            `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`
          )
        )
      );

      return {
        genre,
        movies: detailedMovies.map(movie => movie.data),
        totalResults: response.data.totalResults,
      };
    }

    throw new Error("Movies not found");
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    action: { data: [], loading: false, error: null, currentPage: 1, totalResults: 0 },
    adventure: { data: [], loading: false, error: null, currentPage: 1, totalResults: 0 },
    comedy: { data: [], loading: false, error: null, currentPage: 1, totalResults: 0 },
  },
  reducers: {
    setPage: (state, action) => {
      const { genre, page } = action.payload;
      state[genre].currentPage = page;
    },
    resetMovies: (state) => {
      Object.keys(state).forEach(genre => {
        state[genre].data = [];
        state[genre].totalResults = 0;
        state[genre].loading = false;
        state[genre].error = null;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesByGenre.pending, (state, action) => {
        const genre = action.meta.arg.genre;
        state[genre].loading = true;
        state[genre].error = null;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        const { genre, movies, totalResults } = action.payload;
        state[genre].data = movies;
        state[genre].totalResults = totalResults;
        state[genre].loading = false;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        const genre = action.meta.arg.genre;
        state[genre].loading = false;
        state[genre].error = action.error.message;
      });
  },
});

export const { setPage, resetMovies } = movieSlice.actions;

export default movieSlice.reducer;
