"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Horse = typeof mockHorses[0];

const mockHorses = [
  {
    basic_info: {
      "FEIF ID": "12345",
      Name: "Thunderbolt",
    },
    breeding_info: [
      {
        Assessment: {
          Totals: {
            Total_Score: 89,
          },
          Rideability: [
            { Category: "Walk", Score: 8 },
            { Category: "Trot", Score: 7 },
            { Category: "Canter", Score: 9 },
            { Category: "Gallop", Score: 8 },
          ],
          Show: {
            Name: "National Championship",
          },
        },
      },
    ],
  },
  {
    basic_info: {
      "FEIF ID": "67890",
      Name: "Starlight",
    },
    breeding_info: [
      {
        Assessment: {
          Totals: {
            Total_Score: 92,
          },
          Rideability: [
            { Category: "Walk", Score: 9 },
            { Category: "Trot", Score: 9 },
            { Category: "Canter", Score: 8 },
            { Category: "Gallop", Score: 9 },
          ],
          Show: {
            Name: "Regional Championship",
          },
        },
      },
    ],
  },
];

export function HorsesInsights() {

  const getRadarData = (horse: Horse) => {
    return horse.breeding_info[0].Assessment.Rideability.map((category) => ({
      trait: category.Category,
      value: category.Score,
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Horses Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FEIF ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHorses.map((horse) => (
                <TableRow key={horse.basic_info["FEIF ID"]}>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="cursor-pointer text-blue-500 hover:underline">
                          {horse.basic_info["FEIF ID"]}
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{horse.basic_info.Name}</DialogTitle>
                          <DialogDescription>
                            FEIF ID: {horse.basic_info["FEIF ID"]}
                            <br />
                            Total Score:{" "}
                            {horse.breeding_info[0].Assessment.Totals.Total_Score}
                            <br />
                            Event:{" "}
                            {horse.breeding_info[0].Assessment.Show.Name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <h4 className="font-semibold">
                            Rideability Scores:
                          </h4>
                          <ResponsiveContainer width="100%" height={300}>
                            <RadarChart
                              cx="50%"
                              cy="50%"
                              outerRadius="80%"
                              data={getRadarData(horse)}
                            >
                              <PolarGrid />
                              <PolarAngleAxis dataKey="trait" />
                              <PolarRadiusAxis
                                angle={30}
                                domain={[0, 10]}
                              />
                              <Radar
                                name="Score"
                                dataKey="value"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{horse.basic_info.Name}</TableCell>
                  <TableCell>
                    {
                      horse.breeding_info[0].Assessment.Totals.Total_Score
                    }
                  </TableCell>
                  <TableCell>
                    {horse.breeding_info[0].Assessment.Show.Name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
