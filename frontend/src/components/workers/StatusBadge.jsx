export default function StatusBadge({ status }) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";

  const colors = {
    ONLINE: "bg-green-500/20 text-green-400 border border-green-500",
    IDLE: "bg-blue-500/20 text-blue-400 border border-blue-500",
    BUSY: "bg-orange-500/20 text-orange-400 border border-orange-500",
    OFFLINE: "bg-gray-500/20 text-gray-400 border border-gray-500",
    ERROR: "bg-red-500/20 text-red-400 border border-red-500",
  };

  return (
    <span className={`${base} ${colors[status] || "bg-gray-700 text-white"}`}>
      {status || "UNKNOWN"}
    </span>
  );
}