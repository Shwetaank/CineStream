"use client"; // Ensure this is a Client Component

import { Button } from "flowbite-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ActionSection = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleJoinNow = () => {
    router.push("/sign-up");
  };

  const handleGoUp = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      window.scrollTo({
        top: heroSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center p-6 md:p-8 rounded-lg shadow-lg">
      <motion.div
        className="mb-4 md:mb-0 md:mr-4 p-4 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          Your Gateway to Endless Entertainment!
        </h2>
        <p className="text-lg md:text-xl mb-6 text-justify">
          Join Cinestream for free and explore an extensive library of movies
          and shows. Stream anywhere, anytime!
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>📱 Watch on any device - phone, tablet, or TV!</li>
          <li>🎬 Access thousands of titles across all genres.</li>
          <li>⭐ Get personalized recommendations just for you.</li>
        </ul>
        <blockquote className="mb-6 italic border-l-4 border-gray-800 pl-4">
          &quot;If It’s A Boring Adventure, I Don’t Want To Do It.&quot;
          <strong> — Monkey D Luffy</strong>
        </blockquote>
        <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 mb-6">
          {!user && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                size="xl"
                pill
                outline
                gradientDuoTone="purpleToblue"
                onClick={handleJoinNow}
                aria-label="Join now to sign up"
              >
                Join Now
              </Button>
            </motion.div>
          )}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button
              pill
              size="xl"
              outline
              gradientDuoTone="pinkToOrange"
              onClick={handleGoUp}
              aria-label="Go to Hero section"
            >
              Go Up
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="max-w-xl rounded-xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <video className="w-full" src="/CTA.mp4" autoPlay loop muted />
      </motion.div>
    </div>
  );
};

export default ActionSection;
