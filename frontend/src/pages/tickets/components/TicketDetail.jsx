import { useEffect, useState } from "react";
import { useTickets } from "../hooks/useTickets";
import CommentSection from "./CommentSection";
import ResourceDetailsCard from "./ResourceDetailsCard";
import ActivityTimeline from "./ActivityTimeline";

// TODO: Replace with real authentication system
// For now using mock admin user - integrate with your auth provider
const MOCK_USER = { id: "user-001", name: "John Doe", role: "ADMIN" };

const STATUS_STYLES = {
  OPEN:        "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED:    "bg-green-100 text-green-700",
  CLOSED:      "bg-gray-200 text-gray-600",
  REJECTED:    "bg-red-100 text-red-600",
};

const NEXT_STATUSES = {
  OPEN:        ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["RESOLVED",    "REJECTED"],
  RESOLVED:    ["CLOSED"],
  CLOSED:      [],
  REJECTED:    [],
};

const ACTIVITY_ICONS = {
  STATUS_CHANGE: "🔄",
  ASSIGNMENT:   "👨‍🔧",
  RESOLUTION:   "✅",
  REJECTION:    "❌",
  CREATION:     "📋",
  COMMENT:      "💬",
  ATTACHMENT:   "📎",
};

export default function TicketDetail({ ticketId, onBack, hideBack = false }) {
  const { getTicketById, loading } = useTickets();

  const [ticket, setTicket]   = useState(null);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await getTicketById(ticketId);
      console.log("Ticket loaded with activities:", t?.activities); // Debug log
      setTicket(t);
    })();
  }, [ticketId]);



  if (!ticket) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-[#F47C20] border-t-transparent rounded-full animate-spin" />
    </div>
  );



  return (
    <div className="space-y-6">
      {/* Back */}
      {!hideBack && (
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#F47C20] transition">
          ← Back to tickets
        </button>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{ticket.title}</h2>
            <p className="text-sm text-gray-500">
              #{ticket.id?.slice(-8)} · {ticket.category} · 📍 {ticket.location}
            </p>
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[ticket.status]}`}>
            {ticket.status.replace("_", " ")}
          </span>
        </div>

        <p className="mt-4 text-gray-700 text-sm leading-relaxed">{ticket.description}</p>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-500">
          <InfoChip label="Priority"  value={ticket.priority} />
          <InfoChip label="Reporter"  value={ticket.reportedByName} />
          <InfoChip label="Contact"   value={ticket.contactDetails} />
          <InfoChip label="Technician" value={ticket.assignedTechnicianName || "Unassigned"} />
        </div>

        {/* Attachments */}
        {ticket.attachmentUrls?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Attachments</p>
            <div className="flex gap-2 flex-wrap">
              {ticket.attachmentUrls.map((url, i) => {
                // Handle both Cloudinary URLs (full URLs) and local file paths
                const imageUrl = url.startsWith('http://') || url.startsWith('https://') 
                  ? url 
                  : `http://localhost:8080${url}`;
                return (
                  <img
                    key={i} src={imageUrl} alt=""
                    onClick={() => setActiveImg(url)}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                  />
                );
              })}
            </div>
          </div>
        )}

        {ticket.resolutionNotes && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
            <strong>Resolution:</strong> {ticket.resolutionNotes}
          </div>
        )}
        {ticket.rejectionReason && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <strong>Rejected:</strong> {ticket.rejectionReason}
          </div>
        )}
      </div>

      {/* Latest Admin Update Details */}
      {ticket && (() => {
        // Get latest activity safely
        if (!ticket.activities || ticket.activities.length === 0) return null;
        
        const sortedActivities = [...ticket.activities].sort((a, b) => {
          const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return timeB - timeA;
        });
        
        const latestActivity = sortedActivities[0];
        if (!latestActivity) return null;
        
        const formatUpdateTime = (timestamp) => {
          if (!timestamp) return "";
          const date = new Date(timestamp);
          return date.toLocaleString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit"
          });
        };

        return (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{ACTIVITY_ICONS[latestActivity.activityType] || "📝"}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm mb-2">
                  Latest Update
                </h3>
                
                <div className="space-y-2">
                  {/* Activity Title */}
                  <div>
                    <p className="text-xs text-gray-500 font-medium">What Changed</p>
                    <p className="text-sm font-semibold text-gray-800">{latestActivity.title}</p>
                  </div>

                  {/* Status Change Details */}
                  {latestActivity.activityType === "STATUS_CHANGE" && latestActivity.previousValue && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Status</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-block px-3 py-1 rounded-lg bg-gray-200 text-gray-800 text-xs font-medium">
                          {latestActivity.previousValue?.replace("_", " ")}
                        </span>
                        <span className="text-gray-400 font-bold">→</span>
                        <span className="inline-block px-3 py-1 rounded-lg bg-green-200 text-green-800 text-xs font-medium">
                          {latestActivity.newValue?.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Assignment Details */}
                  {latestActivity.activityType === "ASSIGNMENT" && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Technician Assigned</p>
                      <p className="text-sm text-gray-800 mt-1">
                        <span className="font-semibold">{latestActivity.newValue}</span>
                      </p>
                    </div>
                  )}

                  {/* Details/Notes */}
                  {latestActivity.details && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Details</p>
                      <p className="text-sm text-gray-700 mt-1 bg-white rounded px-2 py-1 break-words">{latestActivity.details}</p>
                    </div>
                  )}

                  {/* Updated By & Time */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Updated By</p>
                      <p className="text-sm text-gray-800 font-medium">{latestActivity.performedByName || "System"}</p>
                      {latestActivity.performedByRole && (
                        <p className="text-xs text-gray-500">{latestActivity.performedByRole}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Time</p>
                      <p className="text-sm text-gray-800 font-medium break-words">{formatUpdateTime(latestActivity.timestamp)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Resource Details - Display if resource is associated */}
      {ticket.resourceId && <ResourceDetailsCard resourceId={ticket.resourceId} />}

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-700 text-sm mb-4">📊 Activity Timeline</h3>
        <ActivityTimeline activities={ticket.activities} loading={loading} />
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <CommentSection ticket={ticket} onUpdate={setTicket} />
      </div>

      {/* Lightbox */}
      {activeImg && (
        <div
          onClick={() => setActiveImg(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
        >
          {(() => {
            const imageUrl = activeImg.startsWith('http://') || activeImg.startsWith('https://') 
              ? activeImg 
              : `http://localhost:8080${activeImg}`;
            return <img src={imageUrl} alt="" className="max-w-2xl max-h-[80vh] rounded-xl" />;
          })()}
        </div>
      )}
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2">
      <p className="text-gray-400 mb-0.5">{label}</p>
      <p className="font-medium text-gray-700 truncate">{value}</p>
    </div>
  );
}