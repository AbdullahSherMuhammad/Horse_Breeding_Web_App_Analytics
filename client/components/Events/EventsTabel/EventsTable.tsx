'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hook/useFetch";
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";

interface EventData {
  show_id: number;
  show_name: string;
  avg_score: number;
  horse_count: number;
  participant_count: number;
}

const EventTable: React.FC = () => {

  const filters = useSelector((state: RootState) => state.filters) || {};

  const { data, loading, error } = useFetch<EventData>({ 
    url: 'events_analysis',
    filterUrl: 'events_analysis',
    filters: {
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.gender_id ? { gender_id: filters.gender_id } : {}),
      ...(filters.show_id ? { show_id: filters.show_id } : {}),
      ...(filters.farm_id ? { farm_id: filters.farm_id } : {}),
    },
  });

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
                <TableHead>Average Score</TableHead>
                <TableHead>#Horses</TableHead>
                <TableHead>#Participants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.map((event: EventData, index: number) => (
                <TableRow key={event.show_id} className={`${index % 2 === 0 ? "bg-muted/10" : "bg-muted/20"}`}>
                  <TableCell>{shortCleanName(event?.show_name)}</TableCell>
                  <TableCell>{parseFloat(event.avg_score.toFixed(2))}</TableCell>
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
