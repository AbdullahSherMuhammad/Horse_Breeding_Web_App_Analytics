'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define the type for each event in the eventsData array
interface EventData {
  eventName: string;
  avgScore: number;
  horses: number;
  conditions: string;
  panels: string;
}

// Sample events data with proper typing
const eventsData: EventData[] = [
  {
    eventName: "Spring Show Hólar",
    avgScore: 8.62,
    horses: 50,
    conditions: "Indoor/Sunny",
    panels: "Th,K,A,S,O,J",
  },
  {
    eventName: "Summer Breeding Meet",
    avgScore: 8.55,
    horses: 60,
    conditions: "Outdoor/Cloudy",
    panels: "B,H,M,T,K,J",
  },
  {
    eventName: "Autumn Show Hella",
    avgScore: 8.58,
    horses: 55,
    conditions: "Indoor/Rainy",
    panels: "G,J,O,R,A,F",
  },
  {
    eventName: "Winter Show Akureyri",
    avgScore: 8.5,
    horses: 45,
    conditions: "Indoor/Snowy",
    panels: "Th,K,M,T,O,J",
  },
];

const EvetnTable: React.FC = () => {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Events Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Summary of events and their statistics
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>#Horses</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Panels Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventsData.map((event, index) => (
                <TableRow key={index} className={`$ {index % 2 === 0 ? "bg-muted/10" : "bg-muted/20"}`}>
                  <TableCell>{event.eventName}</TableCell>
                  <TableCell>{event.avgScore}</TableCell>
                  <TableCell>{event.horses}</TableCell>
                  <TableCell>{event.conditions}</TableCell>
                  <TableCell>{event.panels}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvetnTable;
