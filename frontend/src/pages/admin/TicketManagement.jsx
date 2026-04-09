// frontend/src/pages/admin/TicketManagement.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Search, Clock, CheckCircle, AlertCircle, MessageSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTickets } from '../tickets/hooks/useTickets';
import CommentSection from '../tickets/components/CommentSection';

// TODO: Replace with real authentication system
const ADMIN_USER = { id: 'admin-001', name: 'Admin User', role: 'ADMIN' };
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

const TicketManagement = () => {
  const { getAdminTickets, updateStatus, assignTechnician, loading, error } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [tickets, setTickets] = useState([]);
  const [techId, setTechId] = useState('');
  const [techName, setTechName] = useState('');
  const [draftStatus, setDraftStatus] = useState('');
  const [activeImg, setActiveImg] = useState(null);

  const loadTickets = async () => {
    const params = {};
    if (filterStatus !== 'all') params.status = filterStatus;
    const data = await getAdminTickets(params);
    if (Array.isArray(data)) setTickets(data);
  };

  useEffect(() => {
    loadTickets();
  }, [filterStatus]);

  useEffect(() => {
    setDraftStatus(selectedTicket?.status || '');
  }, [selectedTicket]);

  const filteredTickets = useMemo(() => (
    tickets.filter((ticket) => {
      const title = (ticket.title || '').toLowerCase();
      const location = (ticket.location || '').toLowerCase();
      const resource = (ticket.resourceId || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return title.includes(term) || location.includes(term) || resource.includes(term);
    })
  ), [tickets, searchTerm]);

  const handleAssign = async () => {
    if (!selectedTicket || !techId || !techName) return;
    const updated = await assignTechnician(selectedTicket.id, {
      technicianId: techId,
      technicianName: techName,
    });
    if (updated) {
      toast.success(`Ticket assigned to ${techName}`);
      setSelectedTicket(updated);
      setTechId('');
      setTechName('');
      await loadTickets();
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedTicket) return;

    const body = { status: newStatus };
    if (newStatus === 'REJECTED') body.rejectionReason = noteText;
    if (newStatus === 'RESOLVED') body.resolutionNotes = noteText;

    const updated = await updateStatus(selectedTicket.id, body);
    if (updated) {
      toast.success(`Status updated to ${newStatus}`);
      setSelectedTicket(updated);
      setNoteText('');
      await loadTickets();
    }
  };

  const handleTicketCommentsUpdate = (updatedTicket) => {
    setSelectedTicket(updatedTicket);
    setTickets((prev) => prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
  };

  const handleSaveChanges = async () => {
    if (!selectedTicket) return;

    let updatedTicket = selectedTicket;
    let didChange = false;

    if (techId && techName) {
      const assigned = await assignTechnician(updatedTicket.id, {
        technicianId: techId,
        technicianName: techName,
      });
      if (assigned) {
        updatedTicket = assigned;
        didChange = true;
        setTechId('');
        setTechName('');
      }
    }

    let targetStatus = draftStatus || updatedTicket.status;
    if (targetStatus === 'OPEN' && updatedTicket.status === 'IN_PROGRESS') {
      targetStatus = 'IN_PROGRESS';
      setDraftStatus('IN_PROGRESS');
    }

    if (targetStatus !== updatedTicket.status) {
      const body = { status: targetStatus };
      if (targetStatus === 'REJECTED') body.rejectionReason = noteText;
      if (targetStatus === 'RESOLVED') body.resolutionNotes = noteText;

      const statusUpdated = await updateStatus(updatedTicket.id, body);
      if (statusUpdated) {
        updatedTicket = statusUpdated;
        didChange = true;
        setNoteText('');
      } else {
        return;
      }
    }

    if (didChange) {
      toast.success('Ticket changes saved');
      setSelectedTicket(updatedTicket);
      setTickets((prev) => prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
      await loadTickets();
    } else {
      toast('No changes to save');
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      'OPEN': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800'
    };
    return <span className={`px-2 py-1 text-xs rounded-full ${statuses[status]}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorities = {
      'HIGH': 'bg-red-100 text-red-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800',
      'CRITICAL': 'bg-purple-100 text-purple-800',
    };
    return <span className={`px-2 py-1 text-xs rounded-full ${priorities[priority] || 'bg-gray-100 text-gray-700'}`}>{priority}</span>;
  };

  const getAttachmentSrc = (url) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const normalized = url.startsWith('/') ? url : `/${url}`;
    return `${API_ORIGIN}${normalized}`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A2342]">Ticket Management</h1>
        <p className="text-gray-600 mt-1">Manage and track incident tickets</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{tickets.filter(t => t.status === 'OPEN').length}</p>
              <p className="text-sm text-gray-600">Open Tickets</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{tickets.filter(t => t.status === 'IN_PROGRESS').length}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{tickets.filter(t => t.status === 'RESOLVED').length}</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{tickets.length}</p>
              <p className="text-sm text-gray-600">Total Tickets</p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {error && <p className="px-6 py-3 text-sm text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">#{ticket.id?.slice(-6)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.resourceId || ticket.location || '-'}</td>
                  <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                  <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.assignedTechnicianName || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.createdAt?.slice(0, 10) || '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Management Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-[#0A2342]">Ticket #{selectedTicket.id?.slice(-6)}</h2>
              <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Ticket Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{selectedTicket.title}</h3>
                <p className="text-gray-600 text-sm">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Resource</label>
                  <p className="text-sm font-medium text-gray-900">{selectedTicket.resourceId || selectedTicket.location || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Category</label>
                  <p className="text-sm font-medium text-gray-900">{selectedTicket.category}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Priority</label>
                  <div>{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Status</label>
                  <select
                    value={draftStatus}
                    onChange={(e) => setDraftStatus(e.target.value)}
                    className="mt-1 px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F47C20]"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Assign Technician */}
              {(!selectedTicket.assignedTechnicianName || selectedTicket.assignedTechnicianName === '') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Technician</label>
                  <div className="flex gap-2">
                    <input
                      value={techId}
                      onChange={(e) => setTechId(e.target.value)}
                      placeholder="Technician ID"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
                    />
                    <input
                      value={techName}
                      onChange={(e) => setTechName(e.target.value)}
                      placeholder="Technician Name"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
                    />
                    <button
                      onClick={handleAssign}
                      disabled={loading}
                      className="px-4 py-2 bg-[#0A2342] text-white rounded-lg text-sm hover:bg-blue-900 disabled:opacity-60"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              )}

              {/* Resolution Notes */}
              {selectedTicket.resolutionNotes && (
                <div>
                  <label className="text-xs text-gray-500">Resolution Notes</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{selectedTicket.resolutionNotes}</p>
                </div>
              )}
              {selectedTicket.rejectionReason && (
                <div>
                  <label className="text-xs text-gray-500">Rejection Reason</label>
                  <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg mt-1">{selectedTicket.rejectionReason}</p>
                </div>
              )}

              {/* Add Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Note</label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm resize-none"
                  placeholder="Add resolution notes or comments..."
                />
                <p className="mt-2 text-xs text-gray-500">
                  This note is required when moving to RESOLVED or REJECTED.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="px-4 py-2 bg-[#F47C20] text-white rounded-lg text-sm hover:bg-[#E06A10] transition-colors disabled:opacity-60"
                >
                  Save Changes
                </button>
              </div>

              {/* Shared Comments: user + admin */}
              <div className="border-t border-gray-100 pt-4">
                <CommentSection
                  ticket={selectedTicket}
                  onUpdate={handleTicketCommentsUpdate}
                  currentUser={ADMIN_USER}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox — FIXED: only renders when activeImg is a non-empty string */}
      {activeImg && typeof activeImg === 'string' && (
        <div
          onClick={() => setActiveImg(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] cursor-pointer"
        >
          <img
            src={getAttachmentSrc(activeImg)}
            alt="Attachment preview"
            className="max-w-3xl max-h-[85vh] rounded-xl"
            onError={(e) => {
              console.error('Lightbox image failed to load:', e.target.src);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TicketManagement;