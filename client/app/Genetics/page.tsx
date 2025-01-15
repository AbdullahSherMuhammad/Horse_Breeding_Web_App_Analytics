'use client'
import React from 'react'
import FilterComponent from "@/components/Filter/page";
import { Card } from "@/components/ui/card";
import { useFetch } from '@/hook/useFetch';
import { TopList } from './components/TopListData/TopList';

type Data = {
  most_common_sire_name : string ;
  max_sire_offspring_count : number ;
  most_common_sire_feif_id : string ;
  most_common_dam_name : string ;
  max_dam_offspring_count : number ;
  most_common_dam_feif_id : string ;
  total_unique_dams : number;
  total_unique_sires : number;
}

const Genetics = () => {

  const { data } = useFetch<Data>('parent_offspring_summary')

  return (
    <div className='my-5'>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className='text-center md:text-start w-full'>
            <h1 className="text-xl md:text-3xl font-bold">Genetics Analysis</h1>
            <p className="text-sm sm:text-md text-gray-600">An overview of key metrics and performance.</p>
          </div>
          <div className='flex justify-end w-full sm:w-auto'>
            <FilterComponent/>
          </div>
        </div>

      {
        data?.map((d,id) => {
          return (
            <div key={id} className='grid grid-cols-1 sm:grid-cols-2 gap-4 '>
              <Card className="chart_content flex flex-col gap-4 p-6">
                  <h1 className="font-bold text-xl sm:text-2xl text-left">
                    Sire Overview
                  </h1>
                  <p className="font-medium text-md md:text-lg text-left">
                    {d?.most_common_sire_name}
                  </p>
                  <div className="flex flex-col lg:flex-row justify-between md:items-center gap-2 text-[12px] sm:text-sm">
                      <div>
                        <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                          <p>Sire Children :</p>
                          <span className="font-medium text-gray-400">{d?.max_sire_offspring_count}</span>
                        </div>
                        <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                          <p>Sire FEIF id :</p>
                          <span className="font-medium text-gray-400">
                            {d?.most_common_sire_feif_id}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                        <p>Total Unique Sires :</p>
                        <span className="font-medium text-gray-400">
                          {d?.total_unique_sires}
                        </span>
                      </div>
                  </div>
              </Card>
                      
              <Card className="chart_content flex flex-col gap-4 p-6 ">
                  <h1 className="font-bold text-xl sm:text-2xl text-left">
                    Dam Overview
                  </h1>
                  <p className="font-medium text-md md:text-lg text-left">
                    {d?.most_common_dam_name}
                  </p>
                  <div className="flex flex-col lg:flex-row justify-between md:tems-center gap-2 text-[12px] sm:text-sm">
                    <div>
                        <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                          <p>Sire Children :</p>
                          <span className="font-medium text-gray-400">{d?.max_dam_offspring_count}</span>
                        </div>
                        <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                          <p>Sire FEIF id :</p>
                          <span className="font-medium text-gray-400">
                            {d?.most_common_dam_feif_id}
                          </span>
                        </div>
                    </div>
                    <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                      <p>Total Unique Dams :</p>
                      <span className="font-medium text-gray-400">
                        {d?.total_unique_dams}
                      </span>
                    </div>
                  </div>
              </Card>
            </div>
          )
        })
      }

      <TopList/>
    </div>
  )
}

export default Genetics