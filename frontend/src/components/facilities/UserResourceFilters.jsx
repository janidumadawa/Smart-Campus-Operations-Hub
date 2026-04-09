import React from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const UserResourceFilters = ({ 
    searchTerm, 
    setSearchTerm, 
    filterType, 
    setFilterType, 
    filterStatus, 
    setFilterStatus 
}) => {
    
    const hasActiveFilters = searchTerm || filterType || filterStatus;
    
    const clearAllFilters = () => {
        setSearchTerm('');
        setFilterType('');
        setFilterStatus('');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0A2342] to-[#162f4e] px-5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#F47C20]" />
                        <h3 className="font-semibold text-white text-sm">Filter Resources</h3>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="text-xs text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Content */}
            <div className="p-5 space-y-5">
                {/* Search */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Search
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47C20]/20 focus:border-[#F47C20] text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Type Filter - Radio Style */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Resource Type
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="type"
                                value=""
                                checked={filterType === ''}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-4 h-4 text-[#F47C20] focus:ring-[#F47C20] focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-[#0A2342] transition-colors">All Resources</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="type"
                                value="HALL"
                                checked={filterType === 'HALL'}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-4 h-4 text-[#F47C20] focus:ring-[#F47C20] focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-[#0A2342] transition-colors">Lecture Halls</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="type"
                                value="EQUIPMENT"
                                checked={filterType === 'EQUIPMENT'}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-4 h-4 text-[#F47C20] focus:ring-[#F47C20] focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-[#0A2342] transition-colors">Equipment</span>
                        </label>
                    </div>
                </div>

                {/* Availability Filter - Radio Style */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Availability
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="status"
                                value=""
                                checked={filterStatus === ''}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-4 h-4 text-[#F47C20] focus:ring-[#F47C20] focus:ring-offset-0"
                            />
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                <span className="text-sm text-gray-700 group-hover:text-[#0A2342] transition-colors">All Status</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="status"
                                value="AVAILABLE"
                                checked={filterStatus === 'AVAILABLE'}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-4 h-4 text-green-500 focus:ring-green-500 focus:ring-offset-0"
                            />
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-sm text-gray-700 group-hover:text-[#0A2342] transition-colors">Available Only</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="status"
                                value="OUT_OF_SERVICE"
                                checked={filterStatus === 'OUT_OF_SERVICE'}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-4 h-4 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                            />
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                <span className="text-sm text-gray-700 group-hover:text-[#0A2342] transition-colors">Out of Service</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Active Filters:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {searchTerm && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F47C20]/10 text-[#F47C20] text-xs rounded-full">
                                    "{searchTerm}"
                                    <button onClick={() => setSearchTerm('')}>
                                        <X className="w-3 h-3 hover:text-red-500" />
                                    </button>
                                </span>
                            )}
                            {filterType && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F47C20]/10 text-[#F47C20] text-xs rounded-full">
                                    {filterType === 'HALL' ? 'Halls' : 'Equipment'}
                                    <button onClick={() => setFilterType('')}>
                                        <X className="w-3 h-3 hover:text-red-500" />
                                    </button>
                                </span>
                            )}
                            {filterStatus && (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                                    filterStatus === 'AVAILABLE' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {filterStatus === 'AVAILABLE' ? 'Available' : 'Out of Service'}
                                    <button onClick={() => setFilterStatus('')}>
                                        <X className="w-3 h-3 hover:text-red-500" />
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserResourceFilters;