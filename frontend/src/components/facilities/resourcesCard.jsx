import React, { useEffect, useState } from 'react';

const ResourcesCard = () => {
    const cloudName = 'smart-campus-hub'; // Cloudinary cloud name
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/resources')
            .then(res => res.json())
            .then(data => {
                setResources(data.content || []); // because it's a Page
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Helper function to get Cloudinary image URL with optimizations
    const getCloudinaryImage = (imagePublicId, options = {}) => {
        if (!imagePublicId) return null;
        
        const cloudName = 'smart-campus-hub'; // Replace with your Cloudinary cloud name
        const transformations = {
            width: options.width || 400,
            height: options.height || 300,
            crop: options.crop || 'fill',
            quality: options.quality || 'auto',
            format: 'auto'
        };
        
        return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.crop}/w_${transformations.width},h_${transformations.height},q_${transformations.quality},f_${transformations.format}/${imagePublicId}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-[#0A2342] text-xl">Loading...</div>
            </div>
        );
    }

    if (resources.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No resources found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map(resource => (
                <div 
                    key={resource.id} 
                    className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 flex flex-col"
                >
                    {/* Image Section with Cloudinary */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                        {resource.imagePublicId ? (
                            <img 
                                src={getCloudinaryImage(resource.imagePublicId, { width: 500, height: 300 })}
                                alt={resource.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
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
                                ${resource.status === 'Available' ? 'bg-green-500 text-white' : ''}
                                ${resource.status === 'In Use' ? 'bg-yellow-500 text-white' : ''}
                                ${resource.status === 'Maintenance' ? 'bg-red-500 text-white' : ''}
                                ${!['Available', 'In Use', 'Maintenance'].includes(resource.status) ? 'bg-gray-500 text-white' : ''}
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
                        <button className="mt-6 w-full bg-[#0A2342] text-white py-2.5 px-4 rounded-lg hover:bg-[#F47C20] transition-all duration-300 font-medium">
                            View Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResourcesCard;