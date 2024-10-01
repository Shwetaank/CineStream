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
    if (query) {
      setLoading(true);
      setError(null); // Reset error state on new search

      // Fetch search results from OMDB API
      axios
        .get(
          `https://www.omdbapi.com/?apikey=8e4a477f&s=${encodeURIComponent(
            query
          )}`
        )
        .then((response) => {
          console.log(response.data); // Log the API response to inspect it
          if (response.data.Response === "True") {
            setResults(response.data.Search);
          } else {
            setResults([]); // No results found
            setError(response.data.Error); // Set the error message from API
          }
        })
        .catch((error) => {
          console.error("Error fetching data from OMDB", error);
          setError("Failed to fetch data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{query}&quot;
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.length > 0 ? (
            results.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
