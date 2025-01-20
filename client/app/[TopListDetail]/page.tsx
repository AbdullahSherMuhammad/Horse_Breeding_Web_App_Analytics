'use client';

import { Card } from '@/components/ui/card';
import { useFetch } from '@/hook/useFetch';
import { useSearchParams } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import React, { useEffect, useState } from 'react';

type Data = {
  horse_name: string;
  total_score: number;
  feif_id: number;
  assess_year: number;
  ridden_abilities_wo_pace: number;
  total_wo_pace: number;
  inbreeding_coefficient_percent?: number;
  number_of_offspring_registered_to_date?: number;
  farm_name: string;
  avg_total_score: number;
  number_of_horses: number;
  avg_rideability: number;
  [key: string]: string | number | undefined;
};

const Page = ({ params }: { params: { TopListDetail: string } }) => {
  const query = useSearchParams();
  const [key, setKey] = useState<string | null>(null);
  const [id, setId] = useState<string | number | null>(null);
  const [endPoint, setEndPoint] = useState<string | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const { TopListDetail } = await params;
      setEndPoint(TopListDetail);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    const keyParam = query.get('key');
    const idParam = query.get('id');

    if (keyParam && idParam) {
      setKey(keyParam);
      setId(idParam);
    }
  }, [query]);

  // Only fetch data if all parameters are ready
  const canFetch = endPoint && key && id;
  const { data, loading, error } = useFetch<Data>(
    canFetch ? `${endPoint}?${key}=eq.${id}` : '',
    1
  );

  if (!canFetch) return <div>Initializing...</div>; // Show a loading state until all params are ready
  if (loading) return <div>Loading...</div>;
  if (error || !data || data.length === 0) return <div>No data available</div>;

  const item = data[0];
  const barDataFields =
    endPoint === 'top_horses_by_score'
      ? ['total_score', 'ridden_abilities_wo_pace', 'total_wo_pace']
      : ['avg_total_score', 'avg_rideability', 'number_of_horses'];

  const getBarChartData = () =>
    barDataFields.map((field) => ({
      trait: field.replace(/_/g, ' '),
      value: Math.round((item[field] as number) * 100) / 100,
    }));

  return (
    <Card className="flex flex-col lg:flex-row gap-6 justify-between items-center p-5 my-5 overflow-hidden">
      {/* Content Section */}
      <div className="chart_content flex flex-col gap-4 lg:w-1/2">
        <h1 className="font-bold text-lg sm:text-2xl text-center lg:text-left">
          {endPoint === 'top_horses_by_score' ? 'Horse By Total Score' : 'Farm Details'}
        </h1>
        {endPoint === 'top_horses_by_score' ? (
          <>
            <p className="font-medium text-lg text-center lg:text-left">
              Horse Name: <span className="font-bold">{item.horse_name || 'N/A'}</span>
            </p>
            <p className="font-medium text-lg text-center lg:text-left">
              FEIF ID: <span className="font-bold">{item.feif_id || 'N/A'}</span>
            </p>
            <div className="flex flex-col gap-2 text-[12px] sm:text-sm">
              <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                <p>Inbreeding Coefficient:</p>
                <span className="font-medium text-gray-400">
                  {item.inbreeding_coefficient_percent || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                <p>Number of Offspring Registered:</p>
                <span className="font-medium text-gray-400">
                  {item.number_of_offspring_registered_to_date || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                <p>Ridden Ability:</p>
                <span className="font-medium text-gray-400">
                  {item.ridden_abilities_wo_pace || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                <p>Total Score:</p>
                <span className="font-medium text-gray-400">{item.total_score || 'N/A'}</span>
              </div>
              <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                <p>Total Without Pace:</p>
                <span className="font-medium text-gray-400">{item.total_wo_pace || 'N/A'}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="font-medium text-lg text-center lg:text-left">
              Farm Name: <span className="font-bold">{item.farm_name || 'N/A'}</span>
            </p>
            <p className="font-medium text-lg text-center lg:text-left">
              Avg Total Score: <span className="font-bold">{item.avg_total_score || 'N/A'}</span>
            </p>
            <div className="flex flex-col gap-2 text-[12px] sm:text-sm">
              <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                <p>Number of Horses:</p>
                <span className="font-medium text-gray-400">
                  {item.number_of_horses || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                <p>Avg Rideability:</p>
                <span className="font-medium text-gray-400">{item.avg_rideability || 'N/A'}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Chart Section */}
      <div className="flex justify-center lg:w-1/2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getBarChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trait" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default Page;
