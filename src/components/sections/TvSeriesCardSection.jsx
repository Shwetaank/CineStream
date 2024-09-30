// components/TvSeriesCardSection.js

"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTvSeriesByGenre, setPage } from "@/store/slices/tvSeriesSlice";
import { Card, Spinner, Pagination, Button } from "flowbite-react";
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

const TvSeriesCardSection = () => {
  const dispatch = useDispatch();
  const { drama, horror, thriller } = useSelector((state) => state.tvSeries);

  const { width } = useWindowSize();
  const seriesPerPage = useMemo(() => (width <= 640 ? 1 : 4), [width]);

  const getCurrentPageByGenre = useCallback(
    (genre) => {
      switch (genre) {
        case "drama":
          return drama.currentPage;
        case "horror":
          return horror.currentPage;
        case "thriller":
          return thriller.currentPage;
        default:
          return 1;
      }
    },
    [drama.currentPage, horror.currentPage, thriller.currentPage]
  );

  useEffect(() => {
    const genres = ["drama", "horror", "thriller"];
    genres.forEach((genre) => {
      dispatch(
        fetchTvSeriesByGenre({
          genre,
          currentPage: getCurrentPageByGenre(genre),
        })
      );
    });
  }, [dispatch, getCurrentPageByGenre]);

  const handlePageChange = (genre, page) => {
    dispatch(setPage({ genre, page }));
    dispatch(fetchTvSeriesByGenre({ genre, currentPage: page }));
  };

  const renderTvSeriesSection = (genre, tvData) => {
    const { data, loading, error, currentPage, totalResults } = tvData;
    const paginatedSeries = data.slice(
      (currentPage - 1) * seriesPerPage,
      currentPage * seriesPerPage
    );
    const totalPages = Math.ceil(totalResults / seriesPerPage);

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
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {paginatedSeries.map((series, i) => (
              <Link href={`/tv-series/${series.imdbID}`} key={series.imdbID}>
                <motion.div custom={i} variants={cardVariants}>
                  <Card className="bg-gray-200 dark:bg-gray-800 shadow-lg">
                    <Image
                      className="w-full h-60 rounded-t-lg object-fill"
                      src={series.Poster !== "N/A" ? series.Poster : "/fallback.png"} 
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
            disabled={totalResults <= seriesPerPage || totalResults === 0}
            aria-label={`${genre} TV series pagination`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="pt-16 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-4xl font-bold mb-6 text-center text-purple-700">Explore TV Series</h2>
      {renderTvSeriesSection("drama", drama)}
      {renderTvSeriesSection("horror", horror)}
      {renderTvSeriesSection("thriller", thriller)}
      {/* Explore More Button */}
      <motion.div
        className="flex justify-center animate-pulse-smooth mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/tv-series">
          <Button outline gradientDuoTone="purpleToBlue">
            Explore More
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default TvSeriesCardSection;
