import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch movies by genre and page
export const fetchMoviesByGenre = createAsyncThunk(
  "movies/fetchMoviesByGenre",
  async ({ genre, currentPage }) => {
    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    if (!apiKey) throw new Error("API key is missing");

    const responses = await Promise.all([
      axios.get(
        `https://www.omdbapi.com/?s=${genre}&page=${currentPage}&apikey=${apiKey}`
      ),
      axios.get(
        `https://www.omdbapi.com/?s=${genre}&page=${
          currentPage + 1
        }&apikey=${apiKey}`
      ),
    ]);

    const movies = [];

    responses.forEach((response) => {
      if (response.data.Response === "True") {
        const detailedMovies = response.data.Search.map((movie) =>
          axios.get(
            `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`
          )
        );

        movies.push(...detailedMovies);
      }
    });

    // Wait for all detailed movie requests to finish
    const detailedMovies = await Promise.all(movies);

    // Sort movies by release year in descending order
    const sortedMovies = detailedMovies
      .map((movie) => movie.data)
      .sort((a, b) => {
        const yearA = parseInt(a.Released.split(" ")[2]) || 0; // Extract year
        const yearB = parseInt(b.Released.split(" ")[2]) || 0; // Extract year
        return yearB - yearA; // Sort descending
      });

    return {
      genre,
      movies: sortedMovies.slice(0, 20), // Return only the first 20 movies
      totalResults: sortedMovies.length,
    };
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    action: {
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    },
    adventure: {
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
    sciFi: {
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
    resetMovies: (state) => {
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
