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
  const itemsPerPage = 10;
  const router = useRouter()

  const { data, loading, error } = useFetch<Data>(
    "all_horse_analysis",
    itemsPerPage,
    (currentPage - 1) * itemsPerPage
  );

  const totalRecords = 100; 
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clickHandler = (id : number) => {
    router.push(`HorseDetails/?id=${id}`)
  }

  useEffect(() => {
    router.prefetch("HorseDetails");
  }, [router]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Horses Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`h-96 relative`}>
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"></div>
              </div>
            )}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && data && (
              <Table>
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
                      onClick={() => {
                        clickHandler(horse?.horse_id)
                      }}
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
              onClick={() =>
                handlePageChange(Math.max(1, currentPage - 1))
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? "bg-white border-2" : ""}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 && <PaginationEllipsis />}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
