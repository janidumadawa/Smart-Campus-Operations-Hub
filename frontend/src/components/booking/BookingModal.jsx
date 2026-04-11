import React, { useState } from "react";
import { X, Calendar, Clock, Users, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosConfig";
import toast from "react-hot-toast";

const BookingModal = ({ isOpen, onClose, resource, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to book a resource");
      onClose();
      return;
    }

    const { date, startTime, endTime, purpose, attendees } = formData;
    if (!date || !startTime || !endTime || !purpose || !attendees) {
      toast.error("Please fill all fields");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        resourceId: resource.id,
        date,
        startTime,
        endTime,
        purpose,
        attendees: parseInt(attendees),
        requestedBy: user.name || "User",
        email: user.email,
      };

      await axiosInstance.post("/bookings", bookingData);
      toast.success("Booking request submitted!");
      setFormData({ date: "", startTime: "", endTime: "", purpose: "", attendees: "" });
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create booking";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#0A2342]">Book Resource</h2>
            <p className="text-sm text-gray-500">{resource.name}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Pre-selected Resource (readonly) */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Resource</label>
              <input
                type="text"
                value={`${resource.name} (${resource.type})`}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700"
              />
            </div>

            {/* Capacity Info */}
            {resource.type !== "EQUIPMENT" && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
                <Users className="h-4 w-4" />
                <span>Capacity: {resource.capacity} people</span>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                  required
                />
              </div>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Purpose</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter booking purpose"
                  className="w-full resize-none rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                  required
                />
              </div>
            </div>

            {/* Attendees */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Attendees</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleChange}
                  min="1"
                  max={resource.type !== "EQUIPMENT" ? resource.capacity : undefined}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#F47C20] py-3 font-bold text-white hover:bg-[#db6d16] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;