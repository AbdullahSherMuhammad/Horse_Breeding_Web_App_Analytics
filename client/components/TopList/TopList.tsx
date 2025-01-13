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

type Horse = {
  rank: number;
  basic_info: {
    FEIF_ID: string;
    Name: string;
  };
  breeding_info: {
    Total_Score: number;
    Rider_Name: string;
    Year: number;
    Rideability: {
      Category: string;
      Score: number;
    }[];
  };
};

const mockHorses: Horse[] = [
  {
    rank: 1,
    basic_info: {
      FEIF_ID: "12345",
      Name: "Forkur frá Breiðabólsstað",
    },
    breeding_info: {
      Total_Score: 9.25,
      Rider_Name: "Flosi Ólafsson",
      Year: 2024,
      Rideability: [
        { Category: "Walk", Score: 9 },
        { Category: "Trot", Score: 9 },
        { Category: "Canter", Score: 9.5 },
        { Category: "Gallop", Score: 9.5 },
      ],
    },
  },
  {
    rank: 2,
    basic_info: {
      FEIF_ID: "67890",
      Name: "Móri frá Hoftúni",
    },
    breeding_info: {
      Total_Score: 9.2,
      Rider_Name: "Jón Vilmundarson",
      Year: 2024,
      Rideability: [
        { Category: "Walk", Score: 9 },
        { Category: "Trot", Score: 9 },
        { Category: "Canter", Score: 9.2 },
        { Category: "Gallop", Score: 9.3 },
      ],
    },
  },
  {
    rank: 3,
    basic_info: {
      FEIF_ID: "23456",
      Name: "Leynir frá Flugumýri",
    },
    breeding_info: {
      Total_Score: 9.1,
      Rider_Name: "Elsa Alberts",
      Year: 2023,
      Rideability: [
        { Category: "Walk", Score: 9 },
        { Category: "Trot", Score: 9 },
        { Category: "Canter", Score: 9 },
        { Category: "Gallop", Score: 9.3 },
      ],
    },
  },
  {
    rank: 4,
    basic_info: {
      FEIF_ID: "34567",
      Name: "Fönix frá Skrúð",
    },
    breeding_info: {
      Total_Score: 9.05,
      Rider_Name: "Óðinn Örn",
      Year: 2022,
      Rideability: [
        { Category: "Walk", Score: 9 },
        { Category: "Trot", Score: 9 },
        { Category: "Canter", Score: 9 },
        { Category: "Gallop", Score: 9.1 },
      ],
    },
  },
  {
    rank: 5,
    basic_info: {
      FEIF_ID: "45678",
      Name: "Veröld frá Blesastöðum",
    },
    breeding_info: {
      Total_Score: 9,
      Rider_Name: "Jón Sigurðsson",
      Year: 2023,
      Rideability: [
        { Category: "Walk", Score: 9 },
        { Category: "Trot", Score: 9 },
        { Category: "Canter", Score: 9 },
        { Category: "Gallop", Score: 9 },
      ],
    },
  },
];

export function TopList() {
  const getRadarData = (horse: Horse) => {
    return horse.breeding_info.Rideability.map((category) => ({
      trait: category.Category,
      value: category.Score,
    }));
  };

  return (
    <div className="space-y-6 mt-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center">Top 10 List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Horse Name</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>Rider Name</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHorses.map((horse) => (
                <Dialog key={horse.basic_info.FEIF_ID}>
                    <DialogTrigger asChild>
                        <TableRow  className="hover:text-blue-400 hover:cursor-pointer">
                        <TableCell>{horse.rank}</TableCell>
                        <TableCell>{horse.basic_info.Name}</TableCell>
                        <TableCell>{horse.breeding_info.Total_Score}</TableCell>
                        <TableCell>{horse.breeding_info.Rider_Name}</TableCell>
                        <TableCell>{horse.breeding_info.Year}</TableCell>
                        </TableRow>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{horse.basic_info.Name}</DialogTitle>
                        <DialogDescription>
                        FEIF ID: {horse.basic_info.FEIF_ID}
                        <br />
                        Total Score: {horse.breeding_info.Total_Score}
                        <br />
                        Rider Name: {horse.breeding_info.Rider_Name}
                        <br />
                        Year: {horse.breeding_info.Year}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <h4 className="font-semibold">Rideability Scores:</h4>
                        <ResponsiveContainer width="100%" height={300}>
                        <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            data={getRadarData(horse)}
                        >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="trait" />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} />
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
