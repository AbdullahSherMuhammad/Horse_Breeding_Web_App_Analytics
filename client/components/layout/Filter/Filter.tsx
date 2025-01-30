import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface FilterComponentProps {
  availableYears: number[];
  onFilterChange: (filters: { year?: number; event?: string }) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ availableYears, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>();

  const toggleFilter = () => setIsOpen(!isOpen);

  // Apply Filters & Pass Values to Parent (Dashboard)
  const applyFilters = () => {
    onFilterChange({ year: selectedYear, event: selectedEvent });
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-start gap-4">
      {/* Toggle Button */}
      <Button variant="outline" className="flex items-center gap-2 h-[45px] rounded-full" onClick={toggleFilter}>
        <CiFilter />
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
            {/* Year Filter */}
            <div className="w-full">
              <Select onValueChange={(value) => setSelectedYear(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year, idx) => (
                    <SelectItem key={idx} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Filter */}
            <div className="w-full">
              <Select onValueChange={(value) => setSelectedEvent(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Event 1">Event 1</SelectItem>
                  <SelectItem value="Event 2">Event 2</SelectItem>
                  <SelectItem value="Event 3">Event 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="default" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={() => onFilterChange({ year: undefined, event: undefined })}>
              Clear
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FilterComponent;
