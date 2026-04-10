import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Package, Download, FileText, Clock, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';
import { useTickets } from '../tickets/hooks/useTickets';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// PDF Header Template
const addPDFHeader = (doc, title) => {
  const pageWidth = doc.internal.pageSize.width;
  doc.setFillColor(10, 35, 66);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22).setFont('helvetica', 'bold').text('CampusFlow', 15, 20);
  doc.setFontSize(12).setFont('helvetica', 'normal').text('Smart Campus Operations Hub', 15, 28);
  doc.setTextColor(244, 124, 32);
  doc.setFontSize(16).setFont('helvetica', 'bold').text(title, pageWidth - 15, 20, { align: 'right' });
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(9).text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, 28, { align: 'right' });
  return 45;
};

// PDF Footer Template
const addPDFFooter = (doc) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220).line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
    doc.setTextColor(150, 150, 150).setFontSize(9);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
  }
};

// Stats Card Component
const StatCard = ({ icon: Icon, label, value, subtext, color = '#F47C20' }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-[#0A2342]">{value}</p>
    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
  </div>
);

const AdvancedFeatures = () => {
  const [loading, setLoading] = useState(true);
  const [exportType, setExportType] = useState('tickets');
  const [dateRange, setDateRange] = useState('week');
  const [exporting, setExporting] = useState(false);
  
  const [stats, setStats] = useState({ mostUsed: { name: '—', usage: 0 }, avgTime: '—', users: 0, tickets: 0, bookings: 0 });
  const [topResources, setTopResources] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [allData, setAllData] = useState({ resources: [], tickets: [], bookings: [] });

  const { getAllTickets } = useTickets();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resourcesRes, availableRes, tickets, bookingsRes] = await Promise.all([
        axiosInstance.get('/resources', { params: { size: 100 } }),
        axiosInstance.get('/resources/available'),
        getAllTickets(),
        axiosInstance.get('/bookings').catch(() => ({ data: [] }))
      ]);

      const resources = resourcesRes.data?.content || [];
      const bookings = bookingsRes.data || [];
      const ticketsData = tickets || [];

      setAllData({ resources, tickets: ticketsData, bookings });
      setAvailableResources(availableRes.data || []);

      const usage = {};
      [...bookings, ...ticketsData].forEach(item => { if (item.resourceId) usage[item.resourceId] = (usage[item.resourceId] || 0) + 1; });
      
      const sorted = resources.map(r => ({ id: r.id, name: r.name, type: r.type, usage: usage[r.id] || 0 }))
        .sort((a, b) => b.usage - a.usage).slice(0, 5);
      setTopResources(sorted);

      const resolved = ticketsData.filter(t => t.status === 'RESOLVED' && t.resolvedAt);
      let avgHours = '—';
      if (resolved.length) {
        const total = resolved.reduce((sum, t) => sum + (new Date(t.resolvedAt) - new Date(t.createdAt)) / 36e5, 0);
        avgHours = `${(total / resolved.length).toFixed(1)}h`;
      }

      const uniqueUsers = new Set([...ticketsData.map(t => t.reportedByUserId), ...bookings.map(b => b.email)].filter(Boolean));

      setStats({
        mostUsed: sorted[0] || { name: '—', usage: 0 },
        avgTime: avgHours,
        users: uniqueUsers.size,
        tickets: ticketsData.length,
        bookings: bookings.length
      });
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (data, field = 'date') => {
    if (dateRange === 'all') return data;
    const start = new Date();
    if (dateRange === 'today') start.setHours(0, 0, 0, 0);
    else if (dateRange === 'week') start.setDate(start.getDate() - 7);
    else if (dateRange === 'month') start.setMonth(start.getMonth() - 1);
    return data.filter(d => new Date(d[field] || d.createdAt) >= start);
  };

  const generatePDF = (title, tableHeaders, tableData, summary) => {
    const doc = new jsPDF();
    let y = addPDFHeader(doc, title);
    doc.setFontSize(11).setTextColor(80, 80, 80);
    summary.forEach((line, i) => doc.text(line, 15, y + i * 7));
    autoTable(doc, { 
      head: [tableHeaders], 
      body: tableData, 
      startY: y + summary.length * 7 + 5,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [10, 35, 66], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    addPDFFooter(doc);
    doc.save(`${title.toLowerCase().replace(' ', '_')}_${dateRange}.pdf`);
    toast.success(`${title} downloaded!`);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      if (exportType === 'tickets') {
        const filtered = filterByDate(allData.tickets, 'createdAt');
        if (!filtered.length) return toast.error('No tickets found');
        generatePDF('Tickets Report',
          ['ID', 'Title', 'Priority', 'Status', 'Reported By', 'Created'],
          filtered.map(t => [t.id?.slice(-8), t.title?.slice(0, 30), t.priority, t.status, t.reportedByName, t.createdAt?.slice(0, 10)]),
          [`Date Range: ${dateRange} | Total: ${filtered.length}`, `Open: ${filtered.filter(t => t.status === 'OPEN').length} | In Progress: ${filtered.filter(t => t.status === 'IN_PROGRESS').length} | Resolved: ${filtered.filter(t => t.status === 'RESOLVED').length}`]
        );
      } else if (exportType === 'bookings') {
        const filtered = filterByDate(allData.bookings, 'date');
        if (!filtered.length) return toast.error('No bookings found');
        generatePDF('Bookings Report',
          ['Resource', 'User', 'Date', 'Time', 'Attendees', 'Status'],
          filtered.map(b => [b.resourceName, b.requestedBy, b.date, `${b.startTime}-${b.endTime}`, b.attendees, b.status]),
          [`Date Range: ${dateRange} | Total: ${filtered.length}`, `Pending: ${filtered.filter(b => b.status === 'PENDING').length} | Approved: ${filtered.filter(b => b.status === 'APPROVED').length}`]
        );
      } else {
        if (!allData.resources.length) return toast.error('No resources found');
        const available = allData.resources.filter(r => r.status === 'AVAILABLE').length;
        generatePDF('Resources Report',
          ['Name', 'Type', 'Location', 'Capacity', 'Status'],
          allData.resources.map(r => [r.name, r.type, r.location, r.capacity || '—', r.status]),
          [`Total: ${allData.resources.length} | Available: ${available} | Out of Service: ${allData.resources.length - available}`]
        );
      }
    } catch (err) {
      toast.error('PDF generation failed');
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-[#F47C20] border-t-transparent rounded-full animate-spin"></div>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Package} label="Most Used Resource" value={stats.mostUsed.name} subtext={`${stats.mostUsed.usage} total uses`} />
        <StatCard icon={TrendingUp} label="Avg Resolution Time" value={stats.avgTime} />
        <StatCard icon={Users} label="Active Users" value={stats.users} />
        <StatCard icon={FileText} label="Total Records" value={stats.tickets + stats.bookings} subtext={`${stats.tickets} tickets • ${stats.bookings} bookings`} />
      </div>

      {/* Resource Usage Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[#F47C20]" />
          <h2 className="text-lg font-semibold text-[#0A2342]">Resource Usage Analytics</h2>
        </div>
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
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#F47C20] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(item.usage / (topResources[0]?.usage || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Currently Available */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#F47C20]" />
            <h2 className="text-lg font-semibold text-[#0A2342]">Currently Available</h2>
          </div>
          <span className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-600">{availableResources.length} resources available</span>
          </span>
        </div>
        {availableResources.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No resources currently available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableResources.slice(0, 6).map((resource) => (
              <div key={resource.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{resource.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {resource.type === 'EQUIPMENT' ? 'Equipment' : `Capacity: ${resource.capacity || 'N/A'} people`} • {resource.location}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(resource.status)}`}>
                    {resource.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-[#F47C20]" />
          <h2 className="text-lg font-semibold text-[#0A2342]">Export Reports</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">Download detailed reports in PDF format</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={exportType}
              onChange={e => setExportType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] focus:ring-2 focus:ring-orange-100 text-sm bg-white"
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
              onChange={e => setDateRange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] focus:ring-2 focus:ring-orange-100 text-sm bg-white"
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
          disabled={exporting}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors disabled:opacity-50 font-medium"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Generating PDF...' : 'Download PDF Report'}
        </button>
      </div>
    </div>
  );
};

export default AdvancedFeatures;