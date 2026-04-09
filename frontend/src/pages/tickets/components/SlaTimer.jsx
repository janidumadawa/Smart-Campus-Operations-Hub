import { useEffect, useState } from "react";

const PRIORITY_COLORS = {
  CRITICAL: "bg-red-100 text-red-700 border-red-300",
  HIGH:     "bg-orange-100 text-orange-700 border-orange-300",
  MEDIUM:   "bg-yellow-100 text-yellow-700 border-yellow-300",
  LOW:      "bg-green-100 text-green-700 border-green-300",
};

function formatDuration(minutes) {
  if (minutes < 60)  return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
}

export default function SlaTimer({ sla }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!sla) return null;

  const createdAt   = new Date(sla.createdAt);
  const elapsedMin  = Math.floor((now - createdAt.getTime()) / 60000);
  const respDone    = sla.respondedAt != null;
  const resolvedDone= sla.resolvedAt  != null;

  const respMin     = respDone
    ? sla.responseTimeMinutes
    : elapsedMin;
  const resolveMin  = resolvedDone
    ? sla.resolutionTimeMinutes
    : elapsedMin;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700 text-sm">SLA Status</h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[sla.priority] || "bg-gray-100 text-gray-600"}`}>
          {sla.priority}
        </span>
      </div>

      {/* Response SLA */}
      <SlaRow
        label="Response"
        done={respDone}
        elapsed={respMin}
        threshold={sla.responseThresholdMinutes}
        breached={sla.responseBreached}
      />

      {/* Resolution SLA */}
      <SlaRow
        label="Resolution"
        done={resolvedDone}
        elapsed={resolveMin}
        threshold={sla.resolutionThresholdMinutes}
        breached={sla.resolutionBreached}
      />
    </div>
  );
}

function SlaRow({ label, done, elapsed, threshold, breached }) {
  const pct = Math.min((elapsed / threshold) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className={breached ? "text-red-600 font-semibold" : "text-gray-600"}>
          {done ? "✓ " : ""}{formatDuration(elapsed)} / {formatDuration(threshold)}
          {breached && !done ? " ⚠ Breached" : ""}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${
            done && !breached ? "bg-green-500" :
            breached           ? "bg-red-500"   : "bg-blue-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}