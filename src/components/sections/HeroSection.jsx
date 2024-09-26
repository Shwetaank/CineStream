"use client";
import { useEffect, useState, useMemo } from "react";
import { Spinner } from "flowbite-react";
import { motion } from "framer-motion";

const movieData = [
  {
    id: 0,
    title: "Gran Turismo",
    overview:
      "The ultimate wish-fulfillment tale of a teenage Gran Turismo player whose gaming skills won him a series of Nissan competitions to become an actual professional racecar driver.",
    release: 2023,
    youtubeString: "https://www.youtube.com/embed/GVPzGBvPrzw",
  },
  {
    id: 1,
    title: "A Haunting in Venice",
    overview:
      "Celebrated sleuth Hercule Poirot, now retired and living in self-imposed exile in Venice, reluctantly attends a Halloween séance at a decaying, haunted palazzo. When one of the guests is murdered, the detective is thrust into a sinister world of shadows and secrets.",
    release: 2023,
    youtubeString: "https://www.youtube.com/embed/yEddsSwweyE",
  },
  {
    id: 2,
    title: "Five Nights at Freddy's",
    overview:
      "Recently fired and desperate for work, a troubled young man named Mike agrees to take a position as a night security guard at an abandoned theme restaurant: Freddy Fazbear's Pizzeria. But he soon discovers that nothing at Freddy's is what it seems.",
    release: 2023,
    youtubeString: "https://www.youtube.com/embed/0VH9WCFV6XQ",
  },
  {
    id: 3,
    title: "Chernobyl",
    overview:
      "The true story of one of the worst man-made catastrophes in history: the catastrophic nuclear accident at Chernobyl. A tale of the brave men and women who sacrificed to save Europe from unimaginable disaster.",
    release: 2023,
    youtubeString: "https://www.youtube.com/embed/s9APLXM9Ei8",
  },
  {
    id: 4,
    title: "Retribution",
    overview:
      "When a mysterious caller puts a bomb under his car seat, Matt Turner begins a high-speed chase across the city to complete a specific series of tasks- all with his kids trapped in the back seat.",
    release: 2023,
    youtubeString: "https://www.youtube.com/embed/jzQn0-WH4WM",
  },
  {
    id: 5,
    title: "Spider-Man: Across the Spider-Verse",
    overview:
      "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must set out on his own to save those he loves most.",
    release: 2023,
    youtubeString: "https://www.youtube.com/embed/shW9i6k8cB0",
  },
  {
    id: 6,
    title: "Coco",
    overview:
      "Despite his family’s baffling generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol, Ernesto de la Cruz. Desperate to prove his talent, Miguel finds himself in the stunning and colorful Land of the Dead following a mysterious chain of events. Along the way, he meets charming trickster Hector, and together, they set off on an extraordinary journey to unlock the real story behind Miguel's family history.",
    release: 2023,
    youtubeString: "https://www.youtube.com/embed/xlnPHQ3TLX8",
  },
  {
    id: 7,
    title: "Monk",
    overview:
      "Adrian Monk was once a rising star with the San Francisco Police Department, legendary for using unconventional means to solve the department's most baffling cases. But after the tragic (and still unsolved) murder of his wife Trudy, he developed an extreme case of obsessive-compulsive disorder. Now working as a private consultant, Monk continues to investigate cases in the most unconventional ways.",
    release: 2002,
    youtubeString: "https://www.youtube.com/embed/mftbaaU82Uc",
  },
  {
    id: 8,
    title: "Family Guy",
    overview:
      "Sick, twisted, politically incorrect and Freakin' Sweet animated series featuring the adventures of the dysfunctional Griffin family. Bumbling Peter and long-suffering Lois have three kids. Stewie (a brilliant but sadistic baby bent on killing his mother and taking over the world), Meg (the oldest, and is the most unpopular girl in town) and Chris (the middle kid, he's not very bright but has a passion for movies). The final member of the family is Brian - a talking dog and much more than a pet, he keeps Stewie in check whilst sipping Martinis and sorting through his own life issues.",
    release: 1999,
    youtubeString: "https://www.youtube.com/embed/7hRxWGo49oc",
  },
];

// Helper function to extract video ID
const getVideoIdFromUrl = (youtubeUrl) => youtubeUrl.split("/embed/")[1];

const HeroSection = () => {
  const [randomMovie, setRandomMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRandomMovie = () =>
    movieData[Math.floor(Math.random() * movieData.length)];

  useEffect(() => {
    const selectMovie = () => {
      const selectedMovie = getRandomMovie();
      setRandomMovie(selectedMovie);
      setLoading(false);
    };
    selectMovie();
  }, []);

  // Memoize video ID extraction to avoid recalculating on every render
  const videoId = useMemo(
    () => randomMovie && getVideoIdFromUrl(randomMovie.youtubeString),
    [randomMovie]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner color="purple" size="xl" aria-label="loading movies" />
      </div>
    );
  }

  return (
    <div className="h-[55vh] lg:h-[60vh] w-full flex justify-start items-center relative">
      <iframe
        src={`${randomMovie.youtubeString}?autoplay=1&mute=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0`}
        title={randomMovie.title}
        className="w-full h-full object-cover absolute top-0 left-0 -z-10 brightness-[60%] border-0"
        allow="autoplay; fullscreen"
        aria-label={`Video for ${randomMovie.title}`}
      />

      {/* Animated Container */}
      <motion.div
        className="md:flex hidden absolute bottom-6 left-0 right-0 p-6 flex-col"
        initial={{ opacity: 0, y: 50 }} // Animation starts hidden and moves up
        animate={{ opacity: 1, y: 0 }} // Moves to the visible position
        transition={{ duration: 1.5, ease: "easeOut" }} // Easing transition over 1.5 seconds
      >
        {/* Animated Title */}
        <motion.h1
          className="text-3xl text-purple-500 font-semibold"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }} // Delayed animation
        >
          {randomMovie.title}
        </motion.h1>

        {/* Animated Overview */}
        <motion.p
          className="text-white mt-4 text-sm font-thin leading-relaxed text-justify max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {randomMovie.overview}
        </motion.p>

        {/* Animated Release Date */}
        <motion.span
          className="block mt-4 text-purple-700 text-sm font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Released: {randomMovie.release}
        </motion.span>
      </motion.div>
    </div>
  );
};

export default HeroSection;
