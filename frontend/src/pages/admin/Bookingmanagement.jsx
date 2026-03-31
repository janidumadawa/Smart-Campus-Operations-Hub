// frontend/src/pages/admin/Bookingmanagement.jsx
import React, { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Bookingmanagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [bookings, setBookings] = useState([
    { id: 1, resource: 'Lecture Hall A', user: 'John Doe', date: '2024-04-01', time: '10:00-12:00', attendees: 45, purpose: 'CS Lecture', status: 'PENDING' },
    { id: 2, resource: 'Computer Lab B', user: 'Jane Smith', date: '2024-04-01', time: '14:00-16:00', attendees: 30, purpose: 'Programming Lab', status: 'APPROVED' },
    { id: 3, resource: 'Meeting Room 1', user: 'Mike Johnson', date: '2024-04-02', time: '09:00-11:00', attendees: 8, purpose: 'Team Meeting', status: 'PENDING' },
    { id: 4, resource: 'Projector', user: 'Sarah Wilson', date: '2024-04-02', time: '13:00-15:00', attendees: 1, purpose: 'Presentation', status: 'APPROVED' },
    { id: 5, resource: 'Lecture Hall B', user: 'Tom Brown', date: '2024-04-03', time: '11:00-13:00', attendees: 60, purpose: 'Physics Lecture', status: 'REJECTED' },
  ]);

  const handleApprove = (id) => {
    setBookings(bookings.map(booking =>
      booking.id === id ? { ...booking, status: 'APPROVED' } : booking
    ));
    toast.success('Booking approved');
  };

  const handleReject = (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setBookings(bookings.map(booking =>
        booking.id === id ? { ...booking, status: 'REJECTED' } : booking
      ));
      toast.success('Booking rejected');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>;
      case 'PENDING':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2342]">Booking Management</h1>
        <p className="text-gray-600 mt-1">Manage and approve resource bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by resource or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.resource}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.time}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.attendees}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{booking.purpose}</td>
                  <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                  <td className="px-6 py-4">
                    {booking.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="p-1 hover:bg-green-50 rounded transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="p-1 hover:bg-red-50 rounded transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                    {booking.status !== 'PENDING' && (
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookingmanagement;