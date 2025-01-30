'use client';

import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import React, { useState } from "react";

const SearchBar = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedSearchValue = searchValue.trim().toUpperCase();

  const routeHandler = () => {
    if (normalizedSearchValue !== "") {
      router.push(`/HorseDetails?query=${normalizedSearchValue}`);
      setErrorMessage("");
    } else {
      setErrorMessage("Enter something to search...");
    }
  };

  return (
    <div className="flex flex-col w-full md:w-auto">
      <div
        className={`flex justify-end w-full lg:w-[350px] h-10 rounded-full overflow-hidden border border-[#1a1a1a] transition-width duration-300`}
      >
        <input
          className={`w-full h-full px-3 border-0 outline-none text-gray-800`}
          type="text"
          placeholder="Type Horse Name or FEIF ID"
          value={searchValue}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              routeHandler();
            }
          }}
          onChange={(event) => {
            setSearchValue(event.target.value);
            setErrorMessage("");
          }}
        />
        <button
          className="bg-[#1a1a1a] text-white flex items-center justify-center w-10 h-full text-2xl"
          onClick={routeHandler}
        >
          <CiSearch />
        </button>
      </div>

      <div
        className={`${
          errorMessage ? "flex translate-y-0" : "hidden -translate-y-2"
        } transition-all duration-300 ease-in-out p-2 bg-red-100 mt-2 rounded-md text-red-500 font-semibold text-sm`}
      >
        {errorMessage}
      </div>
    </div>
  );
};

export default SearchBar;
