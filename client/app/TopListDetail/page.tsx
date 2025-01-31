'use client';

import { Suspense } from 'react';
import Navbar from '@/components/layout/Header/Navbar';
import { Card, CardDescription } from '@/components/ui/card';
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

type Data = {
  horse_name: string;
  feif_id: string;
  assess_year: number;
  total_score: number;
  total_wo_pace: number;
  ridden_abilities_wo_pace: number;
  number_of_offspring_registered_to_date: number;
  inbreeding_coefficient_percent: number;
};

const TopListDetailsContent = () => {
  const query = useSearchParams();
  const endpoint = query.get('name');
  const id = query.get('id');
  const { data, loading, error } = useFetch<Data>({url: `${endpoint}?horse_id=eq.${id}`});

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error || !data || data.length === 0)
    return <div className="text-center mt-10">No data available</div>;

  const item = data[0];

  const barData = Object.entries(item)
    .filter(
      ([key, value]) =>
        typeof value === 'number' && key !== 'horse_id' && key !== 'assess_year' && key !== 'number_of_offspring_registered_to_date' && key !== 'inbreeding_coefficient_percent'
    )
    .map(([key, value]) => ({
      trait: key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
      value: value || 0,
    }));


  return (
    <>
      <Card className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl md:text-3xl text-[#333] capitalize font-semibold text-center md:text-left mb-4">
          {item.horse_name}
          {
            endpoint === 'top_horses_by_score' ? 
            <CardDescription>
              FEIF ID - {item.feif_id}
            </CardDescription> 
            :
            ''
          }
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
          {Object.entries(item)
            .filter(([key]) => key !== 'horse_id')
            .map(([key, value]) => (
              <div key={key} className='flex items-center gap-2 text-base md:text-lg p-2'>
                <h4 className='text-[#444] font-semibold'>{key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}:</h4>
                <p className='bg-[#f4f4f4] p-1 px-3 rounded-full'>
                   {value !== null && value !== undefined ? value : 'N/A'}
                </p>
              </div>
            ))}
        </div>
      </Card>

      <Card className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Chart</h2>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trait" />
              <YAxis domain={[0, 200]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4A90E2"  barSize={150} radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No chartable data available</p>
        )}
      </Card>
    </>
  );
};

const TopListDetails = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Navbar toggleSidebar={() => {}} />
      <Suspense fallback={<div className="text-center mt-10">Loading page...</div>}>
        <TopListDetailsContent />
      </Suspense>
    </div>
  );
};

export default TopListDetails;
