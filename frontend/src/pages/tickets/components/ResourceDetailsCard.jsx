import { useEffect, useState } from "react";
import { useTickets } from "../hooks/useTickets";

/**
 * ResourceDetailsCard Component
 * Displays comprehensive resource information in a ticket context
 *
 * Features:
 * - Fetches and displays resource details by ID
 * - Shows all resource attributes (Name, Type, Capacity, Location, Status)
 * - Loading and error states
 */
export default function ResourceDetailsCard({ resourceId }) {
  const { getResourceById } = useTickets();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resourceId) return;

    const fetchResource = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getResourceById(resourceId);
        if (data) {
          setResource(data);
        } else {
          setError("Resource not found");
        }
      } catch (err) {
        setError("Failed to load resource details");
        console.error("Resource fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [resourceId, getResourceById]);

  if (!resourceId) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-center">
        <div className="w-6 h-6 border-3 border-[#F47C20] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-medium">⚠️ {error}</p>
      </div>
    );
  }

  if (!resource) return null;

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F47C20] to-orange-600 px-6 py-4">
        <h3 className="text-white font-semibold text-lg">Associated Resource</h3>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Resource Details */}
        <div className="space-y-3">
          {/* Name and Type */}
          <div>
            <h4 className="text-lg font-bold text-gray-900">{resource.name}</h4>
            <p className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {resource.type}
            </p>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 font-medium mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(resource.status)}`}
              >
                {resource.status?.replace("_", " ") || "Unknown"}
              </span>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Capacity</p>
              <p className="text-gray-900 font-medium">{resource.capacity} units</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-gray-500 font-medium mb-1">Location</p>
            <p className="text-gray-900">📍 {resource.location}</p>
          </div>
        </div>

        {/* Resource ID Reference */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Resource ID:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded font-mono">
              {resource.id}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}