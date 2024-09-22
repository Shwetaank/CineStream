"use client";
import { Button, DarkThemeToggle, Navbar, NavbarToggle, TextInput } from "flowbite-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineArrowRight, HiOutlineSearch } from "react-icons/hi";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation links for the app
  const navLinks = [
    { path: "/movies", label: "Movies" },
    { path: "/tv-series", label: "Tv Series" },
    { path: "/bookmark", label: "Bookmarks" },
  ];

  // Check if the current path is active
  const isActive = (path) => pathname === path;

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Handle 'Enter' key press for search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <Navbar fluid rounded className="w-full text-center p-4">
        {/* Brand logo with click functionality */}
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Navbar.Brand onClick={() => router.push("/")}>
            <Image
              src="/logo.png"
              width={180}
              height={50}
              alt="Logo"
              className="mr-3 cursor-pointer"
            />
          </Navbar.Brand>
        </motion.div>

        {/* Search bar for medium and larger screens */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="hidden md:block max-w-md md:mx-auto"
        >
          <TextInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            rightIcon={HiOutlineSearch}
            onKeyDown={handleKeyDown}
          />
        </motion.div>

        {/* User action buttons and toggles */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              {/* Navigation links for signed-in users */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="hidden font-semibold text-xl md:flex md:gap-8"
              >
                {navLinks.map(({ path, label }) => (
                  <div
                    key={path}
                    className={`cursor-pointer ${
                      isActive(path) ? "text-blue-500 font-bold" : "hover:text-purple-700 hover:underline"
                    } transition-colors duration-300`}
                    onClick={() => router.push(path)}
                  >
                    {label}
                  </div>
                ))}
              </motion.div>

              {/* User profile button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
              >
                <UserButton className="ml-2" />
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <Button
                outline
                gradientDuoTone="purpleToPink"
                onClick={() => router.push("/sign-in")}
              >
                <span className="hidden sm:inline">Get started</span>
                <HiOutlineArrowRight className="inline sm:hidden h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <DarkThemeToggle />
            <NavbarToggle/>
          </motion.div>
        </div>

        {/* Search bar for mobile view */}
        {isSignedIn && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="md:hidden flex flex-col items-center p-4 w-full"
          >
            <TextInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              rightIcon={HiOutlineSearch}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </motion.div>
        )}

        {/* Collapsible navigation for mobile view */}
        {isSignedIn && (
          <Navbar.Collapse className="font-semibold text-xl p-2 md:hidden">
            {navLinks.map(({ path, label }) => (
              <div
                key={path}
                className={`cursor-pointer ${
                  isActive(path) ? "text-blue-500 font-bold" : ""
                }`}
                onClick={() => router.push(path)}
              >
                {label}
              </div>
            ))}
          </Navbar.Collapse>
        )}
      </Navbar>
    </motion.div>
  );
};

export default Header;
