import EventBarChart from '@/app/Events/components/EventBarChart/page';
import EvetnTable from '@/app/Events/components/EventsTabel/page'
import FilterComponent from "@/components/Filter/page";
import { Card } from '@/components/ui/card';
import React from 'react'

const Events = () => {
  return (
    <div className='my-5'>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
          <h1 className="text-2xl font-bold">Events Analysis</h1>
          <p className="text-gray-600">An overview of key metrics and performance.</p>
          </div>
          <div className='flex justify-end w-full sm:w-auto'>
            <FilterComponent/>
          </div>
        </div>
        <EvetnTable/>
        <Card className="my-5">
          <EventBarChart/>
        </Card>
    </div>
  )
}

export default Events