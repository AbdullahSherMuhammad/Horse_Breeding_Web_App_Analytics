'use client';

import React, { useEffect, useState } from "react";
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
import { useFetch } from "@/hook/useFetch";
import { useRouter } from "next/navigation";

type Data = {
  horse_id: number;
  feif_id: string;
  name: string;
  date_of_birth: number;
  number_of_shows: number;
};

export function HorsesInsights() {
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState(5);
  const itemsPerPage = 10;
  const router = useRouter();

  const { data, loading, error } = useFetch<Data>(
    "all_horse_analysis",
    itemsPerPage,
    (currentPage - 1) * itemsPerPage
  );

  const totalRecords = 100;
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

  const clickHandler = (id: number) => {
    router.push(`HorseDetails/?id=${id}`);
  };

  useEffect(() => {
    router.prefetch("HorseDetails");
  }, [router]);

  const startPage = Math.max(
    1,
    Math.min(totalPages - visiblePages + 1, currentPage - Math.floor(visiblePages / 2))
  );
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

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
            {!loading && data && (
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>FEIF ID</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Number of Shows</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((horse) => (
                    <TableRow
                      key={horse?.horse_id}
                      className="hover:cursor-pointer hover:text-blue-400"
                      onClick={() => clickHandler(horse?.horse_id)}
                    >
                      <TableCell>{horse?.horse_id}</TableCell>
                      <TableCell>{horse?.name}</TableCell>
                      <TableCell>{horse?.feif_id}</TableCell>
                      <TableCell>{horse?.date_of_birth}</TableCell>
                      <TableCell>{horse?.number_of_shows}</TableCell>
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
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
