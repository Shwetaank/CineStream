// components/MovieCard.js
import Image from "next/image";

const MovieCard = ({ movie }) => {
  return (
    <div className="border rounded-lg p-2 shadow-md">
      <Image
        src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
        alt={movie.Title}
        width={150}
        height={200}
        className="w-full object-cover"
      />
      <h3 className="text-lg font-bold mt-2">{movie.Title}</h3>
      <p>{movie.Year}</p>
    </div>
  );
};

export default MovieCard;
