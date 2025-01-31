import { useState, useMemo } from "react";
import { CiFilter } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface FilterComponentProps {
  availableYears: number[];
  availableGenders: Gender[];
  availableShows: Show[];
  availableFarms: Farm[];
  onFilterChange: (filters: {
    year?: number;
    gender_id?: number;
    show_id?: number;
    farm_id?: number;
  }) => void;
}

interface Gender {
  gender_id: number;
  gender_description: string;
}

interface Show {
  show_id: number;
  show_name: string;
  start_date: string;
}

interface Farm {
  farm_id: number;
  farm_name: string;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  availableYears,
  availableGenders,
  availableShows,
  availableFarms,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedGender, setSelectedGender] = useState<number | undefined>();
  const [selectedShow, setSelectedShow] = useState<number | undefined>(undefined); // Default to undefined
  const [selectedFarm, setSelectedFarm] = useState<number | undefined>();

  const toggleFilter = () => setIsOpen(!isOpen);

  // Apply Filters & Pass Values to Parent (Dashboard)
  const applyFilters = () => {
    onFilterChange({
      year: selectedYear,
      gender_id: selectedGender,
      show_id: selectedShow,
      farm_id: selectedFarm,
    });
    setIsOpen(false);
  };

  // Clear All Filters
  const clearFilters = () => {
    onFilterChange({
      year: undefined,
      gender_id: undefined,
      show_id: undefined,
      farm_id: undefined,
    });
    setSelectedYear(undefined);
    setSelectedGender(undefined);
    setSelectedShow(undefined); // Reset to undefined
    setSelectedFarm(undefined);
    setIsOpen(false);
  };

  // Update Show options based on selected year
  const filteredShows = useMemo(() => {
    if (!selectedYear) return availableShows; // No filtering, return all available shows
    return availableShows.filter((show) => {
      const showYear = new Date(show.start_date).getFullYear();
      return showYear === selectedYear; // Filter shows by selected year
    });
  }, [selectedYear, availableShows]);

  return (
    <div className="relative flex items-start gap-4">
      {/* Toggle Button */}
      <Button
        variant="outline"
        className="flex items-center gap-2 h-[45px] rounded-full"
        onClick={toggleFilter}
      >
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
              <Select
                onValueChange={(value) => setSelectedYear(Number(value))}
                value={selectedYear?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Show Filter */}
            <div className="w-full">
              <Select
                onValueChange={(value) => setSelectedShow(Number(value))}
                value={selectedShow?.toString() ?? ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select show" />
                </SelectTrigger>
                <SelectContent>
                  {filteredShows.length > 0 ? (
                    filteredShows.map((show) => {
                      if (show.show_id) {
                        return (
                          <SelectItem key={show.show_id} value={show.show_id.toString()}>
                            {show.show_name}
                          </SelectItem>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <SelectItem key="no-shows" value="no-shows" disabled>
                      No shows available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Gender Filter */}
            <div className="w-full">
              <Select
                onValueChange={(value) => setSelectedGender(Number(value))}
                value={selectedGender?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {availableGenders.map((gender) => (
                    <SelectItem key={gender.gender_id} value={gender.gender_id.toString()}>
                      {gender.gender_description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Farm Filter */}
            <div className="w-full">
              <Select
                onValueChange={(value) => setSelectedFarm(Number(value))}
                value={selectedFarm?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select farm" />
                </SelectTrigger>
                <SelectContent>
                  {availableFarms.map((farm) => (
                    <SelectItem key={farm.farm_id} value={farm.farm_id.toString()}>
                      {farm.farm_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="default" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FilterComponent;
