'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';

const SearchPage = () => {

   const searchQuery =  useSearchParams()
   const query = searchQuery.get('query')


  return (
    <div>
        Query : {query}
    </div>
  )
}


const Search = () => {
  return (
    <div className="p-4 space-y-6">
      <Suspense fallback={<div className="text-center mt-10">Loading page...</div>}>
        <SearchPage/>
      </Suspense>
    </div>
  );
};

export default Search