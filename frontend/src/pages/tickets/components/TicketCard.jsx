const STATUS_STYLES = {
  OPEN:        "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED:    "bg-green-100 text-green-700",
  CLOSED:      "bg-gray-200 text-gray-600",
  REJECTED:    "bg-red-100 text-red-600",
};

const PRIORITY_DOT = {
  CRITICAL: "bg-red-500",
  HIGH:     "bg-orange-500",
  MEDIUM:   "bg-yellow-500",
  LOW:      "bg-green-500",
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

export default function TicketCard({ ticket, onClick }) {
  const date = new Date(ticket.createdAt).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });

  // Get latest activity/update
  const latestActivity = ticket.activities && ticket.activities.length > 0
    ? [...ticket.activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
    : null;

  const formatUpdateTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString("en-US", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div
      onClick={() => onClick?.(ticket)}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-[#F47C20] transition cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-800 text-sm group-hover:text-[#F47C20] transition line-clamp-1">
          {ticket.title}
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[ticket.status] || "bg-gray-100 text-gray-600"}`}>
          {ticket.status.replace("_", " ")}
        </span>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{ticket.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[ticket.priority] || "bg-gray-400"}`} />
            {ticket.priority}
          </span>
          <span>{ticket.category}</span>
          <span>📍 {ticket.location}</span>
        </div>
        <span>{date}</span>
      </div>

      {/* Latest Admin Update Activity */}
      {latestActivity && (
        <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50 rounded-lg p-2">
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0 mt-0.5">
              {ACTIVITY_ICONS[latestActivity.activityType] || "📝"}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-medium text-gray-700">
                  {latestActivity.title}
                </p>
                <span className="text-xs text-gray-500">
                  {formatUpdateTime(latestActivity.timestamp)}
                </span>
              </div>
              
              {/* Status change details */}
              {latestActivity.activityType === "STATUS_CHANGE" && latestActivity.previousValue && (
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                    {latestActivity.previousValue?.replace("_", " ")}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-blue-200 text-blue-700">
                    {latestActivity.newValue?.replace("_", " ")}
                  </span>
                </div>
              )}

              {/* Assignment details */}
              {latestActivity.activityType === "ASSIGNMENT" && (
                <p className="text-xs text-gray-600 mt-1">
                  Assigned: <span className="font-medium">{latestActivity.newValue}</span>
                </p>
              )}

              {/* By whom */}
              {latestActivity.performedByName && latestActivity.performedByName !== "System" && (
                <p className="text-xs text-gray-500 mt-1">
                  by <span className="font-medium">{latestActivity.performedByName}</span>
                  {latestActivity.performedByRole && (
                    <span className="text-xs text-gray-400 ml-1">({latestActivity.performedByRole})</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resource Badge - only show if resourceId exists and no activity already displayed */}
      {ticket.resourceId && ticket.resourceId !== "" && !latestActivity && (
        <div className="mt-2 text-xs">
          <span className="inline-block px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
            🔧 Resource Linked
          </span>
        </div>
      )}

      {ticket.assignedTechnicianName && !latestActivity && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          👨‍🔧 {ticket.assignedTechnicianName}
        </div>
      )}
    </div>
  );
}