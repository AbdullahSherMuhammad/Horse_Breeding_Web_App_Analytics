import React from 'react'
import FilterComponent from "@/components/Filter/page";
import LineChartComponent from '@/app/Performance/components/performLineChart/page';
import { Card } from '@/components/ui/card';

const Performance = () => {
  return (
    <>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
          <h1 className="text-2xl font-bold">Performance Analysis</h1>
          <p className="text-gray-600">An overview of key metrics and performance.</p>
          </div>
          <div className='flex justify-end w-full sm:w-auto'>
            <FilterComponent/>
          </div>
        </div>

        <Card>
          <LineChartComponent/>
        </Card>

    </>
  )
}

export default Performance