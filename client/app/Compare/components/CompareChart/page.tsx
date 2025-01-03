'use client';

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Define the types for the dataset
interface DataPoint {
  skill: string;
  panelA: number;
  panelB: number;
}

interface DataSets {
  [key: string]: DataPoint[];
}

// Sample Data
const dataSets: DataSets = {
  "Panel A vs Panel B": [
    { skill: "Tölt", panelA: 8.5, panelB: 8.3 },
    { skill: "Trot", panelA: 8.2, panelB: 8.2 },
    { skill: "Pace", panelA: 8.0, panelB: 8.1 },
    { skill: "Gallop", panelA: 8.7, panelB: 8.6 },
    { skill: "Spirit", panelA: 8.9, panelB: 8.8 },
  ],
  "Event X vs Event Y": [
    { skill: "Tölt", panelA: 8.4, panelB: 8.2 },
    { skill: "Trot", panelA: 8.1, panelB: 8.3 },
    { skill: "Pace", panelA: 7.9, panelB: 8.0 },
    { skill: "Gallop", panelA: 8.6, panelB: 8.4 },
    { skill: "Spirit", panelA: 8.8, panelB: 8.7 },
  ],
};

const ComparisonChart = () => {
  // Typing the state for selectedDataSet as a string
  const [selectedDataSet, setSelectedDataSet] = useState<string>("Panel A vs Panel B");

  const data = dataSets[selectedDataSet];

  return (
    <Card className="shadow-none border-0 bg-transparent w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <CardTitle className="text-lg sm:text-xl">Comparison Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare scores between different panels, events, or horse lineages
          </p>
        </div>
        {/* Dropdown for Selecting Dataset */}
        <div className="mt-3 sm:mt-0 sm:w-72 w-full">
          <Select
            onValueChange={(value: string) => setSelectedDataSet(value)}  // Typing the value as string
            defaultValue={selectedDataSet}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select comparison type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Panel A vs Panel B">Panel A vs Panel B</SelectItem>
              <SelectItem value="Event X vs Event Y">Event X vs Event Y</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Line Chart */}
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis domain={[7, 9]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="panelA"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 5 }}
                name="Panel A"
              />
              <Line
                type="monotone"
                dataKey="panelB"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 5 }}
                name="Panel B"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonChart;