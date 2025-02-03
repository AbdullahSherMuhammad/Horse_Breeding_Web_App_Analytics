'use client'
import { useFetch } from '@/hook/useFetch';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";

type Data = {
  parent_id: number;
  parent_feif_id: string;
  parent_name: string;
  relationship_type: string;
  number_of_offspring: number;
  avg_offspring_blup_total_score: number;
};

const TableOffSpring = () => {
  const filters = useSelector((state: RootState) => state.filters) || {};
  const { data, loading } = useFetch<Data>({
    url: 'top_10_parents_by_offspring_performance',
    filterUrl: 'top_10_parents_by_offspring_performance',
    filters: {
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.gender_id ? { gender_id: filters.gender_id } : {}),
      ...(filters.show_id ? { show_id: filters.show_id } : {}),
      ...(filters.farm_id ? { farm_id: filters.farm_id } : {}),
    },
  });

  const router = useRouter();

  const keys: (keyof Data)[] = [
    'parent_name',
    'relationship_type',
    'number_of_offspring',
    'avg_offspring_blup_total_score',
    'parent_feif_id',
  ];

  const clickHandler = (parentId: number) => {
    router.push(`/OffSpringDetails/?name=top_10_parents_by_offspring_performance&id=${parentId}`);
  };

  useEffect(() => {
    router.prefetch("OffSpringDetails");
  }, [router]);

  return (
    <div className="space-y-6 mt-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center md:text-left">
            Top {data && data ? data?.length : '10'} Parents by Offspring Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`min-h-[400px] relative`}>
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"></div>
              </div>
            )}

            {!loading && data && data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    {keys.map((key) => (
                      <TableHead key={key} className="capitalize">
                        {key.replace(/_/g, ' ')}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow
                      key={item.parent_id}
                      onClick={() => clickHandler(item.parent_id)}
                      className="hover:text-blue-400 hover:cursor-pointer"
                    >
                      <TableCell>{index + 1}</TableCell>
                      {keys.map((key) => (
                        <TableCell key={key}>
                          {typeof item[key] === 'number'
                            ? Math.round(item[key] * 100) / 100
                            : item[key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              !loading && data && data.length === 0 && (
                <div className="flex justify-center items-center h-full">
                  <h1 className="text-gray-500 text-lg">No data available for the selected filters</h1>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TableOffSpring;
