import React from 'react';
import { SearchIcon } from './IconComponents';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search by skill, designation, or location..."
        onChange={(e) => onSearch(e.target.value)}
        className="block w-full bg-white border border-gray-300 rounded-full py-3 pl-10 pr-3 text-lg text-brand-green placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent transition-shadow shadow-sm"
      />
    </div>
  );
};

export default SearchBar;