import { useState, useCallback } from "react";
import axiosInstance from '../../../utils/axiosConfig';

export function useTickets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    try {
      const config = { method, url };
      if (data) {
        config.data = data;
      }
      const response = await axiosInstance(config);
      return response.data;
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.message || 'Request failed';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllTickets = useCallback((params = {}) => {
    return request('get', '/tickets', { params });
  }, [request]);

  const getAdminTickets = useCallback((params = {}) => {
    return request('get', '/tickets/admin', { params });
  }, [request]);

  const getTicketById = useCallback((id) => request('get', `/tickets/${id}`), [request]);
  
  const getSla = useCallback((id) => request('get', `/tickets/${id}/sla`), [request]);
  
  const createTicket = useCallback((body) => request('post', '/tickets', body), [request]);
  
  const updateStatus = useCallback((id, body) => request('patch', `/tickets/${id}/status`, body), [request]);
  
  const assignTechnician = useCallback((id, body) => request('patch', `/tickets/${id}/assign`, body), [request]);
  
  const deleteTicket = useCallback((id) => request('delete', `/tickets/${id}`), [request]);
  
  const addComment = useCallback((id, body) => request('post', `/tickets/${id}/comments`, body), [request]);
  
  const editComment = useCallback((tid, cid, requesterId, content) =>
    request('put', `/tickets/${tid}/comments/${cid}?requesterId=${requesterId}`, { content }), [request]);
  
  const deleteComment = useCallback((tid, cid, requesterId, isAdmin = false) =>
    request('delete', `/tickets/${tid}/comments/${cid}?requesterId=${requesterId}&isAdmin=${isAdmin}`), [request]);

  const getAvailableResources = useCallback(() => request('get', '/resources/available'), [request]);
  
  const getResourceById = useCallback((id) => request('get', `/resources/${id}`), [request]);

  const uploadAttachments = async (id, files) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      const response = await axiosInstance.post(`/tickets/${id}/attachments`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (e) {
      const errorMsg = e.response?.data?.error || 'Upload failed';
      setError(errorMsg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading, error,
    getAllTickets, getAdminTickets, getTicketById, getSla,
    createTicket, updateStatus, assignTechnician, deleteTicket,
    addComment, editComment, deleteComment, uploadAttachments,
    getAvailableResources, getResourceById,
  };
}