"use client";
import { Button, DarkThemeToggle, Navbar } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiOutlineArrowRight } from "react-icons/hi";

const Header = () => {
  const router = useRouter();

  const navLinks = [
    { path: "/movies", label: "Movies" },
    { path: "/tv-series", label: "Tv Series" },
    { path: "/bookmark", label: "Bookmarks" },
  ];

  return (
    <Navbar fluid rounded className="w-full text-center p-4">
      <Navbar.Brand onClick={() => router.push("/")}>
        <Image
          src="/logo.png"
          width={180}
          height={50}
          alt="Logo"
          className="mr-3 cursor-pointer"
        />
      </Navbar.Brand>
      <div className="flex items-center gap-2 md:gap-6 md:order-2">
        <Button
          outline
          gradientDuoTone="purpleToPink"
          onClick={() => router.push("/auth")}
        >
          <span className="hidden sm:inline">Get started</span>
          <HiOutlineArrowRight className="md:ml-2 md:h-5 md:w-5 " />
        </Button>
        {/* <DarkThemeToggle /> */}

        <div className="hidden md:flex md:justify-end md:items-center md:gap-6 xl:gap-10 list-none">
          {navLinks.map(({ path, label }) => (
            <div
              key={path}
              className="cursor-pointer"
              onClick={() => router.push(path)}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="md:hidden flex gap-4 items-center">
          <DarkThemeToggle />
          <Navbar.Toggle />
        </div>
      </div>
      <Navbar.Collapse className="md:hidden">
        <div>
          {navLinks.map(({ path, label }) => (
            <div
              key={path}
              className="cursor-pointer"
              onClick={() => router.push(path)}
            >
              {label}
            </div>
          ))}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
