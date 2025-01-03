"use client";

import React, { useState, useEffect } from "react";
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

// Sample Data
const chartData = [
  { year: "2024", totalScore: 8.7, conformation: 8.5, rideability: 8.3 },
  { year: "2025", totalScore: 8.9, conformation: 8.6, rideability: 8.7 },
  { year: "2026", totalScore: 8.8, conformation: 8.7, rideability: 8.6 },
];

const LineChartComponent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate loading for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="shadow-none border-0 bg-transparent w-full">
      <CardHeader>
        <CardTitle>Performance Trends: Arney</CardTitle>
        <p className="text-sm text-muted-foreground">
          Comparison of performance metrics over years
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
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[8, 9]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalScore"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  name="Total Score"
                />
                <Line
                  type="monotone"
                  dataKey="conformation"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  name="Conformation"
                />
                <Line
                  type="monotone"
                  dataKey="rideability"
                  stroke="#FBBF24"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  name="Rideability"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LineChartComponent;
