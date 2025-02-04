'use client';

import React, { useEffect, useState, useMemo } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GoArrowUp, GoArrowDown } from "react-icons/go";
import { useFetch } from "@/hook/useFetch";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";

const UpArrow = () => (
  <span style={{ cursor: "pointer", marginLeft: "5px" }}>
    <GoArrowUp />
  </span>
);
const DownArrow = () => (
  <span style={{ cursor: "pointer", marginLeft: "5px" }}>
    <GoArrowDown />
  </span>
);

type Data = {
  horse_id: number;
  feif_id: string;
  name: string;
  date_of_birth: number;
  number_of_shows: number;
  blup_score: number;
};

export function HorsesInsights() {

  const filters = useSelector((state: RootState) => state.filters) || {};

  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  useEffect(() => {
    setCurrentPage(1);
  }, [memoizedFilters]);

  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState(5);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>("desc");
  const itemsPerPage = 10;
  const router = useRouter();

  const { data, totalRecords, loading, error } = useFetch<Data>({
    url: "all_horse_analysis",
    filterUrl: "all_horse_analysis",
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    filters: {
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.gender_id ? { gender_id: filters.gender_id } : {}),
      ...(filters.show_id ? { show_id: filters.show_id } : {}),
      ...(filters.farm_id ? { farm_id: filters.farm_id } : {}),
    },
  });

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisiblePages(3);
      else if (window.innerWidth < 1024) setVisiblePages(5);
      else setVisiblePages(7);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clickHandler = (id: string) => {
    router.push(`HorseDetails/?query=${id}`);
  };

  useEffect(() => {
    router.prefetch("HorseDetails");
  }, [router]);

  const startPage = Math.max(
    1,
    Math.min(
      totalPages - visiblePages + 1,
      currentPage - Math.floor(visiblePages / 2)
    )
  );
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  const sortedData = useMemo(() => {
    if (!data) return [];
    if (sortOrder === "asc") {
      return [...data].sort(
        (a, b) => a.number_of_shows - b.number_of_shows
      );
    } else if (sortOrder === "desc") {
      return [...data].sort(
        (a, b) => b.number_of_shows - a.number_of_shows
      );
    }
    return data;
  }, [data, sortOrder]);

  const handleSortAsc = () => {
    setSortOrder("asc");
  };

  const handleSortDesc = () => {
    setSortOrder("desc");
  };

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Horses Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-96 relative">
            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"></div>
              </div>
            )}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && sortedData && (
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Number of Shows
                        <div className="flex ml-2">
                          <button
                            onClick={handleSortDesc}
                            aria-label="Sort descending"
                            className={`flex items-center text-xl ${
                              sortOrder === "asc" ? "" : "text-blue-400"
                            }`}
                          >
                            <UpArrow />
                          </button>
                          <button
                            onClick={handleSortAsc}
                            aria-label="Sort ascending"
                            className={`flex items-center text-xl ${
                              sortOrder === "asc" ? "text-blue-400" : ""
                            }`}
                          >
                            <DownArrow />
                          </button>
                        </div>
                      </div>
                    </TableHead>
                    <TableHead>Blup Score</TableHead>
                    <TableHead>FEIF ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((horse) => (
                    <TableRow
                      key={horse.horse_id}
                      className="hover:cursor-pointer hover:text-blue-400"
                      onClick={() => clickHandler(horse.feif_id)}
                    >
                      <TableCell>{horse.name}</TableCell>
                      <TableCell>{horse.date_of_birth}</TableCell>
                      <TableCell>{horse.number_of_shows}</TableCell>
                      <TableCell>{horse.blup_score}</TableCell>
                      <TableCell>{horse.feif_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                handlePageChange(Math.max(1, currentPage - 1))
              }
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "bg-white border-2" : ""}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {endPage < totalPages && <PaginationEllipsis />}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(
                  Math.min(totalPages, currentPage + 1)
                )
              }
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Record Range Information */}
      <div className="text-center text-sm text-gray-600">
        {totalRecords > 0
          ? `Showing ${startRecord} to ${endRecord} of ${totalRecords} Records`
          : "No records found."}
      </div>
    </div>
  );
}
