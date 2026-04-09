import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X, Check, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ResourceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    location: '',
    status: 'AVAILABLE'
  });

  const resourceTypes = ['ROOM', 'EQUIPMENT'];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/resources?page=0&size=100`);
      if (!response.ok) throw new Error('Failed to fetch resources');

      const data = await response.json();
      const resourceList = (data.content || data || []).map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        capacity: r.capacity,
        location: r.location,
        status: r.status === 'AVAILABLE' ? 'ACTIVE' : 'OUT_OF_SERVICE',
        imagePublicId: r.imagePublicId
      }));
      setResources(resourceList);
    } catch (err) {
      console.error('Error fetching resources:', err);
      toast.error('Failed to load resources');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddResource = async () => {
    if (!formData.name || !formData.type || !formData.capacity || !formData.location) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        capacity: parseInt(formData.capacity),
        location: formData.location,
        status: 'AVAILABLE'
      };

      const response = await fetch(`${API_BASE_URL}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add resource');

      await fetchResources();
      setShowAddModal(false);
      setFormData({ name: '', type: '', capacity: '', location: '', status: 'AVAILABLE' });
      toast.success('Resource added successfully');
    } catch (err) {
      console.error('Error adding resource:', err);
      toast.error('Failed to add resource');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const resource = resources.find(r => r.id === id);
      if (!resource) return;

      const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'AVAILABLE';

      setResources(resources.map(r =>
        r.id === id ? { ...r, status: newStatus } : r
      ));
      toast.success('Status updated');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      setResources(resources.filter(r => r.id !== id));
      toast.success('Resource deleted');
    } catch (err) {
      console.error('Error deleting resource:', err);
      toast.error('Failed to delete resource');
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2342]">Resource Management</h1>
          <p className="text-gray-600 mt-1">Manage campus facilities and equipment</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading resources...</div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] text-sm min-w-[150px]"
              >
                <option value="all">All Types</option>
                {resourceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No resources found
                    </td>
                  </tr>
                ) : (
                  filteredResources.map(resource => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="font-medium text-gray-900">{resource.name}</div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{resource.type}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{resource.capacity}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{resource.location}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          resource.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {resource.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(resource.id)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Toggle Status"
                          >
                            {resource.status === 'ACTIVE'
                              ? <XCircle className="w-4 h-4" />
                              : <Check className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(resource.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#0A2342]">Add New Resource</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20]"
                  placeholder="e.g. Lecture Hall A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20]"
                >
                  <option value="">Select Type</option>
                  {resourceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20]"
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20]"
                  placeholder="e.g. Building A, Floor 2"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleAddResource}
                className="flex-1 px-4 py-2 bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors font-medium"
              >
                Add Resource
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;