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
        <Card>
          <div className="flex items-center justify-center h-96">
            <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"></div>
          </div>
        </Card>
      </div>
  )
}

export default Loader