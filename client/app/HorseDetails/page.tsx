'use client'

import { Suspense, useRef } from 'react';
import React from 'react'
import { useFetch } from '@/hook/useFetch'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line } from 'recharts'
import Navbar from '@/components/layout/Header/Navbar'

type Category = {
  Score: number
  Remarks: string
  Category: string
}

type Assessment = {
  Categories: Category[]
  Assessment_Type: string
}

type Show = {
  show_id: number
  start_date: string
  end_date: string
  show_name: string
  show_score: Assessment[]
}

type Parent = {
  Parent_ID: number
  Parent_FEIF_ID: string
  Relationship_Type: string
}

type HorseData = {
  horse_id: number
  horse_name: string
  feif_id: string
  farm_name: string
  farm_number: string
  parents: Parent[]
  shows: Show[]
}

const HorseDetailsComponenet = () => {
  const query = useSearchParams()
  const id = query.get('query')

  const { data, loading } = useFetch<HorseData>({
    url: `horse_analysis?feif_id=eq.${id}`
  });

  const tabsRef = useRef<HTMLDivElement | null>(null);

  if (loading || !data) {
    return (
      <div className='w-full h-[80vh] flex justify-center items-center '>
        <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"></div>
      </div>
    );
  }
  
  if (!data.length) {
    return (
      <div className='w-full h-[80vh] flex justify-center items-center'>
        <div>
          <h2 className="text-lg font-semibold text-gray-600">No data available for FEIF ID: {id}</h2>
        </div>
      </div>
    );
  }
  
  const horse = data[0];
  const isPartialData = !horse.parents?.length || !horse.shows?.length;
  
  if (isPartialData) {
    return (
      <div className='w-full h-[80vh] flex flex-col justify-center items-center'>
        <h2 className="text-lg font-semibold text-gray-600">
          Partial data available for FEIF ID: {id}
        </h2>
        <p className="text-sm text-gray-500">
          Some details may not be complete. Please try a different FEIF ID for full details.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className='md:bg-[#f4f4f4] md:p-5 md:rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5'>
        <Card className="border border-gray-200">
          <CardHeader className="">
            <CardTitle className="text-2xl font-bold">{horse.horse_name}</CardTitle>
            <CardDescription>
              FEIF ID: {horse.feif_id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Horse Name:</strong> {horse.horse_name}</div>
              <div><strong>FEIF ID:</strong> {horse.feif_id}</div>
              <div><strong>Farm Name:</strong> {horse.farm_name}</div>
              <div><strong>Farm Number:</strong> {horse.farm_number}</div>
            </div>
          </CardContent>
        </Card>
    
        <Card className="border border-gray-200">
          <CardHeader className="">
            <CardTitle className="text-2xl font-bold">Parent Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Relationship</TableHead>
                  <TableHead>FEIF ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {horse.parents.map((parent) => (
                  <TableRow key={parent.Parent_ID}>
                    <TableCell>{parent.Relationship_Type}</TableCell>
                    <TableCell>{parent.Parent_FEIF_ID}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Show Information */}
      <div className='md:bg-[#f4f4f4] md:rounded-xl md:p-5'>
        <CardHeader className='p-0'>
          <CardTitle className="text-2xl font-bold">Shows Information</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <Tabs defaultValue={horse.shows[0]?.show_id.toString()} className="w-full">
            <div
              className="tabs-wrapper sticky top-0 z-50"
              ref={tabsRef}
            >
              <TabsList className="flex flex-wrap gap-5 space-x-2 p-5 h-auto">
                {horse.shows.map((show) => (
                  <TabsTrigger
                    key={show.show_id}
                    value={show.show_id.toString()}
                    className=""
                  >
                    {`${show.show_name.split(' ')[0]} ${show.end_date.split('-')[0]}`}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {horse.shows.map((show) => (
              <TabsContent key={show.show_id} value={show.show_id.toString()} className="space-y-6">
                <Card className='p-5'>
                  <CardTitle className="text-2xl font-bold">Show Name</CardTitle>
                  <div className='mt-5 flex flex-col md:flex-row justify-between md:items-center'>
                    <h3 className="text-lg font-semibold text-center md:text-left">{show.show_name}</h3>
                    <div className='mt-4 md:m-0 flex gap-4 items-center'>
                      <div className=''>
                        <p className='text-sm text-gray-500'>Start Date</p>
                        <p className="text-sm text-gray-700">{show.start_date} </p>
                      </div>
                      <div className=''>
                        <p className='text-sm text-gray-500'>End Date</p>
                        <p className="text-sm text-gray-700">{show.end_date}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Assessments */}
                {show.show_score.map((assessment, index) => (
                  <Card key={index} className="overflow-hidden border border-gray-200">
                    <CardHeader className="">
                      <CardTitle className="text-lg font-semibold">{assessment.Assessment_Type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      
                      {/* Table for Scores */}
                      <Table className="mt-4">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Remarks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assessment.Categories.map((category, id) => (
                            <TableRow key={id}>
                              <TableCell>{category.Category}</TableCell>
                              <TableCell>{category.Score}</TableCell>
                              <TableCell>{category.Remarks || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      {/* Chart for Scores */}
                      <div className="mt-4">
                        {assessment.Assessment_Type === 'Conformation' && (
                          <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={assessment.Categories}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="Category" />
                              <PolarRadiusAxis />
                              <Radar name="Score" dataKey="Score" stroke="#605EA1" fill="#4635B1" fillOpacity={0.6} />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        )}
                        {assessment.Assessment_Type === 'Rideability' && (
                          <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={assessment.Categories}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="Category" />
                              <PolarRadiusAxis />
                              <Radar name="Score" dataKey="Score" stroke="#C4D9FF" fill="#8884d8" fillOpacity={0.6} />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        )}
                        {assessment.Assessment_Type === 'Linear_measurement' && (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={assessment.Categories}>
                              <XAxis dataKey="Category" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="Score" stroke="#074799" fill="#81BFDA" fillOpacity={0.6} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                        {assessment.Assessment_Type === 'Total' && (
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={assessment.Categories}>
                              <XAxis dataKey="Category" />
                              <YAxis domain={[8, 9]}/>
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="Score" stroke="#FF8042" />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </div>
    </>
  )
}

const HorseDetailsPage = () => {
  return (
    <div className="px-4 space-y-6">
      <div>
        <Navbar toggleSidebar={() => {}} />
      </div>
      <Suspense fallback={<div className="text-center mt-10">Loading page...</div>}>
        <HorseDetailsComponenet/>
      </Suspense>
    </div>
  );
};

export default HorseDetailsPage
