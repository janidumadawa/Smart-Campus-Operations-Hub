import React from 'react';
import { Search, Filter } from 'lucide-react';

const ResourceFilters = ({ searchTerm, setSearchTerm, filterType, setFilterType, filterStatus, setFilterStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#F47C20]" />
        <h3 className="text-lg font-semibold text-[#0A2342]">Filter Resources</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm bg-white"
        >
          <option value="">All Types</option>
          <option value="HALL">Lecture Halls</option>
          <option value="EQUIPMENT">Equipment</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm bg-white"
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
        </select>
      </div>
    </div>
  );
};

export default ResourceFilters;