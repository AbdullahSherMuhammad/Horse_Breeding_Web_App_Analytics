'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from 'react';
import { useFetch } from '@/hook/useFetch';
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";

type Judge = {
  name: string;
  role: string;
  short_name: string;
};

type PanelData = {
  judges: Judge[];
  show_name: string;
  avg_score_per_panel: number;
};

const Panels = () => {
  const filters = useSelector((state: RootState) => state.filters) || {};
  const { data, loading } = useFetch<PanelData>({
    url: 'panel_aggregate',
    filterUrl: 'panel_aggregate',
    filters: {
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.gender_id ? { gender_id: filters.gender_id } : {}),
      ...(filters.show_id ? { show_id: filters.show_id } : {}),
      ...(filters.farm_id ? { farm_id: filters.farm_id } : {}),
    },
  });
  const [hoveredJudge, setHoveredJudge] = useState<string | null>(null);

  const shortCleanName = (name: string): string => {
    return name.split(',')[0];
  };

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 bg-[#f4f4f4] p-2 rounded-lg md:bg-transparent md:p-0 md:rounded-none">
        <div className="text-center md:text-start w-full">
          <h1 className="text-xl md:text-3xl font-bold">Panels Analysis</h1>
          <p className="text-sm sm:text-md text-gray-600">
            Comparison of average scores across different judging panels
          </p>
        </div>
      </div>

      {/* Panels Card */}
      <Card>
        <CardHeader>
          <CardTitle>Panels Details</CardTitle>
          <p className="text-sm text-muted-foreground">Summary of Panels</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Loader */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
              </div>
            ) : data && data.length > 0 ? (
              <div className="overflow-x-auto max-w-[100%]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Show Name</TableHead>
                      <TableHead>Avg Score Per Panel</TableHead>
                      <TableHead>
                        <div className="flex gap-5 items-center">
                          <div>
                            <span>Short Names</span>
                          </div>
                          <span className="px-2 py-1 rounded-md bg-green-200 text-green-800"> Chief Judge </span>
                          <span className="px-2 py-1 rounded-md bg-blue-200 text-blue-800"> Judge </span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item, index) => {
                      const sortedJudges = [...item.judges].sort((a, b) => {
                        if (a.role === "chief_judge") return -1;
                        if (b.role === "chief_judge") return 1;
                        return 0;
                      });

                      return (
                        <TableRow key={index} className={`${index % 2 === 0 ? "bg-muted/10" : "bg-muted/20"}`}>
                          <TableCell>{shortCleanName(item.show_name)}</TableCell>
                          <TableCell>{parseFloat(item.avg_score_per_panel.toString()).toFixed(2)}</TableCell>

                          <TableCell>
                            <div className="flex gap-2 flex-wrap">
                              {sortedJudges.map((j, id) => {
                                const uniqueId = `${j.short_name}-${index}-${id}`;
                                return (
                                  <div
                                    key={uniqueId}
                                    className="relative cursor-pointer"
                                    onMouseEnter={() => setHoveredJudge(uniqueId)}
                                    onMouseLeave={() => setHoveredJudge(null)}
                                  >
                                    <span
                                      className={`px-2 py-1 rounded-md ${
                                        j.role === "chief_judge"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      {j.short_name}
                                    </span>
                                    {hoveredJudge === uniqueId && (
                                      <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-black text-white px-3 py-1 rounded-md text-xs shadow-md whitespace-nowrap transition-opacity duration-200">
                                        {j.name}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <h1 className="text-gray-500 text-lg">No Data Available</h1>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Panels;
