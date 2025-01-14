import ComparisonChart from '@/app/Compare/components/CompareChart/page'
import FilterComponent from '@/components/Filter/page'
import { Card } from '@/components/ui/card'
import React from 'react'

const Compare = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        {/* Text Content */}
        <div className='text-center md:text-start w-full'>
          <h1 className="text-xl md:text-3xl font-bold">Comparison Tools</h1>
          <p className="text-sm sm:text-md text-gray-600">
            An overview of key metrics and performance.
          </p>
        </div>

        {/* Filter Component */}
        <div className="flex justify-end w-full sm:w-auto">
          <FilterComponent />
        </div>
      </div>


        <Card>
            <ComparisonChart/>
        </Card>

    </>
  )
}

export default Compare