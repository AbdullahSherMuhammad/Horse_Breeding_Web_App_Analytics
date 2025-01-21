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
    keys: ["horse_name", "total_score", "feif_id", "assess_year"], 
    barData: ["total_score", "ridden_abilities_wo_pace", "total_wo_pace"]
  },
  { 
    label: "Horses by Conformation Score", 
    endpoint: "top_10_horses_conformation_score", 
    keys: ["horse_name", "conformation_score"], 
    barData: ["rideability_score"]
  },
  { 
    label: "Horses by Rideability Score", 
    endpoint: "top_10_horses_rideability_score", 
    keys: ["horse_name", "rideability_score"], 
    barData: ["rideability_score"]
  },
];

export function TopList() {
  const [isActiveDropDown, setActiveDropDown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(dropdownOptions[0]); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const { data } = useFetch<Data>(selectedOption.endpoint, 10);

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


  return (
    <div className="space-y-6 mt-5">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
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
        </CardContent>
      </Card>
    </div>
  );
}

