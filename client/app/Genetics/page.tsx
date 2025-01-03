import React from 'react'
import RadarChartComponent from "./components/RadarChart/RadarChart";
import FilterComponent from "@/components/Filter/page";
import { Card } from "@/components/ui/card";

const Genetics = () => {
  return (
    <div className='my-5'>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
          <h1 className="text-2xl font-bold">Genetics Analysis</h1>
          <p className="text-gray-600">An overview of key metrics and performance.</p>
          </div>
          <div className='flex justify-end w-full sm:w-auto'>
            <FilterComponent/>
          </div>
        </div>

      <Card className="flex flex-col lg:flex-row gap-6 justify-between items-center p-6 mb-5 overflow-hidden">
              {/* Content Section */}
              <div className="chart_content flex flex-col gap-4 lg:w-1/2">
                <h1 className="font-bold text-3xl text-center lg:text-left">
                  Genetic Overview
                </h1>
                <p className="font-medium text-lg text-center lg:text-left">
                  Total Horses: <span className="font-bold">3</span>
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                    <p>Average Inbreeding Coefficient:</p>
                    <span className="font-medium text-gray-400">2.90%</span>
                  </div>
                  <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                    <p>Most Common Sire:</p>
                    <span className="font-medium text-gray-400">
                      Skýr frá Skálakoti
                    </span>
                  </div>
                  <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
                    <p>Most Common Dam:</p>
                    <span className="font-medium text-gray-400">
                      Perla frá Stóra-Hofi
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="flex justify-center lg:w-1/2">
                <RadarChartComponent />
              </div>
      </Card>
    </div>
  )
}

export default Genetics