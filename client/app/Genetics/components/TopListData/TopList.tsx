"use client";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useFetch } from "@/hook/useFetch";
import { useState } from "react";

type data = {
  top_10_sires : TopListData[] ;
  top_10_dams : TopListData[] ;
}

type TopListData = {
  rank: number;
  parent_name: string;
  offspring_count: number;
  feif_id: string;
  parent_id: number;
};

export function TopList() {
  const { data } = useFetch<data>("parent_offspring_summary");
  const List = data?.[0];

  const [showSire, setShowSire] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<TopListData | null>(null);

  const currentList = showSire ? List?.top_10_sires : List?.top_10_dams;
  const currentTitle = showSire ? "Top 10 Sires" : "Top 10 Dams";

  // Chart Data
  const chartData = selectedData
    ? [
        {
          name: selectedData.parent_name,
          children: selectedData.offspring_count,
        },
      ]
    : [];

  return (
    <div className="space-y-6 mt-5">
      {/* Toggle and Title */}
      <Card>
        <CardHeader className="flex justify-between md:flex-row md:items-center">
          <CardTitle className="text-xl sm:text-2xl mb-5 md:mb-0">
            {currentTitle}
          </CardTitle>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSire(true)}
              className={`px-4 py-2 rounded ${
                showSire ? "bg-[#1a1a1a] text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Show Sires
            </button>
            <button
              onClick={() => setShowSire(false)}
              className={`px-4 py-2 rounded ${
                !showSire ? "bg-[#1a1a1a] text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Show Dams
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Total Children</TableHead>
                <TableHead>FEIF ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentList?.map((item, index) => (
                <TableRow
                  key={index}
                  className="hover:text-blue-400 hover:cursor-pointer"
                  onClick={() => {
                    setSelectedData(item);
                    setDialogOpen(true);
                  }}
                >
                  <TableCell>{item.rank}</TableCell>
                  <TableCell>{item.parent_name}</TableCell>
                  <TableCell>{item.offspring_count}</TableCell>
                  <TableCell>{item.feif_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for Chart */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parent Details</DialogTitle>
          </DialogHeader>
          {selectedData && (
            <div>
              <h2 className="text-lg font-bold mb-4">{selectedData.parent_name}</h2>
              <p>
                This parent has <strong>{selectedData.offspring_count}</strong> children.
              </p>
              <p>
                FEIF ID:{" "}
                <strong>
                  {selectedData.feif_id ? selectedData.feif_id : "N/A"}
                </strong>
              </p>
              {/* Chart */}
              <div className="mt-6">
                <BarChart
                  width={400}
                  height={300}
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="children"
                    fill="rgb(129, 140, 248)"
                    barSize={30}
                    name="Children"
                  />
                </BarChart>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
