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
import { useFetch } from "@/hook/useFetch";


type data = {
  feif_id : string ;
  horse_id : number ;
  horse_name : string ;
  assess_year : number ;
  total_score : number ;
  total_wo_pace : number ;
  ridden_abilities_wo_pace : number ;
  inbreeding_coefficient_percent : number ;
  number_of_offspring_registered_to_date : number ;
}


export function TopList() {

  const { data } = useFetch<data>('top_horses_by_score')


  const getRadarData = (horse: data) => {
    const rideabilityScores = [
      { trait: 'Total Score', value: horse.total_score },
      { trait: 'Without Pace', value: horse.total_wo_pace },
      { trait: 'Ridden Abilities', value: horse.ridden_abilities_wo_pace },
      { trait: 'Inbreeding Coefficient', value: horse.inbreeding_coefficient_percent },
      { trait: 'Offspring Registered', value: horse.number_of_offspring_registered_to_date },
    ];
  
    return rideabilityScores;
  };

  return (
    <div className="space-y-6 mt-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Top 10 List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Horse Name</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>FEIF ID</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item,index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <TableRow className="hover:text-blue-400 hover:cursor-pointer">
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{item.horse_name}</TableCell>
                      <TableCell>{item.total_score}</TableCell>
                      <TableCell>{item.feif_id}</TableCell>
                      <TableCell>{item.assess_year}</TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{item.horse_name}</DialogTitle>
                      <DialogDescription>
                        FEIF ID: {item.feif_id}
                        <br />
                        Total Score: {item.total_score}
                        <br />
                        Year: {item.assess_year}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <h4 className="font-semibold">Rideability Scores:</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          data={getRadarData(item)}
                          className="text-sm"
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
