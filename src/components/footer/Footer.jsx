"use client";
import { Footer as FlowbiteFooter } from "flowbite-react";
import {
  BsLinkedin,
  BsInstagram,
  BsYoutube,
  BsTwitter,
  BsGithub,
} from "react-icons/bs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Footer = () => {
  const router = useRouter();

  return (
    <FlowbiteFooter container>
      <motion.div
        className="w-full text-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Brand Logo and Navigation Links */}
        <motion.div
          className="flex flex-col sm:flex-row sm:justify-between"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FlowbiteFooter.Brand
            src="/logo.png"
            onClick={() => router.push("/")}
            alt="CineStram Logo"
            className="cursor-pointer mb-4 sm:mb-0"
          />
          <FlowbiteFooter.LinkGroup className="flex font-semibold md:gap-8 sm:text-lg md:2xl flex-row justify-center space-x-4 sm:mb-0 cursor-pointer">
            {/* Navigation Links */}
            {["/movies", "/tv-Series", "/bookmarks", "/about"].map(
              (path, index) => (
                <FlowbiteFooter.Link
                  key={index}
                  onClick={() => router.push(path)}
                  className="hover:text-purple-600 transition duration-200"
                >
                  {path === "/movies"
                    ? "Movies"
                    : path === "/tv-Series"
                    ? "TV-Series"
                    : path === "/bookmarks"
                    ? "Bookmarks"
                    : "About Us"}
                </FlowbiteFooter.Link>
              )
            )}
          </FlowbiteFooter.LinkGroup>
        </motion.div>

        {/* Divider for visual separation */}
        <FlowbiteFooter.Divider />

        {/* Copyright and Social Media Links */}
        <motion.div
          className="flex flex-col sm:flex-row sm:justify-between"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FlowbiteFooter.Copyright
            href="https://shwet-tech.com/"
            by="Sin_Greed™"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex md:gap-10 justify-center space-x-8 sm:mt-0">
            {/* Social Media Icons */}
            {[
              {
                href: "https://www.linkedin.com/in/shwetank-morey-a35484257",
                icon: BsLinkedin,
                label: "LinkedIn",
                hoverColor: "text-blue-600",
              },
              {
                href: "https://www.instagram.com/shwetaank_/",
                icon: BsInstagram,
                label: "Instagram",
                hoverColor: "text-pink-500",
              },
              {
                href: "https://www.youtube.com/@Sin_Greed",
                icon: BsYoutube,
                label: "YouTube",
                hoverColor: "text-red-500",
              },
              {
                href: "https://x.com/Sin_Greed___",
                icon: BsTwitter,
                label: "Twitter",
                hoverColor: "text-blue-400",
              },
              {
                href: "https://github.com/Shwetaank",
                icon: BsGithub,
                label: "GitHub",
                hoverColor: "text-indigo-500",
              },
            ].map(({ href, icon: Icon, label, hoverColor }, index) => (
              <motion.div
                key={index}
                className="transition transform hover:scale-110 duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <FlowbiteFooter.Icon
                  href={href}
                  icon={Icon}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 hover:${hoverColor} dark:hover:${hoverColor} text-3xl transition-colors duration-200`}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </FlowbiteFooter>
  );
};

export default Footer;
