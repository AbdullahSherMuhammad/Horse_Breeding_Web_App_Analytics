import React from 'react'
import FilterComponent from '@/components/Filter/page'
import BarChartComponent from '@/app/Panels/components/PanelBarChart/page'

const Panels = () => {
  return (
    <>
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div  className="text-center md:text-start w-full"> 
            <h1 className="text-xl md:text-3xl font-bold">Panels Analysis</h1>
            <p className="text-sm sm:text-md text-gray-600">Comparison of average scores across different judging panels</p>
          </div>
          <div className='flex justify-end w-full sm:w-auto'>
            <FilterComponent/>
          </div>
        </div>

        <BarChartComponent/>
    </>
  )
}

export default Panels