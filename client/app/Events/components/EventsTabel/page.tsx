'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <table className="min-w-full border-collapse border-spacing-0">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Event Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Avg Score</th>
                <th className="px-4 py-2 text-left text-sm font-medium">#Horses</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Conditions</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Panels Active</th>
              </tr>
            </thead>
            <tbody>
              {eventsData.map((event, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-muted/10" : "bg-muted/20"
                  }`}
                >
                  <td className="px-4 py-2 text-sm">{event.eventName}</td>
                  <td className="px-4 py-2 text-sm">{event.avgScore}</td>
                  <td className="px-4 py-2 text-sm">{event.horses}</td>
                  <td className="px-4 py-2 text-sm">{event.conditions}</td>
                  <td className="px-4 py-2 text-sm">{event.panels}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvetnTable;
