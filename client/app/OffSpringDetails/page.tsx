'use client';

import { Suspense } from 'react';
import Navbar from '@/components/layout/Header/Navbar';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Data = {
  parent_id: number;
  parent_feif_id: string;
  parent_name: string;
  relationship_type: string;
  number_of_offspring: number;
  avg_offspring_blup_total_score: number;
  avg_offspring_conformation: number;
  avg_offspring_rideability: number;
  avg_offspring_ridden_abilities_wo_pace: number;
  avg_offspring_total_wo_pace: number;
  offspring_feif_id: string[];
  offspring_names: string[];
  offspring_blup_total_scores: number[];
  offspring_conformation_scores: number[];
  offspring_rideability_scores: number[];
  offspring_ridden_abilities_wo_pace_scores: number[];
  offspring_total_wo_pace_scores: number[];
};

const TopListDetailsContent = () => {
  const query = useSearchParams();
  const endpoint = query.get('name');
  const id = query.get('id');
  
  const { data, loading, error } = useFetch<Data>({url: `${endpoint}?parent_id=eq.${id}`});

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error || !data || data.length === 0) return <div className="text-center mt-10">No data available</div>;

  const item = data[0];

  const barData = [
    { trait: 'Avg BLUP Total Score', value: item.avg_offspring_blup_total_score },
    { trait: 'Avg Conformation', value: item.avg_offspring_conformation },
    { trait: 'Avg Rideability', value: item.avg_offspring_rideability },
    { trait: 'Avg Ridden Abilities Wo Pace', value: item.avg_offspring_ridden_abilities_wo_pace },
    { trait: 'Avg Total Wo Pace', value: item.avg_offspring_total_wo_pace },
  ];

  return (
    <>
      <Card className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl md:text-2xl text-[#333] capitalize font-bold text-center md:text-left mb-4">
          Parent Details
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
          {['parent_feif_id', 'parent_name', 'relationship_type', 'number_of_offspring'].map((key) => (
            <div key={key} className="flex items-center gap-2 text-base md:text-lg p-2">
              <h4 className="text-[#444] font-semibold">{key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}:</h4>
              <p className="bg-[#f4f4f4] p-1 px-3 rounded-full">
                {item[key as keyof Data] !== null && item[key as keyof Data] !== undefined ? item[key as keyof Data] : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl capitalize font-semibold text-center mb-4">Offspring Details</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>FEIF ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>BLUP Score</TableHead>
              <TableHead>Conformation Score</TableHead>
              <TableHead>Rideability Score</TableHead>
              <TableHead>Ridden Abilities Wo Pace</TableHead>
              <TableHead>Total Wo Pace</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {item.offspring_feif_id?.map((feifId, index) => (
              <TableRow key={index}>
                <TableCell>{feifId}</TableCell>
                <TableCell>{item.offspring_names[index]}</TableCell>
                <TableCell>{(item.offspring_blup_total_scores[index] || 0).toFixed(2)}</TableCell>
                <TableCell>{(item.offspring_conformation_scores[index] || 0).toFixed(2)}</TableCell>
                <TableCell>{(item.offspring_rideability_scores[index] || 0).toFixed(2)}</TableCell>
                <TableCell>{(item.offspring_ridden_abilities_wo_pace_scores[index] || 0).toFixed(2)}</TableCell>
                <TableCell>{(item.offspring_total_wo_pace_scores[index] || 0).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Average Performance Chart</h2>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="trait"  
              />
              <YAxis domain={[0, Math.ceil(Math.max(...barData.map((d) => d.value)) * 1.1)]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" width={20} fill="#2a9d90" barSize={100} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No chartable data available</p>
        )}
      </Card>
    </>
  );
};

const OffSpringDetails = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Navbar toggleSidebar={() => {}} />
      <Suspense fallback={<div className="text-center mt-10">Loading page...</div>}>
        <TopListDetailsContent />
      </Suspense>
    </div>
  );
};

export default OffSpringDetails;
