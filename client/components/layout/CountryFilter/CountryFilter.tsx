'use client';

import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

const dummyCountries = [
  { name: "Pakistan", flag: "https://flagcdn.com/pk.svg" },
  { name: "United States", flag: "https://flagcdn.com/us.svg" },
  { name: "Canada", flag: "https://flagcdn.com/ca.svg" },
  { name: "Mexico", flag: "https://flagcdn.com/mx.svg" },
  { name: "United Kingdom", flag: "https://flagcdn.com/gb.svg" },
  { name: "Germany", flag: "https://flagcdn.com/de.svg" },
  { name: "France", flag: "https://flagcdn.com/fr.svg" },
  { name: "India", flag: "https://flagcdn.com/in.svg" },
  { name: "China", flag: "https://flagcdn.com/cn.svg" },
  { name: "Japan", flag: "https://flagcdn.com/jp.svg" },
  { name: "Australia", flag: "https://flagcdn.com/au.svg" },
];

const CountryFilter: React.FC = () => {
  const [tempSelectedCountries, setTempSelectedCountries] = useState<string[]>([]);
  // const [appliedCountries, setAppliedCountries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const handleCountryChange = (country: string) => {
    setTempSelectedCountries((prev) => {
      const updated = prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country];
      return updated;
    });
  };

  const resetSelection = () => {
    setTempSelectedCountries([]);
  };

  const applyFilter = () => {
    // setAppliedCountries(tempSelectedCountries);
    setPopoverOpen(false);
  };

  const filteredCountries = dummyCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-[45px] rounded-full w-full"
          >
            Countries
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-[300px] md:w-full p-4"
        >
          <div className="space-y-4">
            <Input
              placeholder="Search countries"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <div
              className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar"
            >
              {filteredCountries.map((country) => (
                <div
                  key={country.name}
                  className="flex items-center cursor-pointer"
                  onClick={() => handleCountryChange(country.name)}
                >
                  <Checkbox
                    checked={tempSelectedCountries.includes(country.name)}
                    onCheckedChange={() => handleCountryChange(country.name)}
                    onClick={(e)=> {
                      e.stopPropagation()
                    }}
                  />
                  <Image
                    src={country.flag}
                    alt={country.name}
                    priority
                    width={100}
                    height={100}
                    className={`ml-2 w-6 h-4 rounded transition-transform shadow-md ${
                      tempSelectedCountries.includes(country.name)
                        ? "scale-110"
                        : "scale-100"
                    }`}
                  />
                  <span className="ml-2 text-sm font-medium">{country.name}</span>
                </div>
              ))}
              {filteredCountries.length === 0 && (
                <p className="text-sm text-gray-500">No countries found</p>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={resetSelection}
                className="w-full h-[40px] rounded-md"
              >
                Reset Selection
              </Button>
              <Button
                onClick={applyFilter}
                className={`w-full h-[40px] rounded-md ${
                  tempSelectedCountries.length > 0
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black"
                }`}
                disabled={tempSelectedCountries.length === 0}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
{/* 
      <div className="mt-4">
        <h4 className="text-lg font-medium">Selected Countries:</h4>
        {appliedCountries.length > 0 ? (
          <ul className="list-disc pl-6">
            {appliedCountries.map((country) => (
              <li key={country}>{country}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No countries selected</p>
        )}
      </div> */}
    </div>
  );
};

export default CountryFilter;
