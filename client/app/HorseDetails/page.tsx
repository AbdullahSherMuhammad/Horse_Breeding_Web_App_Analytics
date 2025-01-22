'use client'

import { Suspense } from 'react';
import React from 'react'
import { useFetch } from '@/hook/useFetch'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  const id = query.get('id')

  const { data, loading } = useFetch<HorseData>(`horse_analysis?horse_id=eq.${id}`);

  if (loading || !data?.length) {
    return  (
      <div className='w-screen h-screen flex justify-center items-center '>
          <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"></div>
      </div>
    )
  }

  const horse = data[0]

  return (
    <>
      {/* Horse Information */}
      <div className='md:bg-[#f4f4f4] md:p-5 md:rounded-xl'>
      <Card className="border border-gray-200">
        <CardHeader className="">
          <CardTitle className="text-2xl font-bold">Horse Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Name:</strong> {horse.horse_name}</div>
            <div><strong>FEIF ID:</strong> {horse.feif_id}</div>
            <div><strong>Farm Name:</strong> {horse.farm_name}</div>
            <div><strong>Farm Number:</strong> {horse.farm_number}</div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Parent Information */}
      <div className='md:bg-[#f4f4f4] md:p-5 md:rounded-xl'>
      <Card className="border border-gray-200">
        <CardHeader className="">
          <CardTitle className="text-2xl font-bold">Parent Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent ID</TableHead>
                <TableHead>FEIF ID</TableHead>
                <TableHead>Relationship</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horse.parents.map((parent) => (
                <TableRow key={parent.Parent_ID}>
                  <TableCell>{parent.Parent_ID}</TableCell>
                  <TableCell>{parent.Parent_FEIF_ID}</TableCell>
                  <TableCell>{parent.Relationship_Type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>

      {/* Show Information */}
      <div className='md:bg-[#f4f4f4] md:rounded-xl'>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Show Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={horse.shows[0]?.show_id.toString()} className="w-full">
            <TabsList className="flex flex-wrap  gap-5 space-x-2 p-5 h-auto">
              {horse.shows.map((show) => (
                <TabsTrigger
                  key={show.show_id}
                  value={show.show_id.toString()}
                  className="p-2 text-sm font-medium min-w-[150px] h-[45px] bg-[#242323] text-white shadow rounded"
                >
                  {`${show.show_name.split(' ')[0]} ${show.end_date.split('-')[0]}`}
                </TabsTrigger>
              ))}
            </TabsList>
            {horse.shows.map((show) => (
              <TabsContent key={show.show_id} value={show.show_id.toString()} className="pt-4 space-y-6">
                <h3 className="text-lg font-semibold">{show.show_name}</h3>
                <p className="text-sm text-gray-500">
                  {show.start_date} - {show.end_date}
                </p>

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
    <div className="p-4 space-y-6">
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
