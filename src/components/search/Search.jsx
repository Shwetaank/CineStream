// components/Search.js
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TextInput } from "flowbite-react";
import { HiOutlineSearch } from "react-icons/hi";

const Search = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Handle 'Enter' key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full">
      <TextInput
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        rightIcon={HiOutlineSearch}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
    </div>
  );
};

export default Search;
