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
import { useState } from "react";

type TopListData = {
  rank: number;
  parent_id: number;
  parent_name: string;
  feif_id: string;
  offspring_count: number;
};

type TopListGeneticData = {
  top10Sires: TopListData[];
  top10Dams: TopListData[];
};


export const TopListGeneticData: React.FC<TopListGeneticData> = ({ top10Sires, top10Dams }) => {

  const [showSire, setShowSire] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<TopListData | null>(null);

  const currentList = showSire ? top10Sires : top10Dams;
  const currentTitle = showSire ? `Top ${top10Sires ? top10Sires.length : '10' } Sires` : `Top ${top10Dams ? top10Dams.length : '10'} Dams`;

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
                className={`px-4 py-2 font-medium ${
                  showSire
                    ? "border-b-2 border-black text-black font-bold"
                    : "border-b-2 border-transparent text-gray-500"
                }`}
              >
                Show Sires
              </button>
              <button
                onClick={() => setShowSire(false)}
                className={`px-4 py-2 font-medium ${
                  !showSire
                    ? "border-b-2 border-black text-black font-bold"
                    : "border-b-2 border-transparent text-gray-500"
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
