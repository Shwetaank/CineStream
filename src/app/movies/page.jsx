"use client";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesByGenre, setPage } from "@/store/slices/movieSlice";
import { addBookmark } from "@/store/slices/bookmarkSlice";
import { Card, Spinner, Pagination, Alert} from "flowbite-react"; 
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaInfoCircle, FaBookmark, FaRegBookmark } from "react-icons/fa";

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

const MainMoviePage = () => {
  const dispatch = useDispatch();
  const {
    action,
    adventure,
    comedy,
    drama,
    horror,
    romance,
    thriller,
    fantasy,
    animation,
  } = useSelector((state) => state.movies);
  const { bookmarks } = useSelector((state) => state.bookmarks);
  const { width } = useWindowSize();
  const moviesPerPage = useMemo(() => (width <= 640 ? 1 : 4), [width]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");

  useEffect(() => {
    const genres = [
      "action",
      "adventure",
      "comedy",
      "drama",
      "horror",
      "romance",
      "thriller",
      "fantasy",
      "animation",
    ];
    genres.forEach((genre) => {
      dispatch(fetchMoviesByGenre({ genre, currentPage: 1 }));
    });
  }, [dispatch]);

  const handlePageChange = (genre, page) => {
    dispatch(setPage({ genre, page }));
    dispatch(fetchMoviesByGenre({ genre, currentPage: page }));
  };

  const handleBookmarkToggle = (movie) => {
    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.movieId === movie.imdbID
    );

    if (!isBookmarked) {
      dispatch(addBookmark({ movieId: movie.imdbID })).then(() => {
        setAlertMessage("Bookmark added to favorites!");
        setAlertColor("success");
        setAlertVisible(true);
      });
    }
  };

  const renderMoviesSection = (genre, moviesData) => {
    const { data, loading, error, currentPage, totalResults } = moviesData;
    const paginatedMovies = data.slice(
      (currentPage - 1) * moviesPerPage,
      currentPage * moviesPerPage
    );
    const totalPages = Math.ceil(totalResults / moviesPerPage);

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
          >
            {paginatedMovies.map((movie) => (
              <Card className="dark:bg-gray-800 shadow-lg" key={movie.imdbID}>
                <Image
                  className="w-full h-60 rounded-t-lg object-fill"
                  src={movie.Poster !== "N/A" ? movie.Poster : "/fallback.png"}
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
                <div className="flex justify-between p-4">
                  <Link
                    href={`/movies/${movie.imdbID}`}
                    className="flex items-center text-purple-700"
                  >
                    <FaInfoCircle className="mr-2" />
                    <span>See More</span>
                  </Link>
                  <button
                    onClick={() => handleBookmarkToggle(movie)}
                    aria-label="Bookmark movie"
                  >
                    {bookmarks.some(
                      (bookmark) => bookmark.movieId === movie.imdbID
                    ) ? (
                      <FaBookmark className="text-purple-700" />
                    ) : (
                      <FaRegBookmark className="text-gray-400" />
                    )}
                  </button>
                </div>
              </Card>
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
      {renderMoviesSection("drama", drama)}
      {renderMoviesSection("horror", horror)}
      {renderMoviesSection("romance", romance)}
      {renderMoviesSection("thriller", thriller)}
      {renderMoviesSection("fantasy", fantasy)}
      {renderMoviesSection("animation", animation)}

      {/* Alert Notification */}
      {alertVisible && (
        <div className="fixed top-16 right-4 z-50">
          <Alert color={alertColor} onDismiss={() => setAlertVisible(false)}>
            {alertMessage}
          </Alert>
        </div>
      )}
    </div>
  );
};

export default MainMoviePage;
