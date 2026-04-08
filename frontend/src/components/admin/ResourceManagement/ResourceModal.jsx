// frontend/src/components/admin/ResourceManagement/ResourceModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const ResourceModal = ({ isOpen, onClose, onSuccess, editingResource, apiBaseUrl }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    location: '',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    if (editingResource) {
      setFormData({
        name: editingResource.name,
        type: editingResource.type,
        capacity: editingResource.capacity.toString(),
        location: editingResource.location,
        status: editingResource.status
      });
    } else {
      setFormData({
        name: '',
        type: '',
        capacity: '',
        location: '',
        status: 'AVAILABLE'
      });
    }
  }, [editingResource, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.type || !formData.location) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.type !== 'EQUIPMENT' && !formData.capacity) {
      toast.error('Please enter capacity');
      return;
    }

    const resourceData = {
      ...formData,
      capacity: formData.type === 'EQUIPMENT' ? 1 : parseInt(formData.capacity)
    };

    try {
      const url = editingResource
        ? `${apiBaseUrl}/${editingResource.id}`
        : apiBaseUrl;

      const method = editingResource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) throw new Error('Failed to save resource');

      toast.success(editingResource ? 'Resource updated' : 'Resource added');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#0A2342]">
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
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
              placeholder="Enter resource name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) => {
                handleInputChange(e);
                if (e.target.value === 'EQUIPMENT') {
                  setFormData(prev => ({ ...prev, capacity: '1', type: e.target.value }));
                }
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20]"
            >
              <option value="">Select Type</option>
              <option value="HALL">Hall</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.type === 'EQUIPMENT' ? 'Storage Location' : 'Location'}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20]"
              placeholder={formData.type === 'EQUIPMENT' ? 'e.g., Media Center, AV Room' : 'e.g., Building A, Floor 2'}
            />
          </div>

          {formData.type !== 'EQUIPMENT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (people)</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20]"
                placeholder="Enter capacity"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20]"
            >
              <option value="AVAILABLE">Available</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors"
          >
            {editingResource ? 'Update' : 'Add'} Resource
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;