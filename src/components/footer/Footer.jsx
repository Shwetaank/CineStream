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

const Footer = () => {
  const router = useRouter();

  return (
    <FlowbiteFooter container>
      <div className="w-full text-center p-4">
        {/* Brand Logo and Navigation Links */}
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <FlowbiteFooter.Brand
            src="/logo.png"
            onClick={() => router.push("/")}
            alt="CineStram Logo"
            className="cursor-pointer mb-4 sm:mb-0"
          />
          <FlowbiteFooter.LinkGroup className="flex font-semibold md:gap-8 sm:text-lg md:2xl flex-row justify-center space-x-4 sm:mb-0 cursor-pointer">
            {/* Navigation Links */}
            <FlowbiteFooter.Link
              onClick={() => router.push("/movies")}
              className="hover:text-blue-500 transition duration-200"
            >
              Movies
            </FlowbiteFooter.Link>
            <FlowbiteFooter.Link
              onClick={() => router.push("/tv-Series")}
              className="hover:text-blue-500 transition duration-200"
            >
              TV-Series
            </FlowbiteFooter.Link>
            <FlowbiteFooter.Link
              onClick={() => router.push("/bookmarks")}
              className="hover:text-blue-500 transition duration-200"
            >
              BookMarks
            </FlowbiteFooter.Link>
            <FlowbiteFooter.Link
              onClick={() => router.push("/about")}
              className="hover:text-blue-500 transition duration-200"
            >
              About Us
            </FlowbiteFooter.Link>
          </FlowbiteFooter.LinkGroup>
        </div>

        {/* Divider for visual separation */}
        <FlowbiteFooter.Divider />

        {/* Copyright and Social Media Links */}
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <FlowbiteFooter.Copyright
            href="https://shwet-tech.com/"
            by="Sin_Greed™"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex md:gap-10 justify-center space-x-8 sm:mt-0">
            {/* Social Media Icons */}
            <div className="transition transform hover:scale-110 duration-200">
              <FlowbiteFooter.Icon
                href="https://www.linkedin.com/in/shwetank-morey-a35484257"
                icon={BsLinkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 text-3xl transition-colors duration-200"
              />
            </div>
            <div className="transition transform hover:scale-110 duration-200">
              <FlowbiteFooter.Icon
                href="https://www.instagram.com/shwetaank_/"
                icon={BsInstagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-500 text-3xl transition-colors duration-200"
              />
            </div>
            <div className="transition transform hover:scale-110 duration-200">
              <FlowbiteFooter.Icon
                href="https://www.youtube.com/@Sin_Greed"
                icon={BsYoutube}
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-500 text-3xl transition-colors duration-200"
              />
            </div>
            <div className="transition transform hover:scale-110 duration-200">
              <FlowbiteFooter.Icon
                href="https://x.com/Sin_Greed___"
                icon={BsTwitter}
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-400 text-3xl transition-colors duration-200"
              />
            </div>
            <div className="transition transform hover:scale-110 duration-200">
              <FlowbiteFooter.Icon
                href="https://github.com/Shwetaank"
                icon={BsGithub}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black text-3xl transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </FlowbiteFooter>
  );
};

export default Footer;
