"use client";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTvSeriesByGenre, setPage } from "@/store/slices/tvSeriesSlice";
import { addBookmark } from "@/store/slices/bookmarkSlice";
import { Card, Spinner, Pagination, Alert } from "flowbite-react"; 
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

const MainTvSeriesPage = () => {
  const dispatch = useDispatch();
  const {
    action,
    comedy,
    drama,
    horror,
    romance,
    thriller,
    sciFi,
    fantasy,
    animation,
  } = useSelector((state) => state.tvSeries);
  const { bookmarks } = useSelector((state) => state.bookmarks);
  const { width } = useWindowSize();
  const seriesPerPage = useMemo(() => (width <= 640 ? 1 : 4), [width]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");

  useEffect(() => {
    const genres = [
      "action",
      "comedy",
      "drama",
      "horror",
      "romance",
      "thriller",
      "sciFi",
      "fantasy",
      "animation",
    ];
    genres.forEach((genre) => {
      dispatch(fetchTvSeriesByGenre({ genre, currentPage: 1 }));
    });
  }, [dispatch]);

  const handlePageChange = (genre, page) => {
    dispatch(setPage({ genre, page }));
    dispatch(fetchTvSeriesByGenre({ genre, currentPage: page }));
  };

  const handleBookmarkToggle = (tvSeries) => {
    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.tvSeriesId === tvSeries.imdbID
    );

    if (!isBookmarked) {
      dispatch(addBookmark({ tvSeriesId: tvSeries.imdbID })).then(() => {
        setAlertMessage("Bookmark added to favorites!");
        setAlertColor("success");
        setAlertVisible(true);
      });
    }
  };

  const renderTvSeriesSection = (genre, tvSeriesData) => {
    const { data, loading, error, currentPage, totalResults } = tvSeriesData;
    const paginatedSeries = data.slice(
      (currentPage - 1) * seriesPerPage,
      currentPage * seriesPerPage
    );
    const totalPages = Math.ceil(totalResults / seriesPerPage);

    return (
      <div className="mb-12">
        <h3 className="text-3xl font-semibold mb-4">
          {genre.charAt(0).toUpperCase() + genre.slice(1)} TV Series
        </h3>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner color="purple" size="xl" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : paginatedSeries.length === 0 ? (
          <p className="text-red-500 text-center font-semibold">
            No TV series found. Try again please 😢
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
          >
            {paginatedSeries.map((series) => (
              <Card className="dark:bg-gray-800 shadow-lg" key={series.imdbID}>
                <Image
                  className="w-full h-60 rounded-t-lg object-fill"
                  src={
                    series.Poster !== "N/A" ? series.Poster : "/fallback.png"
                  }
                  alt={`${series.Title} Poster`}
                  width={300}
                  height={320}
                  priority
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-purple-700">
                    {series.Title} ({series.Year})
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Rated:</strong> {series.Rated || "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Genre:</strong> {series.Genre || "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Runtime:</strong> {series.Runtime || "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Released:</strong> {series.Released || "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-justify">
                    <strong>Plot:</strong> {series.Plot || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between p-4">
                  <Link
                    href={`/tv-series/${series.imdbID}`}
                    className="flex items-center text-purple-700"
                  >
                    <FaInfoCircle className="mr-2" />
                    <span>See More</span>
                  </Link>
                  <button
                    onClick={() => handleBookmarkToggle(series)}
                    aria-label="Bookmark TV series"
                  >
                    {bookmarks.some(
                      (bookmark) => bookmark.tvSeriesId === series.imdbID
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
            disabled={totalResults <= seriesPerPage || totalResults === 0}
            aria-label={`${genre} TV series pagination`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="pt-16 pb-20 px-4 sm:px-6 md:px-10 lg:px-12">
      <h2 className="text-4xl font-bold mb-6 text-center">Explore TV Series</h2>
      {renderTvSeriesSection("action", action)}
      {renderTvSeriesSection("comedy", comedy)}
      {renderTvSeriesSection("drama", drama)}
      {renderTvSeriesSection("horror", horror)}
      {renderTvSeriesSection("romance", romance)}
      {renderTvSeriesSection("thriller", thriller)}
      {renderTvSeriesSection("sciFi", sciFi)}
      {renderTvSeriesSection("fantasy", fantasy)}
      {renderTvSeriesSection("animation", animation)}

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

export default MainTvSeriesPage;
