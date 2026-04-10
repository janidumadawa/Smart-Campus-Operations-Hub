// src/pages/tickets/components/TicketForm.jsx
import { useState, useEffect } from "react";
import { useTickets } from "../hooks/useTickets";
import { useAuth } from '../../../context/AuthContext';

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const validateContact = (value) => {
  const slPhone = /^(?:\+94|0)7\d{8}$/;
  const gmail   = /^[^\s@]+@gmail\.com$/i;
  const sliit   = /^[^\s@]+@my\.sliit\.lk$/i;
  return slPhone.test(value) || gmail.test(value) || sliit.test(value);
};

export default function TicketForm({ onSuccess, onCancel }) {
  const { createTicket, uploadAttachments, getAvailableResources, loading, error } = useTickets();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "",
    contactDetails: "",
    resourceId: "",
    resourceType: "",
    resourceCapacity: "",
    resourceLocation: "",
    location: "",
  });

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [contactError, setContactError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    const fetchResources = async () => {
      setResourcesLoading(true);
      try {
        const data = await getAvailableResources();
        if (data && Array.isArray(data)) {
          setResources(data);
        }
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setResourcesLoading(false);
      }
    };

    fetchResources();
  }, [getAvailableResources]);

  const handleResourceChange = (e) => {
    const resourceId = e.target.value;
    setForm((p) => ({ ...p, resourceId }));

    if (resourceId) {
      const selected = resources.find((r) => r.id === resourceId);
      setSelectedResource(selected);

      if (selected) {
        setForm((p) => ({
          ...p,
          resourceId,
          resourceType: selected.type || "",
          resourceCapacity: selected.capacity ? String(selected.capacity) : "",
          resourceLocation: selected.location || "",
          location: selected.location || "",
        }));
      }
    } else {
      setSelectedResource(null);
      setForm((p) => ({ ...p, resourceType: "", resourceCapacity: "", resourceLocation: "", location: "" }));
    }
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).slice(0, 3);
    setFiles(selected);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleContactBlur = () => {
    if (form.contactDetails && !validateContact(form.contactDetails)) {
      setContactError("Enter a valid Sri Lankan phone, Gmail, or SLIIT email.");
    } else {
      setContactError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateContact(form.contactDetails)) {
      setContactError("Enter a valid Sri Lankan phone, Gmail, or SLIIT email.");
      return;
    }

    try {
      const ticket = await createTicket({
        title: form.title,
        description: form.description,
        priority: form.priority,
        contactDetails: form.contactDetails,
        resourceId: form.resourceId,
        location: form.location || form.resourceLocation,
        category: "",
        reportedByUserId: user?.id,
        reportedByName: user?.name,
      });

      if (files.length > 0) {
        await uploadAttachments(ticket.id, files);
      }

      setForm({
        title: "", description: "",
        priority: "", contactDetails: "", resourceId: "",
        resourceType: "", resourceCapacity: "", resourceLocation: "",
        location: "",
      });
      setFiles([]);
      setPreview([]);
      setSelectedResource(null);
      setContactError("");
      onSuccess?.();
    } catch (_) {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Resource Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Resource *</label>
        <select
          required
          value={form.resourceId}
          onChange={handleResourceChange}
          disabled={resourcesLoading}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20] disabled:bg-gray-100"
        >
          <option value="">
            {resourcesLoading ? "Loading resources..." : "Choose resource..."}
          </option>
          {resources.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Details - Auto-filled when resource is selected */}
      {form.resourceId && selectedResource && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm">Resource Details</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <input
                type="text"
                value={form.resourceType}
                disabled
                className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 font-medium cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Capacity</label>
              <input
                type="text"
                value={form.resourceCapacity ? `${form.resourceCapacity}` : ""}
                disabled
                className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 font-medium cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input
                type="text"
                value={form.resourceLocation}
                disabled
                className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          required value={form.title} onChange={set("title")}
          placeholder="Brief description of the issue"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20]"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
        <select
          required value={form.priority} onChange={set("priority")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20]"
        >
          <option value="">Select...</option>
          {PRIORITIES.map((p) => (<option key={p}>{p}</option>))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          required value={form.description} onChange={set("description")}
          rows={4} placeholder="Describe the issue in detail..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20] resize-none"
        />
      </div>

      {/* Contact */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details *</label>
        <input
          required
          value={form.contactDetails}
          onChange={(e) => {
            set("contactDetails")(e);
            if (contactError) setContactError("");
          }}
          onBlur={handleContactBlur}
          placeholder="Enter your contact info"
          pattern="^(?:(?:\+94|0)7\d{8}|[^\s@]+@gmail\.com|[^\s@]+@my\.sliit\.lk)$"
          title="Enter a valid Sri Lankan phone number, Gmail address, or SLIIT campus email"
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20] ${
            contactError ? "border-red-400" : "border-gray-300"
          }`}
        />
        {contactError && (
          <p className="mt-1 text-xs text-red-500">{contactError}</p>
        )}
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attachments <span className="text-gray-400 font-normal">(max 3 images)</span>
        </label>
        <input
          type="file" accept="image/*" multiple onChange={handleFiles}
          className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#F47C20] file:text-white hover:file:bg-orange-600 cursor-pointer"
        />
        {preview.length > 0 && (
          <div className="flex gap-2 mt-2">
            {preview.map((src, i) => (
              <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={loading}
          className="flex-1 bg-[#F47C20] hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
        {onCancel && (
          <button
            type="button" onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}