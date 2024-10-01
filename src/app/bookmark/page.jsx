"use client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBookmark, fetchBookmarks } from "@/store/slices/bookmarkSlice";
import { Card, Button, Spinner, Modal, Pagination } from "flowbite-react";
import { FiTrash, FiInfo } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";

const BookmarkPage = () => {
  const dispatch = useDispatch();
  const { bookmarks, loading, error } = useSelector((state) => state.bookmarks);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [bookmarkIdToDelete, setBookmarkIdToDelete] = useState(null);
  const [movieDetails, setMovieDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(4);
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
  const fallbackImage = "/fallback.png";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setMoviesPerPage(1);
      } else if (window.innerWidth <= 1024) {
        setMoviesPerPage(3);
      } else {
        setMoviesPerPage(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchMovieDetails = async (id) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`
      );
      const data = response.data;
      setMovieDetails((prev) => ({
        ...prev,
        [id]: data,
      }));
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const debouncedFetchMovieDetails = useCallback(
    debounce((id) => fetchMovieDetails(id), 300),
    []
  );

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  useEffect(() => {
    bookmarks.forEach((bookmark) => {
      const movieId = bookmark.movieId || bookmark.seriesId;
      if (!movieDetails[movieId]) {
        debouncedFetchMovieDetails(movieId);
      }
    });
  }, [bookmarks, movieDetails, debouncedFetchMovieDetails]);

  const handleDeleteBookmark = (id) => {
    setBookmarkIdToDelete(id);
    setConfirmationVisible(true);
  };

  const confirmDelete = () => {
    dispatch(deleteBookmark(bookmarkIdToDelete));
    setConfirmationVisible(false);
    setBookmarkIdToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmationVisible(false);
    setBookmarkIdToDelete(null);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  const indexOfLastBookmark = currentPage * moviesPerPage;
  const indexOfFirstBookmark = indexOfLastBookmark - moviesPerPage;
  const currentBookmarks = bookmarks.slice(
    indexOfFirstBookmark,
    indexOfLastBookmark
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner color="purple" size="xl" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="pt-16 pb-20 px-4 sm:px-6 md:px-10 lg:px-12">
      <h2 className="text-4xl font-semibold mb-10 text-center">My Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p className="text-center text-gray-600">No bookmarks found.</p>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {currentBookmarks.map((bookmark, i) => {
              const movieId = bookmark.movieId || bookmark.seriesId;
              const movieDetail = movieDetails[movieId];

              return (
                <motion.div
                  custom={i}
                  variants={cardVariants}
                  key={bookmark.id}
                >
                  <Card className="shadow-lg border-none">
                    <div className="relative">
                      <Image
                        className="w-full h-60 rounded-t-lg object-fill"
                        src={movieDetail?.Poster || fallbackImage}
                        alt={`${movieDetail?.Title} Poster`}
                        width={300}
                        height={400}
                        priority
                      />
                      <button
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="absolute top-2 right-2 text-purple-500 hover:text-purple-700"
                      >
                        <FiTrash size={30} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">
                        {movieDetail?.Title} ({movieDetail?.Year})
                      </h3>
                      <p className="text-gray-600">
                        <strong>Rated:</strong> {movieDetail?.Rated || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        <strong>Genre:</strong> {movieDetail?.Genre || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        <strong>Runtime:</strong>{" "}
                        {movieDetail?.Runtime || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        <strong>Released:</strong>{" "}
                        {movieDetail?.Released || "N/A"}
                      </p>
                      <p className="text-gray-600 line-clamp-2">
                        <strong>Plot:</strong> {movieDetail?.Plot || "N/A"}
                      </p>

                      <div className="flex justify-end mt-4">
                        <Link href={`/movies/${movieId}`}>
                          <button className="text-purple-700 hover:text-purple-900">
                            <FiInfo size={30} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
              showIcons
              totalPages={Math.ceil(bookmarks.length / moviesPerPage)}
              previousLabel="Previous"
              nextLabel="Next"
            />
          </div>
        </>
      )}

      <Modal popup show={confirmationVisible} onClose={cancelDelete}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this bookmark?</p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" pill onClick={confirmDelete}>
            Yes, delete
          </Button>
          <Button color="success" pill onClick={cancelDelete}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookmarkPage;
