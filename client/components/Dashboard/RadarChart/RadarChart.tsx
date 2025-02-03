'use client';

import React, { useState, useEffect } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useFetch } from "@/hook/useFetch";

interface RadarChartFilters {
  year?: number;
  gender_id?: number;
  show_id?: number;
  farm_id?: number;
}

type Data = {
  avg_total_score: number;
  avg_total_wo_pace: number;
  avg_pace: number;
  avg_conformation: number;
  avg_rideability: number;
};

interface RadarChartComponentProps {
  filters: RadarChartFilters;
}

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ filters }) => {
  const [loadingLocal, setLoadingLocal] = useState(true);

  const { data, loading } = useFetch<Data>({
    url: 'total_blup',
    filterUrl: 'get_filtered_blup_results',
    filters: {
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.gender_id ? { gender_id: filters.gender_id } : {}),
      ...(filters.show_id ? { show_id: filters.show_id } : {}),
      ...(filters.farm_id ? { farm_id: filters.farm_id } : {}),
    },
  });

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
      setLoadingLocal(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="shadow-none border-0 flex justify-center items-center bg-transparent">
      <CardHeader className="hidden"></CardHeader>
      <CardContent className="pb-0">
        {loading || loadingLocal ? (
          // Loader Component
          <div className="flex justify-center items-center h-[250px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          // Chart Component
          <ChartContainer config={chartConfig} className="text-[10px] md:text-sm mx-auto h-[200px] md:h-[250px]">
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis  domain={[0, 160]} tickCount={6} />
              <Radar
                dataKey="horse"
                fill="purple"
                stroke="purple"
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
