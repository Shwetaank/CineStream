"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Spinner, Card } from "flowbite-react";
import axios from "axios";
import Image from "next/image";
import Head from "next/head";
import { FaStar, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const TvSeriesDetails = ({ params }) => {
  const { id } = params;

  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const debounceTimeout = useRef(null);

  // Debounced function to fetch trailer ID
  const debounceFetchTrailerId = useCallback((title) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      const trailerId = await fetchTrailerId(title);
      setTrailerUrl(trailerId);
    }, 500);
  }, []); // No dependencies here, stable reference

  // Fetch trailer ID based on the title
  const fetchTrailerId = async (title) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        title + " trailer"
      )}&key=${apiKey}`;

      const response = await axios.get(searchUrl);

      // Log the response for debugging
      console.log("YouTube API response:", response);

      if (response.data.items.length > 0) {
        return response.data.items[0].id.videoId;
      }
      return "";
    } catch (error) {
      // Log the full error object for better understanding
      console.error(
        "Failed to fetch trailer:",
        error.response ? error.response.data : error.message
      );
      return "";
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchTvSeriesDetails = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
        const url = `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.Response === "True") {
          setSeries(response.data);
          debounceFetchTrailerId(response.data.Title);
        } else {
          setError(
            response.data.Error ||
              "TV series not found. Please check the ID and try again."
          );
        }
      } catch (err) {
        setError(`Failed to fetch TV series details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTvSeriesDetails();
  }, [id, debounceFetchTrailerId]); // Added debounceFetchTrailerId to dependencies

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500 text-center">{error} ❌</p>
      </div>
    );
  }

  // Share URLs with custom message
  const shareSeriesTitle = encodeURIComponent(
    `Check out this TV series: ${series.Title} 🎬`
  );
  const currentUrl = encodeURIComponent(window.location.href);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${shareSeriesTitle}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareSeriesTitle}&url=${currentUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${shareSeriesTitle}%20${currentUrl}`;

  // Define framer-motion variants for animation
  const containerVariants = {
    hidden: { perspective: 1000, opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { type: "spring", stiffness: 70, duration: 0.6 },
    },
  };

  return (
    series && (
      <>
        <Head>
          <title>{series.Title} - TV Series Details</title>
          <meta name="description" content={series.Plot} />
        </Head>

        <motion.div
          className="py-10 px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left Column: Series Poster */}
            <motion.div
              className="flex flex-col lg:w-1/3"
              variants={itemVariants}
            >
              {/* Series Poster */}
              <Card className="shadow-lg mb-6 dark:bg-gray-800">
                <Image
                  className="object-fill w-full h-[500px] rounded-lg"
                  src={
                    series.Poster !== "N/A" && series.Poster
                      ? series.Poster
                      : "/fallback.png"
                  }
                  alt={`${series.Title} Poster`}
                  width={600}
                  height={900}
                  priority
                />
              </Card>
              {/* Series Title and Basic Info */}
              <Card className="shadow-lg mb-6 dark:bg-gray-800">
                <div className="p-4">
                  <h1 className="text-3xl font-bold text-purple-700 mb-2">
                    {series.Title} 🌟
                  </h1>
                  <div className="flex items-center mb-2">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="text-lg font-semibold ">
                      {series.imdbRating}
                    </span>
                  </div>
                  <p className="text-md text-gray-500 dark:text-gray-400 mb-4">
                    <strong>{series.Year}</strong> |{" "}
                    <span className="cursor-pointer hover:underline">
                      {series.Genre}
                    </span>{" "}
                    |{" "}
                    <span className="text-yellow-500 font-semibold">
                      {series.Rated}
                    </span>
                  </p>
                  <p className="text-md text-gray-500 dark:text-gray-400 mb-4">
                    <strong className="text-purple-700">Released:</strong>{" "}
                    {series.Released} 🎉
                  </p>
                  <p className="text-md text-gray-500 dark:text-gray-400 mb-4">
                    <strong className="text-purple-700">Runtime:</strong>{" "}
                    {series.Runtime} ⏳
                  </p>

                  {/* Share Icons */}
                  <div className="flex justify-center gap-8 mt-4 items-center">
                    {/* Facebook Share */}
                    <a
                      href={facebookShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                      title="Share on Facebook"
                    >
                      <FaFacebook className="text-2xl cursor-pointer hover:text-blue-700" />
                    </a>

                    {/* Twitter Share */}
                    <a
                      href={twitterShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                      title="Share on Twitter"
                    >
                      <FaTwitter className="text-2xl cursor-pointer hover:text-blue-700" />
                    </a>

                    {/* WhatsApp Share */}
                    <a
                      href={whatsappShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500"
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp className="text-2xl cursor-pointer hover:text-green-600" />
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Right Column: Trailer and Plot Summary */}
            <motion.div className="lg:w-2/3" variants={itemVariants}>
              {/* Trailer Section */}
              <Card className="shadow-lg mb-6 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-purple-700 p-4 border-b border-gray-200 dark:border-gray-700">
                  Watch Trailer 🎥
                </h2>
                <div className="p-4">
                  {trailerUrl ? (
                    <div className="relative w-full h-0 pb-[56.25%]">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${trailerUrl}`}
                        title="Trailer"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      No trailer available.
                    </p>
                  )}
                </div>
              </Card>

              {/* Plot Summary */}
              <Card className="shadow-lg mb-6 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-purple-700 p-4 border-b border-gray-200 dark:border-gray-700">
                  Plot Summary 📖
                </h2>
                <div className="p-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    {series.Plot}
                  </p>
                </div>
              </Card>

              {/* Additional Details */}
              <Card className="shadow-lg mb-6 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-purple-700 p-4 border-b border-gray-200 dark:border-gray-700">
                  Additional Details 📚
                </h2>
                <div className="p-4">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    <strong className="text-purple-700">Director:</strong>{" "}
                    {series.Director}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    <strong className="text-purple-700">Actors:</strong>{" "}
                    {series.Actors}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    <strong className="text-purple-700">Awards:</strong>{" "}
                    {series.Awards}
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </>
    )
  );
};

export default TvSeriesDetails;
