'use client';

import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const FilterComponent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex items-start gap-4">
      {/* Toggle Button */}
      <Button variant="outline" className="flex items-center gap-2 h-[45px] rounded-full" onClick={toggleFilter}>
        <CiFilter/>
        Filters
      </Button>

      {/* Sidebar Filter */}
      <Sheet open={isOpen} onOpenChange={toggleFilter}>
        <SheetContent side="left" className="w-full max-w-sm">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          {/* Filter Options */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            {[
              "Select year",
              "Select event",
              "Select venue type",
              "Select judge group",
              "Select rider",
              "Select horse family line",
              "Select gender",
              "Select age",
            ].map((label, index) => (
              <div key={index} className="w-full">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={label} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Example options */}
                    {label === "Select year" &&
                      ["2024", "2023", "2022"].map((year, idx) => (
                        <SelectItem key={idx} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    {label !== "Select year" && (
                      <>
                        <SelectItem value="Option 1">Option 1</SelectItem>
                        <SelectItem value="Option 2">Option 2</SelectItem>
                        <SelectItem value="Option 3">Option 3</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="default">Apply Filters</Button>
            <Button variant="outline" onClick={() => console.log("Clear filters")}>
              Clear
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FilterComponent;
