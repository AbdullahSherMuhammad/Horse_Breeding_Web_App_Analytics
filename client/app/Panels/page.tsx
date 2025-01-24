import React from 'react'
import FilterComponent from '@/components/layout/Filter/Filter'
import BarChartComponent from '@/components/Panels/PanelBarChart/BarChart'

const Panels = () => {
  return (
    <>
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 bg-[#f4f4f4] p-2 rounded-lg md:bg-transparent md:p-0 md:rounded-none">
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