"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spinner, Pagination, Button } from "flowbite-react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const MovieCardSection = () => {
  const [movies, setMovies] = useState({
    action: { data: [], loading: true, error: null, currentPage: 1, totalResults: 0 },
    adventure: { data: [], loading: true, error: null, currentPage: 1, totalResults: 0 },
    comedy: { data: [], loading: true, error: null, currentPage: 1, totalResults: 0 }
  });

  const [moviesPerPage, setMoviesPerPage] = useState(4); // Default to 4 movies per page for larger screens
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
  const router = useRouter(); // Initialize useRouter for page redirection

  // Set movies per page based on screen size
  useEffect(() => {
    const updateMoviesPerPage = () => {
      if (window.innerWidth < 640) {
        setMoviesPerPage(1); // On small screens, only 1 movie per page
      } else {
        setMoviesPerPage(4); // On larger screens, 4 movies per page
      }
    };

    updateMoviesPerPage();
    window.addEventListener('resize', updateMoviesPerPage);

    return () => {
      window.removeEventListener('resize', updateMoviesPerPage);
    };
  }, []);

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch movie details for ID ${imdbID}:`, error);
      return null;
    }
  };

  const fetchMoviesByGenre = async (genre, currentPage) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?s=${genre}&page=${currentPage}&apikey=${apiKey}`);
      if (response.data.Response === "True") {
        const detailedMovies = await Promise.all(response.data.Search.map(movie => fetchMovieDetails(movie.imdbID)));
        return { movies: detailedMovies, totalResults: response.data.totalResults };
      }
      return { movies: [], totalResults: 0 };
    } catch (error) {
      return { movies: [], totalResults: 0 };
    }
  };

  // Fetch action movies separately
  useEffect(() => {
    const fetchActionMovies = async () => {
      setMovies((prev) => ({ ...prev, action: { ...prev.action, loading: true } }));
      const actionData = await fetchMoviesByGenre("Action", movies.action.currentPage);
      setMovies((prev) => ({
        ...prev,
        action: { data: actionData.movies, loading: false, error: null, currentPage: prev.action.currentPage, totalResults: actionData.totalResults }
      }));
    };
    fetchActionMovies();
  }, [movies.action.currentPage]);

  // Fetch adventure movies separately
  useEffect(() => {
    const fetchAdventureMovies = async () => {
      setMovies((prev) => ({ ...prev, adventure: { ...prev.adventure, loading: true } }));
      const adventureData = await fetchMoviesByGenre("Adventure", movies.adventure.currentPage);
      setMovies((prev) => ({
        ...prev,
        adventure: { data: adventureData.movies, loading: false, error: null, currentPage: prev.adventure.currentPage, totalResults: adventureData.totalResults }
      }));
    };
    fetchAdventureMovies();
  }, [movies.adventure.currentPage]);

  // Fetch comedy movies separately
  useEffect(() => {
    const fetchComedyMovies = async () => {
      setMovies((prev) => ({ ...prev, comedy: { ...prev.comedy, loading: true } }));
      const comedyData = await fetchMoviesByGenre("Comedy", movies.comedy.currentPage);
      setMovies((prev) => ({
        ...prev,
        comedy: { data: comedyData.movies, loading: false, error: null, currentPage: prev.comedy.currentPage, totalResults: comedyData.totalResults }
      }));
    };
    fetchComedyMovies();
  }, [movies.comedy.currentPage]);

  const renderMoviesSection = (genre) => {
    const { data, loading, error, currentPage, totalResults } = movies[genre];

    // Calculate the start and end index for slicing movies based on the current page
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const paginatedMovies = data.slice(startIndex, endIndex);

    return (
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-purple-600 mb-4">{genre.charAt(0).toUpperCase() + genre.slice(1)} Movies</h3>
        {loading ? (
          <Spinner color="purple" />
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : paginatedMovies.length === 0 ? (
          <p className="text-gray-500 text-center">No movies found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedMovies.map((movie) => (
              <Card key={movie.imdbID} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300">
                <img className="w-full h-40 object-cover rounded-t-lg" src={movie.Poster} alt={movie.Title} />
                <div className="p-2">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white">{movie.Title} ({movie.Year})</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300"><strong>Rated:</strong> {movie.Rated || "N/A"}</p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300"><strong>Genre:</strong> {movie.Genre || "N/A"}</p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300"><strong>Runtime:</strong> {movie.Runtime || "N/A"}</p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300"><strong>Released:</strong> {movie.Released || "N/A"}</p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 line-clamp-2"><strong>Plot:</strong> {movie.Plot || "N/A"}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Centered Pagination */}
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            onPageChange={(page) => setMovies((prev) => ({ ...prev, [genre]: { ...prev[genre], currentPage: page } }))}
            totalPages={Math.ceil(totalResults / moviesPerPage)}
            disabled={totalResults <= moviesPerPage} // Disable pagination if there's only one page
          />
        </div>
      </div>
    );
  };

  return (
    <div className="pt-16 pb-20 flex flex-col bg-gray-50 dark:bg-gray-900">
      <h2 className="text-4xl font-bold mb-6 text-purple-700 text-center">Explore Movies</h2>
      {renderMoviesSection('action')}
      {renderMoviesSection('adventure')}
      {renderMoviesSection('comedy')}
      
      {/* Browse More Button */}
      <div className="flex justify-center mt-10">
        <Button color="purple" size="lg" onClick={() => router.push('/movies')}>
          Browse More Movies
        </Button>
      </div>
    </div>
  );
};

export default MovieCardSection;
