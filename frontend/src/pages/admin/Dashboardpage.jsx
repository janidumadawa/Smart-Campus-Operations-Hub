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
import { useTickets } from '../tickets/hooks/useTickets';

const Dashboardpage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResources: 0,
    activeBookings: 0,
    pendingBookings: 0,
    openTickets: 0,
    resolvedTickets: 0,
    activeUsers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);

  const { getAllTickets } = useTickets();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch resources count
      const resourcesRes = await axiosInstance.get('/resources', { params: { size: 1 } });
      const totalResources = resourcesRes.data?.totalElements || 0;

      // Fetch all bookings
      const bookingsRes = await axiosInstance.get('/bookings');
      const bookings = bookingsRes.data || [];
      const activeBookings = bookings.filter(b => b.status === 'APPROVED').length;
      const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;

      // Fetch all tickets
      const tickets = await getAllTickets() || [];
      const openTickets = tickets.filter(t => t.status === 'OPEN').length;
      const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length;

      // Fetch users count (using technicians endpoint as proxy)
      let activeUsers = 0;
      try {
        const usersRes = await axiosInstance.get('/auth/technicians');
        activeUsers = usersRes.data?.length || 0;
      } catch {
        // Fallback: count unique users from tickets
        const uniqueUsers = new Set(tickets.map(t => t.reportedByUserId).filter(Boolean));
        activeUsers = uniqueUsers.size;
      }

      setStats({
        totalResources,
        activeBookings,
        pendingBookings,
        openTickets,
        resolvedTickets,
        activeUsers
      });

      // Recent bookings (last 5)
      const sortedBookings = [...bookings]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentBookings(sortedBookings);

      // Recent tickets (last 5)
      const sortedTickets = [...tickets]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentTickets(sortedTickets);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Resources', value: stats.totalResources, icon: Package, color: '#F47C20' },
    { title: 'Active Bookings', value: stats.activeBookings, icon: Calendar, color: '#0A2342' },
    { title: 'Pending Bookings', value: stats.pendingBookings, icon: Clock, color: '#F47C20' },
    { title: 'Open Tickets', value: stats.openTickets, icon: AlertCircle, color: '#0A2342' },
    { title: 'Resolved Tickets', value: stats.resolvedTickets, icon: CheckCircle, color: '#F47C20' },
    { title: 'Active Managememnt Users', value: stats.activeUsers, icon: Users, color: '#0A2342' },
  ];

  const getBookingStatusBadge = (status) => {
    const styles = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getTicketPriorityBadge = (priority) => {
    const styles = {
      'CRITICAL': 'bg-purple-100 text-purple-800',
      'HIGH': 'bg-red-100 text-red-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800'
    };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  const getTicketStatusBadge = (status) => {
    const styles = {
      'OPEN': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-[#F47C20] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2342]">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}10` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
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
            {recentBookings.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No recent bookings</p>
            ) : (
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
                      <td className="px-6 py-3 text-sm text-gray-900">{booking.resourceName}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{booking.requestedBy}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{booking.date}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getBookingStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0A2342]">Recent Tickets</h2>
            <Link to="/admin/tickets" className="text-sm text-[#F47C20] hover:text-[#E06A10]">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTickets.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No recent tickets</p>
            ) : (
              recentTickets.map((ticket) => (
                <div key={ticket.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate pr-2">{ticket.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTicketPriorityBadge(ticket.priority)}`}>
                      {ticket.priority || '—'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Resource: {ticket.location || ticket.resourceId || '—'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTicketStatusBadge(ticket.status)}`}>
                      {ticket.status?.replace('_', ' ') || '—'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {ticket.createdAt?.slice(0, 10) || ''}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardpage;