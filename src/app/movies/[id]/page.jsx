"use client";
import { useEffect, useState } from "react";
import { Spinner, Card } from "flowbite-react";
import axios from "axios";
import Image from "next/image";
import Head from "next/head";
import { FaStar, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const MovieDetails = ({ params }) => {
  const { id } = params;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
        const url = `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.Response === "True") {
          setMovie(response.data);
          const trailerId = await fetchTrailerId(response.data.Title);
          setTrailerUrl(trailerId);
        } else {
          setError(
            response.data.Error ||
              "Movie not found. Please check the ID and try again."
          );
        }
      } catch (err) {
        setError(`Failed to fetch movie details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchTrailerId = async (title) => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          title + " trailer"
        )}&key=${apiKey}`;

        const response = await axios.get(searchUrl);
        console.log(response.data);
        if (response.data.items.length > 0) {
          return response.data.items[0].id.videoId;
        }
        return "";
      } catch (error) {
        console.error("Failed to fetch trailer:", error);
        return "";
      }
    };

    fetchMovieDetails();
  }, [id]);

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
  const shareMovieTitle = encodeURIComponent(
    `Check out this movie: ${movie.Title} 🎬`
  );
  const currentUrl = encodeURIComponent(window.location.href);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${shareMovieTitle}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareMovieTitle}&url=${currentUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${shareMovieTitle}%20${currentUrl}`;

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
    movie && (
      <>
        <Head>
          <title>{movie.Title} - Movie Details</title>
          <meta name="description" content={movie.Plot} />
        </Head>

        <motion.div
          className="py-10 px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left Column: Movie Poster */}
            <motion.div
              className="flex flex-col lg:w-1/3"
              variants={itemVariants}
            >
              {/* Movie Poster */}
              <Card className="shadow-lg mb-6  dark:bg-gray-800">
                <Image
                  className="object-fill w-full h-[500px] rounded-lg"
                  src={movie.Poster}
                  alt={`${movie.Title} Poster`}
                  width={600}
                  height={900}
                  priority
                />
              </Card>
              {/* Movie Title and Basic Info */}
              <Card className="shadow-lg mb-6  dark:bg-gray-800">
                <div className="p-4">
                  <h1 className="text-3xl font-bold text-purple-700 mb-2">
                    {movie.Title} 🌟
                  </h1>
                  <div className="flex items-center mb-2">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="text-lg font-semibold ">
                      {movie.imdbRating}
                    </span>
                  </div>
                  <p className="text-md text-gray-500 dark:text-gray-400 mb-4">
                    <strong>{movie.Year}</strong> |{" "}
                    <span className="cursor-pointer hover:underline">
                      {movie.Genre}
                    </span>{" "}
                    |{" "}
                    <span className="text-yellow-500 font-semibold">
                      {movie.Rated}
                    </span>
                  </p>
                  <p className="text-md text-gray-500 dark:text-gray-400 mb-4">
                    <strong className="text-purple-700">Released:-</strong>{" "}
                    {movie.Released} 🎉
                  </p>
                  <p className="text-md text-gray-500 dark:text-gray-400 mb-4">
                    <strong className="text-purple-700">Runtime:-</strong>{" "}
                    {movie.Runtime} ⏳
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

            {/* Right Column: Trailer, Movie Title and Basic Info */}
            <motion.div className="lg:w-2/3" variants={itemVariants}>
              {/* Trailer Section */}
              <Card className="shadow-lg mb-6  dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-purple-700 p-4 border-b border-gray-200 dark:border-gray-700">
                  Watch Trailer 🎥
                </h2>
                <div className="p-4">
                  {trailerUrl ? (
                    <div className="relative w-full h-0 pb-[56.25%]">
                      {" "}
                      {/* 16:9 Aspect Ratio */}
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${trailerUrl}`}
                        title={`Trailer for ${movie.Title}`}
                        style={{ border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Trailer Not Available 🚫
                    </p>
                  )}
                </div>
              </Card>

              {/* Plot Summary */}
              <Card className="shadow-lg mb-6  dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-purple-700 p-4 border-b border-gray-200 dark:border-gray-700">
                  Plot Summary 📜
                </h2>
                <div className="p-4">
                  <p className="text-md text-gray-600 dark:text-gray-300 text-justify">
                    {movie.Plot}
                  </p>
                </div>
              </Card>

              {/* Ratings Section */}
              <Card className="shadow-lg  dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-purple-700 p-4 border-b border-gray-200 dark:border-gray-700">
                  Ratings & Stats 📊
                </h2>
                <div className="p-4">
                  <p className="text-md text-gray-600 dark:text-gray-300 mb-2">
                    <strong className="text-purple-700">Awards :-</strong>{" "}
                    {movie.Awards} 🏆
                  </p>
                  <ul className="space-y-2">
                    {movie.Ratings.map((rating) => (
                      <li
                        key={rating.Source}
                        className="text-sm text-gray-600 dark:text-gray-300 flex justify-between"
                      >
                        <span>{rating.Source}</span>
                        <span>{rating.Value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </>
    )
  );
};

export default MovieDetails;
