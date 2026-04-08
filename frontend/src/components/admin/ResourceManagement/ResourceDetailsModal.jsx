import React from 'react';
import { X, MapPin, Users, Calendar, Wrench, Info, Box, Clock, Hash } from 'lucide-react';

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
    ? `https://via.placeholder.com/800x400/0A2342/F47C20?text=${encodeURIComponent(resource.name)}`
    : `https://via.placeholder.com/800x400/0A2342/F47C20?text=${encodeURIComponent(resource.name)}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Image */}
        <div className="relative h-56 bg-gradient-to-r from-[#0A2342] to-[#1a3a5c]">
          <img
            src={imageUrl}
            alt={resource.name}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(resource.status)}`}>
                {resource.status === 'AVAILABLE' ? 'Available' : 'Out of Service'}
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/30">
                {resource.type}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white">{resource.name}</h2>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Information - Left Column (Spans 2 cols on large screens) */}
            <div className="lg:col-span-2 space-y-6">
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

            {/* Right Column - Stats & Actions */}
            <div className="space-y-5">
              {/* Quick Stats Card */}
              <div className="bg-gradient-to-br from-[#0A2342] to-[#162f4e] rounded-xl p-5 text-white shadow-lg">
                <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">Quick Stats</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-[#F47C20]">24</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">This Month</p>
                    <p className="text-3xl font-bold text-[#F47C20]">8</p>
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