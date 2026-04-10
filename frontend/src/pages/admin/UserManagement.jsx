import React, { useState, useEffect } from 'react';
import { Search, Shield, Users, Wrench, Mail, Calendar, User, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// PDF Header Template
const addPDFHeader = (doc, title) => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Header background
  doc.setFillColor(10, 35, 66);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Add logo from public folder
  try {
    doc.addImage('/weblogo2.png', 'PNG', 15, 8, 45, 25);
  } catch (error) {
    console.warn('Logo could not be loaded');
  }
  
  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20).setFont('helvetica', 'bold').text('CampusFlow', 68, 20);
  doc.setFontSize(11).setFont('helvetica', 'normal').text('Smart Campus Operations Hub', 68, 26);
  
  // Report Title
  doc.setTextColor(244, 124, 32);
  doc.setFontSize(16).setFont('helvetica', 'bold').text(title, pageWidth - 15, 18, { align: 'right' });
  
  // Generation Date
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(9).text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, 28, { align: 'right' });
  
  return 50;
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

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let allUsers = [];
      try {
        const res = await axiosInstance.get('/auth/users');
        allUsers = res.data || [];
      } catch {
        const techRes = await axiosInstance.get('/auth/technicians');
        const technicians = techRes.data || [];
        const meRes = await axiosInstance.get('/auth/me');
        const currentUser = meRes.data;
        allUsers = [...technicians];
        if (currentUser && !allUsers.find(u => u.id === currentUser.id)) {
          allUsers.push(currentUser);
        }
      }
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (user) => {
    const roles = user.roles || [];
    const roleStr = roles.length > 0 ? roles[0] : user.role || 'USER';
    
    const colors = {
      'ROLE_ADMIN': 'bg-purple-100 text-purple-800',
      'ADMIN': 'bg-purple-100 text-purple-800',
      'ROLE_TECHNICIAN': 'bg-green-100 text-green-800',
      'TECHNICIAN': 'bg-green-100 text-green-800',
      'ROLE_USER': 'bg-blue-100 text-blue-800',
      'USER': 'bg-blue-100 text-blue-800'
    };
    
    const displayRole = roleStr.replace('ROLE_', '');
    return <span className={`px-2 py-1 text-xs rounded-full ${colors[roleStr] || 'bg-gray-100 text-gray-800'}`}>{displayRole}</span>;
  };

  const getUserRole = (user) => {
    const roles = user.roles || [];
    if (roles.includes('ROLE_ADMIN') || user.role === 'ADMIN') return 'ADMIN';
    if (roles.includes('ROLE_TECHNICIAN') || user.role === 'TECHNICIAN') return 'TECHNICIAN';
    return 'USER';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getRoleDisplayName = (user) => {
    const roles = user.roles || [];
    if (roles.includes('ROLE_ADMIN') || user.role === 'ADMIN') return 'Administrator';
    if (roles.includes('ROLE_TECHNICIAN') || user.role === 'TECHNICIAN') return 'Technician';
    return 'Regular User';
  };

  // Export Users as PDF
  const exportUsersPDF = () => {
    if (filteredUsers.length === 0) {
      toast.error('No users to export');
      return;
    }

    setExporting(true);
    try {
      const doc = new jsPDF();
      let y = addPDFHeader(doc, 'Users Report');

      // Summary stats
      const adminCount = users.filter(u => getUserRole(u) === 'ADMIN').length;
      const technicianCount = users.filter(u => getUserRole(u) === 'TECHNICIAN').length;
      const userCount = users.filter(u => getUserRole(u) === 'USER').length;
      const activeCount = users.filter(u => u.enabled !== false).length;

      doc.setFontSize(11).setTextColor(80, 80, 80);
      doc.text(`Total Users: ${users.length} | Administrators: ${adminCount} | Technicians: ${technicianCount} | Regular Users: ${userCount} | Active: ${activeCount}`, 15, y);
      
      // Table data
      const tableData = filteredUsers.map(user => [
        user.name || '—',
        user.email || '—',
        getRoleDisplayName(user),
        user.enabled !== false ? 'Active' : 'Inactive',
        user.provider === 'google' ? 'Google' : 'Email',
        formatDate(user.createdAt)
      ]);

      autoTable(doc, {
        head: [['Name', 'Email', 'Role', 'Status', 'Provider']],
        body: tableData,
        startY: y + 10,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [10, 35, 66], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 55 },
          2: { cellWidth: 30 },
          3: { cellWidth: 22 },
          4: { cellWidth: 22 },
          5: { cellWidth: 30 }
        }
      });

      addPDFFooter(doc);
      doc.save(`users_report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Users report downloaded!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setExporting(false);
    }
  };

  const adminCount = users.filter(u => getUserRole(u) === 'ADMIN').length;
  const technicianCount = users.filter(u => getUserRole(u) === 'TECHNICIAN').length;
  const userCount = users.filter(u => getUserRole(u) === 'USER').length;
  const activeCount = users.filter(u => u.enabled !== false).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-[#F47C20] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2342]">User Management</h1>
          <p className="text-gray-600 mt-1">View registered users and their roles</p>
        </div>
        <button
          onClick={exportUsersPDF}
          disabled={exporting || filteredUsers.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#F47C20]/10 rounded-lg">
              <Users className="w-5 h-5 text-[#F47C20]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{adminCount}</p>
              <p className="text-sm text-gray-600">Administrators</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Wrench className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{technicianCount}</p>
              <p className="text-sm text-gray-600">Technicians</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{userCount}</p>
              <p className="text-sm text-gray-600">Regular Users</p>
              <p className="text-xs text-gray-400 mt-0.5">{activeCount} active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text01t-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F47C20]/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-[#F47C20]">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {user.email || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.enabled !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.enabled !== false ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.provider === 'google' ? 'Google' : 'Email'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;