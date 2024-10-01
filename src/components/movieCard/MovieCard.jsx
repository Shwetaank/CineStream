"use client"; // Ensure you're using this in a client component context
import { Card } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const MovieCard = ({ movie, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <Link href={`/movies/${movie.imdbID}`}>
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="dark:bg-gray-800 shadow-lg transition-transform transform hover:scale-105">
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
        </Card>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
