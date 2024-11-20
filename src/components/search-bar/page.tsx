import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';

interface SearchBarProps {
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchFocused,
  setSearchFocused,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Background glow effect on focus */}
        <div
          className={`absolute inset-0 rounded-2xl transition-all duration-300 
            ${searchFocused 
              ? 'bg-blue-50/50 shadow-lg shadow-blue-100/50' 
              : 'bg-transparent'
            }`}
        />
        
        {/* Main search container */}
        <div className="relative flex items-center">
          {/* Search icon */}
          <div className="absolute left-4 transition-colors duration-200">
            <Search 
              className={`h-4 w-4 ${
                searchFocused 
                  ? 'text-blue-500' 
                  : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
          </div>

          {/* Search input */}
          <Input
                      placeholder="Search anything..."
                      className={`w-full h-12 pl-11 pr-12 rounded-2xl border-2 transition-all duration-200
              ${searchFocused
                              ? 'border-blue-500/50 bg-white'
                              : 'border-gray-100 bg-gray-50 group-hover:border-gray-200 group-hover:bg-gray-50/80'}
              placeholder-gray-400 text-gray-600 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
            `}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)} id={''}          />

          {/* Filter button */}
          <div className="absolute right-3">
            <button 
              className={`p-1.5 rounded-lg transition-colors duration-200
                ${searchFocused
                  ? 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }
              `}
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;