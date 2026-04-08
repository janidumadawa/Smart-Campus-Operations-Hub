// frontend/src/pages/admin/AdvancedFeatures.jsx
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, Download, Calendar, Users, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const AdvancedFeatures = () => {
  const [exportType, setExportType] = useState('bookings');
  const [dateRange, setDateRange] = useState('week');

  const handleExport = () => {
    toast.success(`Exporting ${exportType} report as PDF...`);
  };

  const stats = [
    { label: 'Most Used Resource', value: 'Computer Lab B', usage: '78%', icon: Package },
    { label: 'Peak Booking Hours', value: '10:00 AM - 2:00 PM', icon: Clock },
    { label: 'Avg Resolution Time', value: '4.2 hours', icon: TrendingUp },
    { label: 'Active Users', value: '342', icon: Users },
  ];

  const usageData = [
    { resource: 'Lecture Hall A', usage: 65, bookings: 28 },
    { resource: 'Computer Lab B', usage: 82, bookings: 35 },
    { resource: 'Meeting Room 1', usage: 45, bookings: 19 },
    { resource: 'Projector', usage: 38, bookings: 16 },
    { resource: 'Lecture Hall B', usage: 71, bookings: 31 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2342]">Advanced Features</h1>
        <p className="text-gray-600 mt-1">Analytics, reports, and system insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-[#F47C20]" />
              {stat.usage && <span className="text-sm font-semibold text-green-600">{stat.usage}</span>}
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-lg font-semibold text-[#0A2342]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Resource Usage Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#0A2342] mb-4">Resource Usage Analytics</h2>
        <div className="space-y-4">
          {usageData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.resource}</span>
                <span className="text-sm text-gray-600">{item.usage}% usage ({item.bookings} bookings)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#F47C20] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.usage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Availability */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0A2342]">Real-Time Availability</h2>
          <span className="flex items-center gap-2 text-xs text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Updates
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Lecture Hall A</p>
                <p className="text-xs text-gray-500">Capacity: 120</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available Now</span>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Computer Lab B</p>
                <p className="text-xs text-gray-500">Capacity: 40</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Booked</span>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Meeting Room 1</p>
                <p className="text-xs text-gray-500">Capacity: 15</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available Now</span>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Projector</p>
                <p className="text-xs text-gray-500">Equipment</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Use</span>
            </div>
          </div>
        </div>
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
              <option value="bookings">Bookings Report</option>
              <option value="resources">Resource Usage Report</option>
              <option value="tickets">Ticket Report</option>
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
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default AdvancedFeatures;