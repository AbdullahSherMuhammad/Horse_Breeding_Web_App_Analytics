'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from 'react';
import { useFetch } from '@/hook/useFetch';

type PanelData = {
  panel: {
    person_name: string;
    role_name: string;
  }[];
  show_name: string;
  shows_with_same_panel: number[];
};

const Panels = () => {
  const { data, loading } = useFetch<PanelData>('panel_groups');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedData, setSortedData] = useState<PanelData[] | null>(null);

  const cleanShowName = (name: string) => {
    const parts = name.split(",");
    return parts[0];
  };

  const sortShowsWithSamePanel = () => {
    if (!data) return;

    const sorted = [...data].sort((a, b) => {
      const sumA = a.shows_with_same_panel.reduce((acc, num) => acc + num, 0);
      const sumB = b.shows_with_same_panel.reduce((acc, num) => acc + num, 0);

      return sortOrder === 'asc' ? sumA - sumB : sumB - sumA;
    });

    setSortedData(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const tableData = sortedData || data;

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 bg-[#f4f4f4] p-2 rounded-lg md:bg-transparent md:p-0 md:rounded-none">
        <div className="text-center md:text-start w-full">
          <h1 className="text-xl md:text-3xl font-bold">Panels Analysis</h1>
          <p className="text-sm sm:text-md text-gray-600">Comparison of average scores across different judging panels</p>
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
            ) : tableData && tableData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Show Name</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <button
                          onClick={sortShowsWithSamePanel}
                          className="ml-2 text-gray-600 hover:text-gray-900"
                          >
                          Show with same panel
                          {sortOrder === 'asc' ? '▲' : '▼'}
                        </button>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item, index) =>
                    item.panel.map((panelMember, panelIndex) => (
                      <TableRow
                        key={`${index}-${panelIndex}`}
                        className={`${
                          (index + panelIndex) % 2 === 0 ? "bg-muted/10" : "bg-muted/20"
                        }`}
                      >
                        <TableCell>{panelMember?.person_name}</TableCell>
                        <TableCell>{panelMember?.role_name}</TableCell>
                        <TableCell>{cleanShowName(item?.show_name)}</TableCell>
                        <TableCell>{item?.shows_with_same_panel.join(", ")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
