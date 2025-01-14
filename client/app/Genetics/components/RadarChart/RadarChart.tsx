'use client';

import React, { useState, useEffect } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { name: "Tölt", horse: 186 },
  { name: "Conformation", horse: 209 },
  { name: "Spirit", horse: 305 },
  { name: "Pace", horse: 237 },
  { name: "Rideability", horse: 273 },
];

const chartConfig = {
  horse: {
    label: "horse",
    color: "hsl(var(--chart-1))",
  },
};

const RadarChartComponent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="shadow-none border-0 flex justify-center items-center bg-transparent">
      <CardHeader className="hidden"></CardHeader>
      <CardContent className="p-0">
        {loading ? (
          // Loader Component
          <div className="flex justify-center items-center h-[250px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          // Chart Component
          <ChartContainer config={chartConfig} className="text-[10px] md:text-sm mx-auto p-0 h-[200px] md:h-[250px]">
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="name" />
              <PolarGrid />
              <Radar
                dataKey="horse"
                fill="blue"
                fillOpacity={0.6}
                dot={{ r: 4, fillOpacity: 1 }}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RadarChartComponent;
