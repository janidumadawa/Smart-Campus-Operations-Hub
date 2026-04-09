import React, { useEffect, useState } from 'react';
import UserResourceFilters from './UserResourceFilters';
import UserResourceDetailsModal from './UserResourceDetailsModal';

const ResourcesCard = () => {
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedResource, setSelectedResource] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

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

        if (searchTerm) {
            filtered = filtered.filter(resource =>
                resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType) {
            filtered = filtered.filter(resource => resource.type === filterType);
        }

        if (filterStatus) {
            filtered = filtered.filter(resource => resource.status === filterStatus);
        }

        setFilteredResources(filtered);
    }, [searchTerm, filterType, filterStatus, resources]);

    const handleViewDetails = (resource) => {
        setSelectedResource(resource);
        setShowDetailsModal(true);
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-[#0A2342] text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar - Filters */}
                <div className="lg:w-80 flex-shrink-0">
                    <UserResourceFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                    />
                </div>

                {/* Right Content - Cards Grid */}
                <div className="flex-1">
                    {/* Results Count */}
                    <div className="mb-4 text-sm text-gray-600">
                        Showing <span className="font-semibold text-[#0A2342]">{filteredResources.length}</span> {filteredResources.length === 1 ? 'resource' : 'resources'}
                    </div>

                    {/* Resources Grid */}
                    {filteredResources.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl">
                            <p className="text-gray-500 text-lg">No resources found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredResources.map(resource => (
                                <div 
                    key={resource.id} 
                    className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 flex flex-col"
                >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                        {resource.imagePublicId ? (
                            <img 
                                src={resource.imageUrl || resource.imagePublicId}
                                alt={resource.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                                onError={(e) => {
                                    console.error('Image failed to load:', resource.imagePublicId);
                                    e.target.onerror = null;
                                    e.target.src = '';
                                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A2342]/5 to-[#F47C20]/5"><svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>';
                                }}
                            />
                        ) : (
                            // Fallback placeholder image
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
                                ${resource.status === 'AVAILABLE' || resource.status === 'Available' ? 'bg-green-500 text-white' : ''}
                                ${resource.status === 'IN_USE' || resource.status === 'In Use' ? 'bg-yellow-500 text-white' : ''}
                                ${resource.status === 'OUT_OF_SERVICE' || resource.status === 'Maintenance' ? 'bg-red-500 text-white' : ''}
                                ${!['AVAILABLE', 'Available', 'IN_USE', 'In Use', 'OUT_OF_SERVICE', 'Maintenance'].includes(resource.status) ? 'bg-gray-500 text-white' : ''}
                            `}>
                                {resource.status}
                            </span>
                        </div>
                    </div>
                    
                    {/* Top accent bar */}
                    <div className="h-1 bg-gradient-to-r from-[#0A2342] to-[#F47C20]"></div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                        {/* Title with orange highlight */}
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
                                <span className="text-gray-700">{resource.capacity} people</span>
                            </div>
                        </div>
                        
                        {/* Action button */}
                        <button
                            onClick={() => handleViewDetails(resource)}
                            className="mt-6 w-full bg-[#0A2342] text-white py-3 px-4 rounded-lg hover:bg-[#F47C20] transition-all duration-300 font-bold text-base shadow-md hover:shadow-lg"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Resource Details Modal */}
            <UserResourceDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                resource={selectedResource}
            />
        </>
    );
};

export default ResourcesCard;