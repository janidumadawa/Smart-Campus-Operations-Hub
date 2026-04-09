import React from 'react';
import { X, MapPin, Users, Info, Box, Hash } from 'lucide-react';

const ResourceDetailsModal = ({ isOpen, onClose, resource }) => {
  if (!isOpen || !resource) return null;

  const getStatusColor = (status) => {
    return status === 'AVAILABLE'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getTypeIcon = (type) => {
    return type === 'EQUIPMENT' ? Box : MapPin;
  };

  const TypeIcon = getTypeIcon(resource.type);

  const imageUrl = resource.imagePublicId 
    ? resource.imagePublicId
    : `https://via.placeholder.com/800x400/0A2342/F47C20?text=${encodeURIComponent(resource.name)}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Full Image */}
        <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-100 mt-4 mb-4 ml-4 mr-4">
          <img
            src={imageUrl}
            alt={resource.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Right Side - Details */}
        <div className="md:w-1/2 p-6 overflow-y-auto max-h-[90vh]">

          {/* Title Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(resource.status)}`}>
                {resource.status === 'AVAILABLE' ? 'Available' : 'Out of Service'}
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                {resource.type}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#0A2342]">{resource.name}</h2>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Main Information */}
            <div className="space-y-6">
              {/* Resource Details Card */}
              <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-100">
                <h3 className="text-base font-semibold text-[#0A2342] mb-5 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#F47C20]" />
                  Resource Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Type */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#F47C20]/10 rounded-lg">
                      <TypeIcon className="w-4 h-4 text-[#F47C20]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Type</p>
                      <p className="text-gray-900 font-medium">{resource.type}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#F47C20]/10 rounded-lg">
                      <MapPin className="w-4 h-4 text-[#F47C20]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {resource.type === 'EQUIPMENT' ? 'Storage' : 'Location'}
                      </p>
                      <p className="text-gray-900 font-medium">{resource.location}</p>
                    </div>
                  </div>

                  {/* Capacity - Conditional */}
                  {resource.type !== 'EQUIPMENT' && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#F47C20]/10 rounded-lg">
                        <Users className="w-4 h-4 text-[#F47C20]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Capacity</p>
                        <p className="text-gray-900 font-medium">{resource.capacity} people</p>
                      </div>
                    </div>
                  )}

                  {/* Resource ID */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#F47C20]/10 rounded-lg">
                      <Hash className="w-4 h-4 text-[#F47C20]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Resource ID</p>
                      <p className="text-gray-900 font-mono text-xs">{resource.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsModal;