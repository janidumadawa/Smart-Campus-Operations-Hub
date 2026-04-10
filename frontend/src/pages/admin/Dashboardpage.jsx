// frontend/src/pages/admin/Dashboardpage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Users
} from 'lucide-react';

import axiosInstance from '../../utils/axiosConfig';

const Dashboardpage = () => {
  const [totalResources, setTotalResources] = useState('...');

  useEffect(() => {
      axiosInstance.get('/resources', { params: { size: 1 } })
        .then(response => {
          const data = response.data;
          if (data && data.totalElements !== undefined) {
            setTotalResources(data.totalElements.toString());
          } else if (data && data.content) {
            setTotalResources(data.content.length.toString());
          }
        })
        .catch(err => console.error('Error fetching resources:', err));
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/resources', { params: { size: 1 } });
      // process response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const stats = [
    { title: 'Total Resources', value: totalResources, icon: Package, color: '#F47C20', change: '+12%' },
    { title: 'Active Bookings', value: '45', icon: Calendar, color: '#0A2342', change: '+8%' },
    { title: 'Pending Bookings', value: '12', icon: Clock, color: '#F47C20', change: '-3%' },
    { title: 'Open Tickets', value: '8', icon: AlertCircle, color: '#0A2342', change: '+2%' },
    { title: 'Resolved Tickets', value: '156', icon: CheckCircle, color: '#F47C20', change: '+24%' },
    { title: 'Active Users', value: '342', icon: Users, color: '#0A2342', change: '+15%' },
  ];

  const recentBookings = [
    { id: 1, resource: 'Lecture Hall A', user: 'John Doe', date: '2024-04-01', time: '10:00-12:00', status: 'Pending' },
    { id: 2, resource: 'Computer Lab B', user: 'Jane Smith', date: '2024-04-01', time: '14:00-16:00', status: 'Approved' },
    { id: 3, resource: 'Meeting Room 1', user: 'Mike Johnson', date: '2024-04-02', time: '09:00-11:00', status: 'Pending' },
    { id: 4, resource: 'Projector', user: 'Sarah Wilson', date: '2024-04-02', time: '13:00-15:00', status: 'Approved' },
  ];

  const recentTickets = [
    { id: 1, title: 'Projector not working', resource: 'Lecture Hall A', priority: 'High', status: 'Open' },
    { id: 2, title: 'AC not cooling', resource: 'Computer Lab B', priority: 'Medium', status: 'In Progress' },
    { id: 3, title: 'Broken chair', resource: 'Meeting Room 1', priority: 'Low', status: 'Open' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2342]">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}10` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <span className="text-sm font-semibold text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0A2342]">{stat.value}</h3>
            <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0A2342]">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-[#F47C20] hover:text-[#E06A10]">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{booking.resource}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{booking.user}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{booking.date}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0A2342]">Recent Tickets</h2>
            <Link to="/admin/tickets" className="text-sm text-[#F47C20] hover:text-[#E06A10]">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Resource: {ticket.resource}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardpage;