import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";


type Language = {
  code: string;
  name: string;
  flag: string;
};

export default function LanguageSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("is");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    {
      code: "is",
      name: "IS",
      flag: "https://alendis-website-ten.vercel.app/iceland.svg",
    },
    {
      code: "en",
      name: "EN",
      flag: "https://alendis-website-ten.vercel.app/united-kingdom.svg",
    },
    {
      code: "de",
      name: "DE",
      flag: "https://alendis-website-ten.vercel.app/germany.svg",
    },
  ];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const selectLanguage = (code: string) => {
    setSelectedLanguage(code);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedFlag = languages.find((lang) => lang.code === selectedLanguage)?.flag || "";

  return (
    <div ref={dropdownRef} className="relative inline-block text-left w-[100px]">
      {/* Dropdown Trigger */}
      <button
        onClick={toggleDropdown}
        className="flex justify-between items-center gap-2 bg-black text-white px-2 py-1 rounded-full border-2 border-gray-700 focus:outline-none w-full"
      >
        <Image
          src={selectedFlag}
          priority
          width={100}
          height={100}
          alt={`${selectedLanguage} flag`}
          className="w-8 h-8 rounded-full"
        />

        <span className="uppercase">
            {`${selectedLanguage}`}
        </span>

        <MdOutlineKeyboardArrowDown/>
        
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-1 bg-black text-white rounded-xl shadow-xl z-10 w-[100px] overflow-hidden border-2 border-gray-700">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 w-full text-left ${
                selectedLanguage === lang.code ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              <Image
                src={lang.flag}
                alt={`${lang.name} flag`}
                className="w-8 h-8 rounded-full"
                width={100}
                height={100}
              />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}