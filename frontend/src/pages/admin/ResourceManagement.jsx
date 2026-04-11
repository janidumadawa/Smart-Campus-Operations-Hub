// frontend/src/pages/admin/ResourceManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';
import ResourceFilters from '../../components/admin/ResourceManagement/ResourceFilters';
import ResourceTable from '../../components/admin/ResourceManagement/ResourceTable';
import ResourceModal from '../../components/admin/ResourceManagement/ResourceModal';
import ResourceDetailsModal from '../../components/admin/ResourceManagement/ResourceDetailsModal';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  const { isAdmin } = useAuth();
  
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        ...(filterType && { type: filterType }),
        ...(filterStatus && { status: filterStatus }),
        ...(searchTerm && { location: searchTerm })
      };

      const response = await axiosInstance.get('/resources', { params });
      setResources(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterType, filterStatus, searchTerm]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
      fetchResources();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchResources]);

  const handleToggleStatus = async (resource) => {
    const newStatus = resource.status === 'AVAILABLE' ? 'OUT_OF_SERVICE' : 'AVAILABLE';
    try {
      await axiosInstance.put(`/resources/${resource.id}`, {
        ...resource,
        status: newStatus
      });
      toast.success('Status updated');
      fetchResources();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await axiosInstance.delete(`/resources/${id}`);
      toast.success('Resource deleted');
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  const handleView = (resource) => {
    setSelectedResource(resource);
    setShowDetailsModal(true);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2342]">Resource Management</h1>
          <p className="text-gray-600 mt-1">Manage campus facilities and equipment</p>
        </div>
        {isAdmin() && (
        <button
          onClick={() => {
            setEditingResource(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      )}
      </div>

      <ResourceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setCurrentPage={setCurrentPage}
      />

      <ResourceTable
        resources={resources}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onEdit={(resource) => {
          setEditingResource(resource);
          setShowModal(true);
        }}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onView={handleView}
        isAdmin={isAdmin()} 

      />

      <ResourceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchResources}
        editingResource={editingResource}
      />

      <ResourceDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        resource={selectedResource}
      />
    </div>
  );
};

export default ResourceManagement;