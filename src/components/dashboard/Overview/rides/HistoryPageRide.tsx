import { Filter, Menu, PlusCircle, Search, UploadIcon } from 'lucide-react'
import React, { useState } from 'react'

const HistoryPageRide = () => { 
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className='w-full p-4 border rounded-xl'>

    <div className="  p-4 md:p-6 mb-6">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex justify-end mb-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search Ridess by driver, date or rider"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent pl-12 pr-4 py-3 border border-gray-300 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Search className="absolute left-4 top-4 text-gray-400" />
            </div>
             {/* Add New User Button */}
        <button
          
          className="bg-blue-900 text-white px-6 py-3 rounded-lg 
            flex items-center space-x-3 hover:bg-blue-700 transition 
            shadow-md hover:shadow-lg"
        >
          <UploadIcon className="w-6 h-6" />
          <span className="font-semibold text-sm">Export rides</span>
        </button>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-gray-100 text-gray-700 px-5 py-3 
                  rounded-lg flex items-center space-x-2 hover:bg-gray-200"
            >
              <Filter className="w-6 h-6" />
              <span>Filters</span>
            </button>
          </div>
          </div>
    </div>
  )
}

export default HistoryPageRide