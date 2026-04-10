import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ResourceModal = ({ isOpen, onClose, onSuccess, editingResource, apiBaseUrl }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    location: '',
    status: 'AVAILABLE'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingResource) {
      setFormData({
        name: editingResource.name,
        type: editingResource.type,
        capacity: editingResource.capacity.toString(),
        location: editingResource.location,
        status: editingResource.status
      });
      if (editingResource.imagePublicId) {
        setImagePreview(editingResource.imagePublicId);
      }
    } else {
      setFormData({
        name: '',
        type: '',
        capacity: '',
        location: '',
        status: 'AVAILABLE'
      });
      setImage(null);
      setImagePreview('');
    }
  }, [editingResource, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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

    setUploading(true);
    const resourceData = {
      ...formData,
      capacity: formData.type === 'EQUIPMENT' ? 1 : parseInt(formData.capacity)
    };

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('resource', new Blob([JSON.stringify(resourceData)], {
        type: 'application/json'
      }));

      if (image) {
        formDataToSend.append('image', image);
      }

      const url = editingResource
        ? `${apiBaseUrl}/${editingResource.id}`
        : apiBaseUrl;

      const method = editingResource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Failed to save resource');

      toast.success(editingResource ? 'Resource updated' : 'Resource added');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#0A2342]">
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#F47C20] transition-colors"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                  </div>
                )}
              </label>
              {imagePreview && (
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

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
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : (editingResource ? 'Update' : 'Add') + ' Resource'}
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