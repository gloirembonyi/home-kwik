import React, { FC, useState } from 'react';

// Define the props type
interface DropdownProps {
  filters: string[]; // Array of filter strings
  activeFilter: string; // Currently active filter
  setActiveFilter: (filter: string) => void; // Function to set active filter
}

const Dropdown: FC<DropdownProps> = ({ filters, activeFilter, setActiveFilter }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-gray-100 text-sm rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
      >
        {activeFilter}
        <svg
          className={`ml-2 w-5 h-5 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setIsOpen(false);
              }}
              className={`block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 ${
                activeFilter === filter ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
