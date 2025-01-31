'use client';

import React, { useState, useEffect } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useFetch } from "@/hook/useFetch";

type Data = {
  avg_total_score : number ;
  avg_total_wo_pace : number ;
  avg_pace : number ;
  avg_conformation : number ;
  avg_rideability : number ;
}

const RadarChartComponent = () => {
  const [loading, setLoading] = useState(true);
  const { data } = useFetch<Data>({ url: 'total_blup' });
  
  const chartData = [
    { name: "Average score", horse: data?.[0]?.avg_total_score || 0 },
    { name: "Average WO Pace", horse: data?.[0]?.avg_total_wo_pace || 0 },
    { name: "Pace", horse: data?.[0]?.avg_pace || 0 },
    { name: "Conformation", horse: data?.[0]?.avg_conformation || 0 },
    { name: "Rideability", horse: data?.[0]?.avg_rideability || 0 },
  ];

  const chartConfig = {
    horse: {
      label: "horse",
      color: "hsl(var(--chart-1))",
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="shadow-none border-0 flex justify-center items-center bg-transparent">
      <CardHeader className="hidden"></CardHeader>
      <CardContent className="pb-0">
        {loading ? (
          // Loader Component
          <div className="flex justify-center items-center h-[250px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          // Chart Component
          <ChartContainer config={chartConfig} className="text-[10px] md:text-sm mx-auto h-[200px] md:h-[250px]">
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="name" />
              <PolarGrid />
              <Radar
                dataKey="horse"
                fill="purple"
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
