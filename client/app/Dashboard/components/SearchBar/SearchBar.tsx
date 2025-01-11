import { CiSearch } from "react-icons/ci";


const SearchBar = () => {


  return (
    <div className={`flex justify-end w-full lg:w-[350px] h-10 rounded-full overflow-hidden border border-[#1a1a1a] transition-width duration-300`}>
        <input 
          className={`w-full 
          h-full px-3 border-0 outline-none text-gray-800`} 
          type="text" 
          placeholder='Type Horse Name or FEIF ID'
         />
        <button 
          className='bg-[#1a1a1a] text-white flex items-center justify-center w-10 h-full text-2xl'
        >
            <CiSearch/>
        </button>
    </div>
  )
}

export default SearchBar