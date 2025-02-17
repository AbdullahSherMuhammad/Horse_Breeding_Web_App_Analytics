'use client'
import { useState, useMemo, useEffect } from "react";
import { CiFilter } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "@/app/Features/Filter/filterSlice";
import { RootState } from "@/app/Store/store";
import { useFetch } from "@/hook/useFetch";

interface Gender {
  gender_id: number;
  gender_description: string;
}

interface Farm {
  farm_id: number;
  farm_name: string;
}

interface Show {
  show_id: number;
  show_name: string;
  start_date: string;
}

const FilterComponent: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const [isOpen, setIsOpen] = useState(false);

  // Extend tempFilters with an eventId field
  const [tempFilters, setTempFilters] = useState({
    year: filters.year,
    gender_id: filters.gender_id,
    show_id: filters.show_id,
    farm_id: filters.farm_id,
    eventId: "",   });

  const { data: genders } = useFetch<Gender>({
    url: 'gender',
    limit: 100,
  });

  const { data: farms } = useFetch<Farm>({
    url: 'farm',
    limit: 1000000,
  });

  const cleanedFarms = useMemo(() => {
    if (!farms) return [];
    return farms.map((farm) => ({
      ...farm,
      farm_name: farm.farm_name.replace(/frá/gi, '').trim(),
    }));
  }, [farms]);

  const { data: allShows } = useFetch<Show>({
    url: 'show',
    limit: 1000000,
  });

  const availableYears: number[] = useMemo(() => {
    if (!allShows) return [];
    const years: number[] = allShows.map((show: Show): number => new Date(show.start_date).getFullYear());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [allShows]);

  const toggleFilter = () => setIsOpen(!isOpen);

  const applyFilters = async () => {
    let feifIds: string[] = [];
    if (tempFilters.eventId) {
      try {
        const response = await fetch(`/api/sportfengur?eventId=${encodeURIComponent(tempFilters.eventId)}`);
        if (response.ok) {
          const result = await response.json();
          feifIds = Array.isArray(result) ? result : result.feifIds || [];
        } else {
          console.error("Error fetching Feif_ids:", response.status);
        }
      } catch (error) {
        console.error("Error fetching Feif_ids:", error);
      }
    }
    
    const feifIdsValue = feifIds.length > 0 ? feifIds : null;
  
    dispatch(setFilters({ 
      ...tempFilters, 
      feif_ids: feifIdsValue 
    }));
    setIsOpen(false);
  };
  
  
  const clearFilters = () => {
    setTempFilters({ year: undefined, gender_id: undefined, show_id: undefined, farm_id: undefined, eventId: "" });
    dispatch(resetFilters());
    setIsOpen(false);
  };
  
  useEffect(() => {
    if (tempFilters.year !== undefined) {
      setTempFilters((prevFilters) => ({ ...prevFilters, show_id: undefined }));
    }
  }, [tempFilters.year]);

  const filteredShows = useMemo(() => {
    if (!tempFilters.year) return allShows;
    return allShows ? allShows.filter((show) => new Date(show.start_date).getFullYear() === tempFilters.year) : [];
  }, [tempFilters.year, allShows]);

  return (
    <div className="relative flex items-start gap-4">
      <Button variant="outline" className="flex items-center gap-2 h-[45px] rounded-full" onClick={toggleFilter}>
        <CiFilter /> Filters
      </Button>

      <Sheet open={isOpen} onOpenChange={toggleFilter}>
        <SheetContent side="left" className="w-full max-w-sm">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <p id="filter-description" className="text-sm text-gray-500">
              Select filters for refining search results.
            </p>
          </SheetHeader>

          <div className="grid grid-cols-1 gap-4 mt-4">
            {/* Year Filter */}
            <Select 
              onValueChange={(value) => setTempFilters({ ...tempFilters, year: Number(value) })} 
              value={tempFilters.year?.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Show Filter */}
            <Select 
              onValueChange={(value) => setTempFilters({ ...tempFilters, show_id: Number(value) })} 
              value={tempFilters.show_id?.toString() ?? ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select show" />
              </SelectTrigger>
              <SelectContent className="w-[330px]">
                {filteredShows && filteredShows.length > 0 ? (
                  filteredShows.map((show) => (
                    <SelectItem key={show.show_id} value={show.show_id.toString()}>{show.show_name}</SelectItem>
                  ))
                ) : (
                  <SelectItem key="no-shows" value="no-shows" disabled>No shows available</SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Gender Filter */}
            <Select 
              onValueChange={(value) => setTempFilters({ ...tempFilters, gender_id: Number(value) })} 
              value={tempFilters.gender_id?.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genders && genders.map((gender) => (
                  <SelectItem key={gender.gender_id} value={gender.gender_id.toString()}>{gender.gender_description}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Farm Filter */}
            <Select 
              onValueChange={(value) => setTempFilters({ ...tempFilters, farm_id: Number(value) })} 
              value={tempFilters.farm_id?.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select farm" />
              </SelectTrigger>
              <SelectContent>
                {cleanedFarms.map((farm) => (
                  <SelectItem key={farm.farm_id} value={farm.farm_id.toString()}>{farm.farm_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Event ID Text Field */}
            <div>
              <label htmlFor="event-id" className="block text-sm font-medium text-gray-700">
                Event ID
              </label>
              <input
                type="text"
                id="event-id"
                placeholder="IS2022LM0191"
                value={tempFilters.eventId}
                onChange={(e) => setTempFilters({ ...tempFilters, eventId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-full h-[45px] border-2 border-black px-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="default" onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={clearFilters}>Clear</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FilterComponent;
