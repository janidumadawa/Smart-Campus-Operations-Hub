import { useState, useEffect } from "react";

const ACTIVITY_ICONS = {
  CREATION:     "📋",
  STATUS_CHANGE: "🔄",
  ASSIGNMENT:   "👨‍🔧",
  RESOLUTION:   "✅",
  REJECTION:    "❌",
  COMMENT:      "💬",
  ATTACHMENT:   "📎",
};

const ACTIVITY_COLORS = {
  CREATION:     "bg-blue-50 border-blue-200",
  STATUS_CHANGE: "bg-purple-50 border-purple-200",
  ASSIGNMENT:   "bg-orange-50 border-orange-200",
  RESOLUTION:   "bg-green-50 border-green-200",
  REJECTION:    "bg-red-50 border-red-200",
  COMMENT:      "bg-gray-50 border-gray-200",
  ATTACHMENT:   "bg-yellow-50 border-yellow-200",
};

const ROLE_COLORS = {
  ADMIN:     "bg-red-100 text-red-700",
  TECHNICIAN: "bg-blue-100 text-blue-700",
  USER:       "bg-green-100 text-green-700",
  SYSTEM:    "bg-gray-100 text-gray-700",
};

export default function ActivityTimeline({ activities = [], loading = false }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!activities || activities.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        No activity yet
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-3 border-[#F47C20] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Sort activities by timestamp, newest first
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatRelativeTime = (timestamp) => {
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
    
    return formatTime(timestamp);
  };

  return (
    <div className="space-y-3">
      {sortedActivities.map((activity, index) => (
        <div
          key={activity.id || index}
          className={`border rounded-lg p-4 transition-all ${
            ACTIVITY_COLORS[activity.activityType] || "bg-gray-50 border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 cursor-pointer"
               onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}>
            <div className="flex items-start gap-3 flex-1">
              <span className="text-xl mt-1 flex-shrink-0">
                {ACTIVITY_ICONS[activity.activityType] || "📝"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-sm text-gray-800">
                    {activity.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      ROLE_COLORS[activity.performedByRole] || "bg-gray-100"
                    }`}
                  >
                    {activity.performedByRole}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  by <span className="font-medium">{activity.performedByName}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              {expandedId === activity.id ? "−" : "+"}
            </button>
          </div>

          {/* Expanded Details */}
          {expandedId === activity.id && (
            <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
              {activity.description && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Description</p>
                  <p className="text-sm text-gray-700">{activity.description}</p>
                </div>
              )}

              {/* Status Change Details */}
              {activity.activityType === "STATUS_CHANGE" && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Status Change</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700">
                      {activity.previousValue?.replace("_", " ")}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="inline-block px-2 py-1 rounded bg-blue-200 text-blue-700">
                      {activity.newValue?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              )}

              {/* Assignment Details */}
              {activity.activityType === "ASSIGNMENT" && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Technician Assignment</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">
                      Assigned
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="inline-block px-2 py-1 rounded bg-green-200 text-green-700">
                      {activity.newValue}
                    </span>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {activity.details && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Details</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {activity.details}
                  </p>
                </div>
              )}

              {/* Full Timestamp */}
              <div className="text-xs text-gray-400 pt-2 border-t">
                {formatTime(activity.timestamp)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}