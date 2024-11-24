import React from 'react';
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
        {/* Animated background effect */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl blur-sm transition-opacity duration-300
            ${searchFocused ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Main search container */}
        <div className="relative">
          <Input
            placeholder="Search"
            className={`w-full h-12 px-6 rounded-xl transition-all duration-300
              ${
                searchFocused
                  ? 'border-blue-400 bg-white shadow-lg shadow-blue-100/50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
              }
              placeholder-gray-400 text-gray-600 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400
            `}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            id="search"
          />

          {/* Search actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {/* Optional filter button - using text instead of icon */}
            <button
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200
                ${
                  searchFocused
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    : 'text-gray-500 hover:bg-gray-100'
                }
              `}
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;