import React from 'react'
import { Card } from '@/components/ui/card'

const Loader = () => {
  return (
    <div className="my-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className='text-center md:text-start w-full'>
            <h1 className="text-xl md:text-3xl font-bold text-gray-700">Genetics Analysis</h1>
            <p className="text-sm sm:text-md text-gray-500">Loading data, please wait...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((_, index) => (
            <Card key={index} className="animate-pulse p-6 bg-gray-100 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </Card>
          ))}
        </div>
        <div className="w-full h-[500px] animate-pulse bg-gray-100 rounded-lg mt-6 p-4">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
  )
}

export default Loader