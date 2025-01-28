'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hook/useFetch";

// Define the type for each event in the eventsData array
interface EventData {
  show_id: number;
  show_name: string;
  start_date: string;
  end_date: string;
  horse_count: number;
  participant_count: number;
}

const EventTable: React.FC = () => {

  const { data, loading, error } = useFetch<EventData>('events_analysis');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading events data: {error}</div>;

  const shortCleanName = (name: string): string => {
    const cleanName = name.split(',')[0];
    return cleanName;
  }

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
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>#Horses</TableHead>
                <TableHead>#Participants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.map((event: EventData, index: number) => (
                <TableRow key={event.show_id} className={`${index % 2 === 0 ? "bg-muted/10" : "bg-muted/20"}`}>
                  <TableCell>{shortCleanName(event?.show_name)}</TableCell>
                  <TableCell>{event.start_date}</TableCell>
                  <TableCell>{event.end_date}</TableCell>
                  <TableCell>{event.horse_count}</TableCell>
                  <TableCell>{event.participant_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventTable;
