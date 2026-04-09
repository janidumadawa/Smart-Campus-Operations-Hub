// frontend/src/pages/admin/TicketManagement.jsx
import React, { useState } from 'react';
import { Search, User, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const TicketManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [noteText, setNoteText] = useState('');

  const [tickets, setTickets] = useState([
    { id: 1, title: 'Projector not working', resource: 'Lecture Hall A', category: 'Equipment', priority: 'High', status: 'OPEN', assignedTo: '', created: '2024-04-01', description: 'Projector showing blue screen' },
    { id: 2, title: 'AC not cooling', resource: 'Computer Lab B', category: 'Facility', priority: 'Medium', status: 'IN_PROGRESS', assignedTo: 'John Tech', created: '2024-04-01', description: 'Temperature too high' },
    { id: 3, title: 'Broken chair', resource: 'Meeting Room 1', category: 'Furniture', priority: 'Low', status: 'OPEN', assignedTo: '', created: '2024-04-02', description: 'Chair leg broken' },
    { id: 4, title: 'Network issue', resource: 'Lecture Hall B', category: 'IT', priority: 'High', status: 'RESOLVED', assignedTo: 'Sarah Tech', created: '2024-03-30', description: 'WiFi not connecting', resolution: 'Router restarted' },
  ]);

  const technicians = ['John Tech', 'Sarah Tech', 'Mike Tech', 'Emma Tech'];

  const handleAssign = (id, technician) => {
    setTickets(tickets.map(ticket =>
      ticket.id === id ? { ...ticket, assignedTo: technician, status: 'IN_PROGRESS' } : ticket
    ));
    toast.success(`Ticket assigned to ${technician}`);
    setSelectedTicket(null);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setTickets(tickets.map(ticket =>
      ticket.id === id ? { ...ticket, status: newStatus } : ticket
    ));
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleAddNote = (id) => {
    if (noteText.trim()) {
      toast.success('Note added successfully');
      setNoteText('');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return <span className={`px-2 py-1 text-xs rounded-full ${priorities[priority]}`}>{priority}</span>;
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
                  <td className="px-6 py-4 text-sm text-gray-600">#{ticket.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.resource}</td>
                  <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                  <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.assignedTo || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.created}</td>
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
              <h2 className="text-xl font-semibold text-[#0A2342]">Ticket #{selectedTicket.id}</h2>
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
                  <p className="text-sm font-medium text-gray-900">{selectedTicket.resource}</p>
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
                    value={selectedTicket.status}
                    onChange={(e) => {
                      handleUpdateStatus(selectedTicket.id, e.target.value);
                      setSelectedTicket({ ...selectedTicket, status: e.target.value });
                    }}
                    className="mt-1 px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F47C20]"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              {/* Assign Technician */}
              {(!selectedTicket.assignedTo || selectedTicket.assignedTo === '') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Technician</label>
                  <div className="flex gap-2">
                    <select
                      onChange={(e) => handleAssign(selectedTicket.id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
                    >
                      <option value="">Select Technician</option>
                      {technicians.map(tech => (
                        <option key={tech} value={tech}>{tech}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Resolution Notes */}
              {selectedTicket.resolution && (
                <div>
                  <label className="text-xs text-gray-500">Resolution Notes</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{selectedTicket.resolution}</p>
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
                <button
                  onClick={() => handleAddNote(selectedTicket.id)}
                  className="mt-2 px-4 py-2 bg-[#F47C20] text-white rounded-lg text-sm hover:bg-[#E06A10] transition-colors"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagement;