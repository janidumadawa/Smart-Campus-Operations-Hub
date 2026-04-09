import { useState, useCallback } from "react";

const BASE = "http://localhost:8080/api/tickets";
const RESOURCES_BASE = "http://localhost:8080/resources";

export function useTickets() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

const request = useCallback(async (url, options = {}) => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      // Try to parse error body safely
      let errMsg = `Server error: ${res.status}`;
      try {
        const data = await res.json();
        errMsg = data.error || errMsg;
      } catch {}
      throw new Error(errMsg);
    }
    return await res.json();
  } catch (e) {
    setError(e.message);
    return null; // instead of throwing, return null so UI can handle gracefully
  } finally {
    setLoading(false);
  }
}, []);

  const getAllTickets    = useCallback((params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`${BASE}${q ? "?" + q : ""}`);
  }, [request]);
  
  const getAdminTickets  = useCallback((params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`${BASE}/admin${q ? "?" + q : ""}`);
  }, [request]);
  
  const getTicketById   = useCallback((id) => request(`${BASE}/${id}`), [request]);
  const getSla          = useCallback((id) => request(`${BASE}/${id}/sla`), [request]);
  const createTicket    = useCallback((body) => request(BASE, { method: "POST", body: JSON.stringify(body) }), [request]);
  const updateStatus    = useCallback((id, body) => request(`${BASE}/${id}/status`,  { method: "PATCH", body: JSON.stringify(body) }), [request]);
  const assignTechnician= useCallback((id, body) => request(`${BASE}/${id}/assign`,  { method: "PATCH", body: JSON.stringify(body) }), [request]);
  const deleteTicket    = useCallback((id) => request(`${BASE}/${id}`,         { method: "DELETE" }), [request]);
  const addComment      = useCallback((id, body) => request(`${BASE}/${id}/comments`,{ method: "POST",  body: JSON.stringify(body) }), [request]);
  const editComment     = useCallback((tid, cid, requesterId, content) =>
    request(`${BASE}/${tid}/comments/${cid}?requesterId=${requesterId}`, {
      method: "PUT", body: JSON.stringify({ content }),
    }), [request]);
  const deleteComment   = useCallback((tid, cid, requesterId, isAdmin = false) =>
    request(`${BASE}/${tid}/comments/${cid}?requesterId=${requesterId}&isAdmin=${isAdmin}`, {
      method: "DELETE",
    }), [request]);

  // Resource endpoints
  const getAvailableResources = useCallback(() => request(`${RESOURCES_BASE}/available`), [request]);
  const getResourceById = useCallback((id) => request(`${RESOURCES_BASE}/${id}`), [request]);

  const uploadAttachments = async (id, files) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      const res  = await fetch(`${BASE}/${id}/attachments`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data;
    } catch (e) {
      setError(e.message);
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