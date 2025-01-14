"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample Data
const chartData = [
  { name: "Panel A", score: 8.5 },
  { name: "Panel B", score: 8.7 },
  { name: "Panel C", score: 8.3 },
  { name: "Panel D", score: 8.4 },
];

// Chart Configuration
const chartConfig = {
  score: {
    label: "score",
    color: "hsl(var(--chart-1))",
  },
};

const BarChartComponent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Total Score by Panel</CardTitle>
        <p className="text-sm text-muted-foreground">
          Comparison of average scores across different judging panels
        </p>
      </CardHeader>
      <CardContent className="p-0 w-full">
        {loading ? (
          // Loader Component
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-800"></div>
          </div>
        ) : (
          // Chart Component
          <ChartContainer config={chartConfig} className="w-full h-[300px] p-0">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[8, 9]} />
                <Tooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />
                <Bar
                  dataKey="score"
                  fill="purple"
                  barSize={150}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
