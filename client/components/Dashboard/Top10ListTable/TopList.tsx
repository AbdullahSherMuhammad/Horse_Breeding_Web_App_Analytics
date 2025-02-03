'use client'
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hook/useFetch";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";


type Data = {
  horse_id : number;
  horse_name : string ;
  total_score : number;
  feif_id : number;
  assess_year : number;
  ridden_abilities_wo_pace : number;
  total_wo_pace : number;
  [key: string]: string | number;
}

const dropdownOptions = [
  { 
    label: "Horses by Total Score", 
    endpoint: "top_horses_by_score", 
    keys: ["horse_name", "total_score", "total_wo_pace", "feif_id"], 
  },
  { 
    label: "Horses by Conformation Score", 
    endpoint: "top_10_horses_conformation_score", 
    keys: ["horse_name", "conformation_score"], 
  },
  { 
    label: "Horses by Rideability Score", 
    endpoint: "top_10_horses_rideability_score", 
    keys: ["horse_name", "rideability_score"], 
  },
];

export function TopList() {
  const [isActiveDropDown, setActiveDropDown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(dropdownOptions[0]); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  const itemsPerPage = 10 ;

  const filters = useSelector((state: RootState) => state.filters);

  const { data, loading } = useFetch<Data>({
    url: selectedOption.endpoint, 
    filterUrl: selectedOption.endpoint, 
    limit: itemsPerPage,
    filters: {
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.gender_id ? { gender_id: filters.gender_id } : {}),
      ...(filters.show_id ? { show_id: filters.show_id } : {}),
      ...(filters.farm_id ? { farm_id: filters.farm_id } : {}),
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const clickHandler = (horseId: number) => {
    router.push(`/TopListDetail/?name=${selectedOption.endpoint}&id=${horseId}`)
  }

  useEffect(() => {
    router.prefetch("TopListDetail");
  }, [router]);

  return (
    <div className="space-y-6 mt-5">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-5 md:flex-row justify-between items-center">
            <CardTitle className="text-xl sm:text-2xl">Top 10 {selectedOption.label}</CardTitle>
            <div ref={dropdownRef} className="relative">
              <button
                className="relative bg-[#1a1a1a] p-2 rounded-lg text-white flex gap-1 items-center"
                onClick={() => setActiveDropDown((prev) => !prev)}
              >
                {selectedOption.label} <MdKeyboardArrowDown />
              </button>
              <ul
                className={`${
                  isActiveDropDown ? "block" : "hidden"
                } absolute z-10 mt-1 overflow-hidden rounded-lg min-w-[120px] bg-white border-2 shadow-lg`}
              >
                {dropdownOptions.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSelectedOption(option);
                      setActiveDropDown(false);
                    }}
                    className="p-2 hover:bg-[#f4f4f4] cursor-pointer border-b-2"
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        <div className={`min-h-[400px] relative`}>
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"></div>
            </div>
          )}
          {!loading && data && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  {selectedOption.keys.map((key) => (
                    <TableHead className="capitalize" key={key}>{key.replace(/_/g, " ")}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className="hover:text-blue-400 hover:cursor-pointer"
                    onClick={() => {
                      clickHandler(item?.horse_id)
                    }} 
                  >
                    <TableCell>{index + 1}</TableCell>
                    {selectedOption.keys.map((key) => (
                      <TableCell key={key}>
                        {typeof item[key] === "number" ? Math.round(item[key] * 100) / 100 : item[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}

