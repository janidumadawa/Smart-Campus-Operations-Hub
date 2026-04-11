import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';

const AdminBookingReview = ({ booking, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await axiosInstance.patch(`/bookings/${booking.id}/review`, {
        status: 'APPROVED',
        adminReason: ''
      });
      toast.success('Booking approved');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.patch(`/bookings/${booking.id}/review`, {
        status: 'REJECTED',
        adminReason: reason
      });
      toast.success('Booking rejected');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#0A2342]">Review Booking</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p><span className="font-medium">Resource:</span> {booking.resourceName}</p>
            <p><span className="font-medium">Requested by:</span> {booking.requestedBy}</p>
            <p><span className="font-medium">Email:</span> {booking.email}</p>
            <p><span className="font-medium">Date:</span> {booking.date}</p>
            <p><span className="font-medium">Time:</span> {booking.startTime} - {booking.endTime}</p>
            <p><span className="font-medium">Attendees:</span> {booking.attendees}</p>
            <p><span className="font-medium">Purpose:</span> {booking.purpose}</p>
          </div>

          {/* Rejection Reason Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              placeholder="Required if rejecting..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingReview;