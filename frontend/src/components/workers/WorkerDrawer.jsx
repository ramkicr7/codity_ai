import { X } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function WorkerDrawer({
  worker,
  onClose,
  formatTimeAgo,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end">
      <div className="w-[420px] bg-[#0b0f19] h-full p-6 border-l border-gray-800 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Worker Details</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4 text-sm">

          <div>
            <p className="text-gray-400">Name</p>
            <StatusBadge status={worker.status}/>
          </div>

          <div>
            <p className="text-gray-400">Hostname</p>
            <p className="font-semibold">{worker.hostname}</p>
          </div>

          <div>
            <p className="text-gray-400">Status</p>
            <p className="font-semibold">{worker.status}</p>
          </div>

          <div>
            <p className="text-gray-400">Worker ID</p>
            <p className="font-mono text-xs">{worker.id}</p>
          </div>

          <div>
            <p className="text-gray-400">Last Heartbeat</p>
            <p>{formatTimeAgo(worker.last_heartbeat)}</p>
          </div>

          <div>
            <p className="text-gray-400">Created At</p>
            <p>
{
worker.created_at
? new Date(worker.created_at).toLocaleString()
: "N/A"
}
</p>
          </div>

          <div>
            <p className="text-gray-400">Updated At</p>
            <p>
{
worker.updated_at
? new Date(worker.updated_at).toLocaleString()
: "N/A"
}
</p>
          </div>

        </div>
      </div>
    </div>
  );
}