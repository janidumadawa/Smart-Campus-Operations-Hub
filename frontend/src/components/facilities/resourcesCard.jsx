import React, { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const ResourcesCard = () => {
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/resources?size=100')
            .then(res => res.json())
            .then(data => {
                setResources(data.content || []);
                setFilteredResources(data.content || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...resources];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(resource =>
                resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by type
        if (filterType) {
            filtered = filtered.filter(resource => resource.type === filterType);
        }

        // Filter by status
        if (filterStatus) {
            filtered = filtered.filter(resource => resource.status === filterStatus);
        }

        setFilteredResources(filtered);
    }, [searchTerm, filterType, filterStatus, resources]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('');
        setFilterStatus('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-[#0A2342] text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-[#F47C20]" />
                        <h3 className="text-lg font-semibold text-[#0A2342]">Filter Resources</h3>
                    </div>
                    {(searchTerm || filterType || filterStatus) && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-[#F47C20] hover:text-[#E06A10] flex items-center gap-1"
                        >
                            <X className="w-4 h-4" />
                            Clear Filters
                        </button>
                    )}
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

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
            </div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No resources found matching your filters.</p>
                    {(searchTerm || filterType || filterStatus) && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-[#F47C20] hover:text-[#E06A10] font-medium"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.map(resource => (
                        <div 
                            key={resource.id} 
                            className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 flex flex-col"
                        >
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                {resource.imagePublicId ? (
                                    <img 
                                        src={resource.imagePublicId}
                                        alt={resource.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://via.placeholder.com/400x300/0A2342/F47C20?text=${encodeURIComponent(resource.name)}`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A2342]/5 to-[#F47C20]/5">
                                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                )}
                                
                                {/* Status Badge Overlay */}
                                <div className="absolute top-3 right-3">
                                    <span className={`
                                        px-2 py-1 rounded-full text-xs font-medium shadow-lg
                                        ${resource.status === 'AVAILABLE' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                                    `}>
                                        {resource.status === 'AVAILABLE' ? 'Available' : 'Out of Service'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Top accent bar */}
                            <div className="h-1 bg-gradient-to-r from-[#0A2342] to-[#F47C20]"></div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                {/* Title */}
                                <h2 className="text-2xl font-bold mb-4 text-[#0A2342]">
                                    {resource.name}
                                </h2>
                                
                                {/* Details grid */}
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-start">
                                        <span className="text-sm font-semibold text-[#F47C20] w-24">Type:</span>
                                        <span className="text-gray-700">{resource.type}</span>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <span className="text-sm font-semibold text-[#F47C20] w-24">Location:</span>
                                        <span className="text-gray-700">{resource.location}</span>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <span className="text-sm font-semibold text-[#F47C20] w-24">Capacity:</span>
                                        <span className="text-gray-700">
                                            {resource.type === 'EQUIPMENT' ? '—' : `${resource.capacity} people`}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Action button */}
                                <button className="mt-6 w-full bg-[#0A2342] text-white py-2.5 px-4 rounded-lg hover:bg-[#F47C20] transition-all duration-300 font-medium">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourcesCard;