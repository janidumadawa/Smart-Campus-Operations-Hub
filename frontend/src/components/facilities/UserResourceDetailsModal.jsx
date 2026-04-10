import { useState } from 'react';
import React from "react";
import {
  X,
  MapPin,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Info,
  Wifi,
  Monitor,
  Wind,
  Box,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingModal from "../../components/booking/BookingModal";

const UserResourceDetailsModal = ({ isOpen, onClose, resource }) => {
  const [showBookingModal, setShowBookingModal] = useState(false); 

  if (!isOpen || !resource) return null;

  const getStatusColor = (status) => {
    return status === "AVAILABLE"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getTypeIcon = (type) => {
    return type === "EQUIPMENT" ? Box : MapPin;
  };

  const TypeIcon = getTypeIcon(resource.type);

  const imageUrl = resource.imagePublicId
    ? resource.imagePublicId
    : `https://via.placeholder.com/800x400/0A2342/F47C20?text=${encodeURIComponent(resource.name)}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Left Side - Full Image */}
        <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-100">
          <img
            src={imageUrl}
            alt={resource.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/800x400/0A2342/F47C20?text=${encodeURIComponent(resource.name)}`;
            }}
          />

          {/* Status Badge on Image */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded-full border shadow-lg ${getStatusColor(resource.status)}`}
            >
              {resource.status === "AVAILABLE"
                ? "✓ Available for Booking"
                : "✕ Out of Service"}
            </span>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="md:w-1/2 p-6 overflow-y-auto max-h-[90vh]">
          {/* Title Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                {resource.type === "HALL" ? "Lecture Hall" : "Equipment"}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#0A2342] mb-2">
              {resource.name}
            </h2>
            <p className="text-gray-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {resource.location}
            </p>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#F47C20]" />
                <span className="text-sm text-gray-500">Capacity</span>
              </div>
              <p className="text-2xl font-bold text-[#0A2342]">
                {resource.type === "EQUIPMENT" ? "—" : resource.capacity}
              </p>
              {resource.type !== "EQUIPMENT" && (
                <p className="text-xs text-gray-500">people</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#F47C20]" />
                <span className="text-sm text-gray-500">Hours</span>
              </div>
              <p className="text-sm font-semibold text-[#0A2342]">8:00 AM</p>
              <p className="text-sm font-semibold text-[#0A2342]">10:00 PM</p>
            </div>
          </div>

          {/* Resource Information */}
          <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 mb-6">
            <h3 className="text-base font-semibold text-[#0A2342] mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#F47C20]" />
              Resource Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#F47C20]/10 rounded-lg">
                  <TypeIcon className="w-4 h-4 text-[#F47C20]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Type
                  </p>
                  <p className="text-gray-900 font-medium">
                    {resource.type === "HALL" ? "Lecture Hall" : "Equipment"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#F47C20]/10 rounded-lg">
                  <Hash className="w-4 h-4 text-[#F47C20]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Resource ID
                  </p>
                  <p className="text-gray-900 font-mono text-xs">
                    {resource.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features / Amenities */}
          {resource.type !== "EQUIPMENT" && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#0A2342] mb-3">
                Room Features
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Monitor className="w-4 h-4 text-[#F47C20]" />
                  <span>Projector</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Wifi className="w-4 h-4 text-[#F47C20]" />
                  <span>WiFi Access</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Wind className="w-4 h-4 text-[#F47C20]" />
                  <span>Air Conditioned</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-[#F47C20]" />
                  <span>Whiteboard</span>
                </div>
              </div>
            </div>
          )}

          {/* Booking Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-gradient-to-r from-[#0A2342] to-[#162f4e] rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-[#F47C20]" />
                <h3 className="text-lg font-semibold">Ready to Book?</h3>
              </div>

              <p className="text-gray-300 text-sm mb-4">
                Reserve this{" "}
                {resource.type === "HALL" ? "lecture hall" : "equipment"} for
                your next session
              </p>
              <button
                disabled={resource.status !== "AVAILABLE"}
                onClick={() => setShowBookingModal(true)} // CHANGE THIS
                className={`
            w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2
            ${
              resource.status === "AVAILABLE"
                ? "bg-[#F47C20] hover:bg-[#E06A10] text-white"
                : "bg-gray-400 cursor-not-allowed text-white"
            }
          `}
              >
                <Calendar className="w-5 h-5" />
                {resource.status === "AVAILABLE"
                  ? "Book This Resource"
                  : "Currently Unavailable"}
              </button>

              {resource.status === "AVAILABLE" && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  You won't be charged yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
          <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        resource={resource}
      />

    </div>
    
  );
};

export default UserResourceDetailsModal;
