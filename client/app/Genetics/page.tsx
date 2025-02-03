'use client'
import React from 'react';
import { Card } from "@/components/ui/card";
import { useFetch } from '@/hook/useFetch';
import { TopListGeneticData } from '@/components/Genetics/TopListData/TopList';
import Loader from '@/components/Genetics/Loader/Loader';
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";

type TopListData = {
  rank: number;
  parent_id: number;
  parent_name: string;
  feif_id: string;
  offspring_count: number;
};

type Data = {
  total_unique_sires: number;
  total_unique_dams: number;
  max_sire_offspring_count: number;
  most_common_sire_id: number;
  most_common_sire_name: string;
  most_common_sire_feif_id: string;
  max_dam_offspring_count: number;
  most_common_dam_id: number;
  most_common_dam_name: string;
  most_common_dam_feif_id: string;
  top_10_sires: TopListData[];
  top_10_dams: TopListData[];
};


const Genetics = () => {
  const filters = useSelector((state: RootState) => state.filters) || {};

  const { data, loading } = useFetch<Data>({
    url: 'parent_offspring_summary',
    filterUrl: 'parent_offspring_summary',
    filters: {
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.gender_id ? { gender_id: filters.gender_id } : {}),
      ...(filters.show_id ? { show_id: filters.show_id } : {}),
      ...(filters.farm_id ? { farm_id: filters.farm_id } : {}),
    },
  });

  if (loading) {
    return <Loader/>
  }


  return (
    <div className='my-5'>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 bg-[#f4f4f4] p-2 rounded-lg md:bg-transparent md:p-0 md:rounded-none">
        <div className='text-center md:text-start w-full'>
          <h1 className="text-xl md:text-3xl font-bold">Genetics Analysis</h1>
          <p className="text-sm sm:text-md text-gray-600">An overview of key metrics and performance.</p>
        </div>
        <div className='flex justify-end w-full sm:w-auto'>
        </div>
      </div>

      {data?.map((d, id) => (
        <div key={id} className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Card className="chart_content flex flex-col gap-4 p-6">
            <h1 className="font-bold text-xl sm:text-2xl text-left">Most Common Sire</h1>
            <p className="font-medium text-md md:text-lg text-left">{d?.most_common_sire_name}</p>
            <div className="flex flex-col lg:flex-row justify-between gap-2 text-[12px] sm:text-sm">
              <div>
                <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                  <p>Sire Children :</p>
                  <span className="font-medium text-gray-400">{d?.max_sire_offspring_count}</span>
                </div>
                <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                  <p>Sire FEIF id :</p>
                  <span className="font-medium text-gray-400">{d?.most_common_sire_feif_id}</span>
                </div>
              </div>
              <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                <p>Total Unique Sires :</p>
                <span className="font-medium text-gray-400">{d?.total_unique_sires}</span>
              </div>
            </div>
          </Card>

          <Card className="chart_content flex flex-col gap-4 p-6">
            <h1 className="font-bold text-xl sm:text-2xl text-left">Most Common Dam</h1>
            <p className="font-medium text-md md:text-lg text-left">{d?.most_common_dam_name}</p>
            <div className="flex flex-col lg:flex-row justify-between gap-2 text-[12px] sm:text-sm">
              <div>
                <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                  <p>Dam Children :</p>
                  <span className="font-medium text-gray-400">{d?.max_dam_offspring_count}</span>
                </div>
                <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                  <p>Dam FEIF id :</p>
                  <span className="font-medium text-gray-400">{d?.most_common_dam_feif_id}</span>
                </div>
              </div>
              <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                <p>Total Unique Dams :</p>
                <span className="font-medium text-gray-400">{d?.total_unique_dams}</span>
              </div>
            </div>
          </Card>
        </div>
      ))}

      {data && data[0] && (
        <TopListGeneticData top10Sires={data[0].top_10_sires} top10Dams={data[0].top_10_dams} />
      )}
    </div>
  );
};

export default Genetics;
