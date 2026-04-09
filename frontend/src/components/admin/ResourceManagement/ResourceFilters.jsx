import React from 'react';
import { Search } from 'lucide-react';

const ResourceFilters = ({ searchTerm, setSearchTerm, filterType, setFilterType, filterStatus, setFilterStatus, setCurrentPage }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(0);
          }}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm bg-white"
        >
          <option value="">All Types</option>
          <option value="HALL">Halls</option>
          <option value="EQUIPMENT">Equipment</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(0);
          }}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm bg-white"
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