import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useTickets } from "../hooks/useTickets";
import TicketCard from "./TicketCard";
import CommentSection from "./CommentSection";
import SlaTimer from "./SlaTimer";
import TicketDetail from "./TicketDetail";

const STATUSES   = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];
const PRIORITIES = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

const TicketList = forwardRef(function TicketList({ onSelect }, ref) {
  const { getAllTickets, loading, error } = useTickets();
  const [tickets,    setTickets]    = useState([]);
  const [status,     setStatus]     = useState("ALL");
  const [priority,   setPriority]   = useState("ALL");
  const [search,     setSearch]     = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected,   setSelected]   = useState(null); // ← tracks expanded ticket

  useImperativeHandle(ref, () => ({
    refreshTickets: () => setRefreshKey((prev) => prev + 1),
  }));

  useEffect(() => {
    (async () => {
      try {
        const params = {};
        if (status   !== "ALL") params.status   = status;
        if (priority !== "ALL") params.priority = priority;

        const data = await getAllTickets(params);
        setTickets(data ?? []);
      } catch (err) {
        console.error("Failed to load tickets:", err);
        setTickets([]);
      }
    })();
  }, [status, priority, refreshKey]);

  // When a comment is added/edited/deleted, patch just that ticket in state
  const handleTicketUpdate = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
    setSelected(updatedTicket); // keep modal in sync
  };

  const handleSelect = (ticket) => {
    setSelected(ticket);
    onSelect?.(ticket); // still forward to parent if needed
  };

  const filtered = tickets.filter(
    (t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20] w-52"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20]"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47C20]"
          >
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <span className="text-sm text-gray-400 ml-auto">{filtered.length} tickets</span>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#F47C20] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🎫</p>
            <p>No tickets found</p>
          </div>
        )}

        {/* Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TicketCard key={t.id} ticket={t} onClick={handleSelect} />
          ))}
        </div>
      </div>

      {/* ── Comment Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)} // close on backdrop click
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
          >
            {/* Modal header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="font-bold text-[#0A2342] text-lg leading-tight truncate">
                  {selected.title}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs bg-orange-100 text-[#F47C20] px-2 py-0.5 rounded-full font-medium">
                    {selected.status}
                  </span>
                  {selected.priority && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {selected.priority}
                    </span>
                  )}
                  {selected.location && (
                    <span className="text-xs text-gray-400">📍 {selected.location}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Main content — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <TicketDetail 
                ticketId={selected.id} 
                onBack={() => setSelected(null)}
                hideBack={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default TicketList;