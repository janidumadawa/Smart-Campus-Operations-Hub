import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Users, Package, Download, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';
import { useTickets } from '../tickets/hooks/useTickets';

const AdvancedFeatures = () => {
  const [loading, setLoading] = useState(true);
  const [exportType, setExportType] = useState('tickets');
  const [dateRange, setDateRange] = useState('week');
  
  const [stats, setStats] = useState({
    mostUsedResource: { name: '—', usage: 0 },
    avgResolutionTime: '—',
    activeUsers: 0,
    totalTickets: 0,
    totalBookings: 0
  });

  const [topResources, setTopResources] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);

  const { getAllTickets } = useTickets();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch resources
      const resourcesRes = await axiosInstance.get('/resources', { params: { size: 100 } });
      const resources = resourcesRes.data?.content || [];

      // Fetch available resources
      const availableRes = await axiosInstance.get('/resources/available');
      setAvailableResources(availableRes.data || []);

      // Fetch tickets
      const tickets = await getAllTickets() || [];

      // Fetch bookings
      let bookings = [];
      try {
        const bookingsRes = await axiosInstance.get('/bookings');
        bookings = bookingsRes.data || [];
      } catch (err) {
        console.log('Bookings not available yet');
      }

      // Calculate most used resource (from bookings and tickets)
      const resourceUsage = {};
      
      // Count from bookings
      bookings.forEach(b => {
        if (b.resourceId) {
          resourceUsage[b.resourceId] = (resourceUsage[b.resourceId] || 0) + 1;
        }
      });
      
      // Count from tickets
      tickets.forEach(t => {
        if (t.resourceId) {
          resourceUsage[t.resourceId] = (resourceUsage[t.resourceId] || 0) + 1;
        }
      });

      // Sort resources by usage
      const sortedResources = resources
        .map(r => ({
          id: r.id,
          name: r.name,
          type: r.type,
          usage: resourceUsage[r.id] || 0
        }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5);

      setTopResources(sortedResources);

      const mostUsed = sortedResources[0] || { name: '—', usage: 0 };

      // Calculate average resolution time
      const resolvedTickets = tickets.filter(t => 
        t.status === 'RESOLVED' && t.createdAt && t.resolvedAt
      );
      
      let avgHours = '—';
      if (resolvedTickets.length > 0) {
        let totalHours = 0;
        resolvedTickets.forEach(t => {
          const created = new Date(t.createdAt);
          const resolved = new Date(t.resolvedAt);
          totalHours += (resolved - created) / (1000 * 60 * 60);
        });
        avgHours = `${(totalHours / resolvedTickets.length).toFixed(1)} hours`;
      }

      // Count unique users
      const uniqueUsers = new Set([
        ...tickets.map(t => t.reportedByUserId).filter(Boolean),
        ...bookings.map(b => b.email).filter(Boolean)
      ]);

      setStats({
        mostUsedResource: mostUsed,
        avgResolutionTime: avgHours,
        activeUsers: uniqueUsers.size,
        totalTickets: tickets.length,
        totalBookings: bookings.length
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success(`Exporting ${exportType} report as CSV...`);
    // Export functionality can be added later
  };

  const maxUsage = Math.max(...topResources.map(r => r.usage), 1);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-[#F47C20] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2342]">Advanced Features</h1>
        <p className="text-gray-600 mt-1">Analytics, reports, and system insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <Package className="w-5 h-5 text-[#F47C20]" />
            <span className="text-sm font-semibold text-green-600">{stats.mostUsedResource.usage} uses</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Most Used Resource</p>
          <p className="text-lg font-semibold text-[#0A2342] truncate">{stats.mostUsedResource.name}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-5 h-5 text-[#F47C20]" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Resolution Time</p>
          <p className="text-lg font-semibold text-[#0A2342]">{stats.avgResolutionTime}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-5 h-5 text-[#F47C20]" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Users</p>
          <p className="text-lg font-semibold text-[#0A2342]">{stats.activeUsers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-5 h-5 text-[#F47C20]" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Activity</p>
          <p className="text-lg font-semibold text-[#0A2342]">{stats.totalTickets + stats.totalBookings}</p>
          <p className="text-xs text-gray-500">{stats.totalTickets} tickets • {stats.totalBookings} bookings</p>
        </div>
      </div>

      {/* Resource Usage Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#0A2342] mb-4">Resource Usage Analytics</h2>
        {topResources.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No usage data available yet</p>
        ) : (
          <div className="space-y-4">
            {topResources.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                    <span className="ml-2 text-xs text-gray-400">({item.type})</span>
                  </span>
                  <span className="text-sm text-gray-600">{item.usage} uses</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#F47C20] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${maxUsage > 0 ? (item.usage / maxUsage) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Resources */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0A2342]">Currently Available</h2>
          <span className="flex items-center gap-2 text-xs text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {availableResources.length} available
          </span>
        </div>
        {availableResources.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No resources currently available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableResources.slice(0, 4).map((resource) => (
              <div key={resource.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{resource.name}</p>
                    <p className="text-xs text-gray-500">
                      {resource.type === 'EQUIPMENT' ? 'Equipment' : `Capacity: ${resource.capacity || 'N/A'}`}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Available
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-[#0A2342] mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
            >
              <option value="tickets">Tickets Report</option>
              <option value="bookings">Bookings Report</option>
              <option value="resources">Resources Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export as CSV
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">
          PDF export coming soon
        </p>
      </div>
    </div>
  );
};

export default AdvancedFeatures;