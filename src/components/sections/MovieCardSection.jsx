"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesByGenre, setPage } from "@/store/slices/movieSlice";
import { Card, Spinner, Pagination } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Custom hook for detecting window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth });

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useMemo(() => windowSize, [windowSize]);
};

const MovieCardSection = () => {
  const dispatch = useDispatch();
  const { action, adventure, comedy } = useSelector((state) => state.movies);

  const { width } = useWindowSize();
  const moviesPerPage = useMemo(() => (width <= 640 ? 1 : 4), [width]);

  const getCurrentPageByGenre = useCallback(
    (genre) => {
      switch (genre) {
        case "action":
          return action.currentPage;
        case "adventure":
          return adventure.currentPage;
        case "comedy":
          return comedy.currentPage;
        default:
          return 1;
      }
    },
    [action.currentPage, adventure.currentPage, comedy.currentPage]
  );

  useEffect(() => {
    const genres = ["action", "adventure", "comedy"];
    genres.forEach((genre) => {
      dispatch(
        fetchMoviesByGenre({ genre, currentPage: getCurrentPageByGenre(genre) })
      );
    });
  }, [dispatch, getCurrentPageByGenre]);

  const handlePageChange = (genre, page) => {
    dispatch(setPage({ genre, page }));
    dispatch(fetchMoviesByGenre({ genre, currentPage: page }));
  };

  const renderMoviesSection = (genre, moviesData) => {
    const { data, loading, error, currentPage, totalResults } = moviesData;
    const paginatedMovies = data.slice(
      (currentPage - 1) * moviesPerPage,
      currentPage * moviesPerPage
    );
    const totalPages = Math.ceil(totalResults / moviesPerPage);

    // Animation variants for motion
    const cardVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
      }),
    };

    return (
      <div className="mb-12">
        <h3 className="text-3xl font-semibold mb-4">
          {genre.charAt(0).toUpperCase() + genre.slice(1)} Movies
        </h3>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner color="purple" size="xl" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : paginatedMovies.length === 0 ? (
          <p className="text-red-500 text-center font-semibold">
            No movies found. Try again please 😢
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {paginatedMovies.map((movie, i) => (
              <Link href={`/movies/${movie.imdbID}`} key={movie.imdbID}>
                <motion.div custom={i} variants={cardVariants}>
                  <Card className="bg-gray-200 dark:bg-gray-800 shadow-lg">
                    <Image
                      className="w-full h-60 rounded-t-lg object-fill"
                      src={movie.Poster}
                      alt={`${movie.Title} Poster`}
                      width={300}
                      height={320}
                      priority
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-purple-700">
                        {movie.Title} ({movie.Year})
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Rated:</strong> {movie.Rated || "N/A"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Genre:</strong> {movie.Genre || "N/A"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Runtime:</strong> {movie.Runtime || "N/A"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Released:</strong> {movie.Released || "N/A"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-justify">
                        <strong>Plot:</strong> {movie.Plot || "N/A"}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            showIcons
            onPageChange={(page) => handlePageChange(genre, page)}
            totalPages={totalPages}
            disabled={totalResults <= moviesPerPage || totalResults === 0}
            aria-label={`${genre} movie pagination`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="pt-16 pb-20 px-4 sm:px-6 md:px-10 lg:px-12">
      <h2 className="text-4xl font-bold mb-6 text-center">Explore Movies</h2>
      {renderMoviesSection("action", action)}
      {renderMoviesSection("adventure", adventure)}
      {renderMoviesSection("comedy", comedy)}
    </div>
  );
};

export default MovieCardSection;
