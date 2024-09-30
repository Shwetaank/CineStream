"use client";

import { fetchTestimonials } from "@/store/slices/testimonialSlice";
import { Carousel, Card, Spinner, Button } from "flowbite-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TestimonialForm from "../form/TestimonialForm";

const TestimonialSection = () => {
  const dispatch = useDispatch();
  const { testimonials, status, error } = useSelector(
    (state) => state.testimonials
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTestimonials());
    }
  }, [dispatch, status]);

  // Display loading spinner while fetching testimonials
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner color="purple" size="xl" aria-label="loading testimonial" />
      </div>
    );
  }

  // Display error message if fetching testimonials fails
  if (status === "failed") {
    return (
      <div className="text-red-500">
        Error: {error}{" "}
        <Button color="failure" onClick={() => dispatch(fetchTestimonials())}>
          <Spinner aria-label="Spinner button example" size="sm" />
          <span className="pl-3"> Retry</span>
        </Button>
      </div>
    );
  }

  return (
    <motion.section
      className="pt-16 pb-20 flex flex-col items-center justify-center  bg-white dark:bg-gray-900"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      <div className="text-center px-4 sm:px-8 lg:px-12 ">
        <h2 className="text-4xl font-bold mb-10 text-purple-700">
          What Our Users Are Saying
        </h2>
        <p className="text-lg text-justify mb-10 text-gray-700 dark:text-gray-300">
          🌟 Discover why Cinestream is loved by our users! 🎬 Hear their
          feedback on our exceptional service and diverse movie selection. 🍿✨
        </p>
        <div className="h-64 sm:h-64 xl:h-80 2xl:h-96">
          <Carousel
            slideInterval={5000} // Interval for sliding the carousel
            pauseOnHover // Pause the carousel on hover
            className="cursor-pointer"
          >
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="flex flex-col justify-center items-center p-4 bg-gray-100 dark:bg-gray-800  rounded-3xl shadow-lg"
              >
                <p className="text-justify mb-4">
                  &quot;{testimonial.remark}&quot;{" "}
                  {/* Displaying the testimonial remark */}
                </p>
                <div className="flex justify-center items-center mb-4">
                  {/* Displaying star rating */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <Image
                    src={testimonial.avatar}
                    alt={`${testimonial.userId}'s avatar`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full mr-4"
                    unoptimized
                    loading="lazy"
                  />
                  <div>
                    <span className="ml-2 font-bold text-purple-700">
                      {testimonial.userId}
                    </span>
                    <p className="text-sm text-gray-500">
                      {testimonial.emailID}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </Carousel>
        </div>
        <TestimonialForm />
      </div>
    </motion.section>
  );
};

export default TestimonialSection;
