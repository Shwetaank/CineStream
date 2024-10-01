"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "@/components/movieCard/MovieCard";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) return; // Early return if no query

      setLoading(true);
      setError(null); // Reset error state on new search

      try {
        // Fetch initial movie search results
        const { data } = await axios.get(
          `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${encodeURIComponent(query)}`
        );

        console.log(data); // Log the full response for debugging

        if (data.Response === "True") {
          // Fetch detailed information for each movie
          const detailedResults = await Promise.all(
            data.Search.map(async (movie) => {
              const detailResponse = await axios.get(
                `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${movie.imdbID}`
              );
              return detailResponse.data;
            })
          );
          setResults(detailedResults);
        } else {
          setResults([]); // No results found
          setError(data.Error); // Set error message from API
        }
      } catch (error) {
        console.error("Error fetching data from OMDB", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const renderResults = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return results.length > 0 ? (
      results.map((movie, index) => <MovieCard key={movie.imdbID} movie={movie} index={index} />)
    ) : (
      <p>No results found</p>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{query}&quot;
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {renderResults()}
      </div>
    </div>
  );
};

export default SearchPage;
