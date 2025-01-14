'use client';

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Define the type for chart data
interface ChartData {
  name: string;
  conformation: number;
  rideability: number;
}

// Sample Data
const chartData: ChartData[] = [
  {
    name: "Spring Show Hólar",
    conformation: 8.1,
    rideability: 8.6,
  },
  {
    name: "Summer Breeding Meet",
    conformation: 8.2,
    rideability: 8.7,
  },
  {
    name: "Autumn Show Hella",
    conformation: 8.3,
    rideability: 8.8,
  },
  {
    name: "Winter Show Akureyri",
    conformation: 8.0,
    rideability: 8.5,
  },
];

const chartConfig = {
  score: {
    label: "score",
    color: "hsl(var(--chart-1))",
  },
};


const EventBarChart: React.FC = () => {
  // State typing as boolean
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="shadow-none border-0 bg-transparent w-full">
      <CardHeader>
        <CardTitle>Scores by Event</CardTitle>
        <p className="text-sm text-muted-foreground">
          Comparison of conformation and rideability scores across different events
        </p>
      </CardHeader>
      <CardContent className="pb-0">
        {loading ? (
          // Loader Component
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          // Chart Component
            <ChartContainer config={chartConfig} className="p-0 w-full h-[300px]">

              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[7, 9]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="conformation"
                  fill="rgb(129, 140, 248)"
                  barSize={30}
                  name="Conformation"
                />
                <Bar
                  dataKey="rideability"
                  fill="rgb(52, 211, 153)"
                  barSize={30}
                  name="Rideability"
                />
              </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EventBarChart;
