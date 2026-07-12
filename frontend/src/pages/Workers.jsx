import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import {
  RefreshCcw,
  Plus,
  Server,
  Activity,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

import StatusBadge from "../components/workers/StatusBadge";
import WorkerModal from "../components/workers/WorkerModal";
import WorkerDrawer from "../components/workers/WorkerDrawer";
import DeleteDialog from "../components/workers/DeleteDialog";


export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [search, setSearch] = useState("");

  // =========================
  // FETCH WORKERS
  // =========================
  const fetchWorkers = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const res = await api.get("/workers");

    if (res.data.success) {
      setWorkers(res.data.data);
      setLastUpdated(new Date());
    } else {
      setError(res.data.message || "Unable to fetch workers.");
    }
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to fetch workers."
    );
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  // =========================
  // AUTO REFRESH
  // =========================
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchWorkers();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchWorkers]);

  // =========================
  // FILTERED WORKERS
  // =========================
  const filteredWorkers = useMemo(() => {
    return workers.filter((w) =>
      `${w.name ?? ""} ${w.hostname ?? ""} ${w.id ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [workers, search]);

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {
    return {
      total: workers.length,
      online: workers.filter((w) => w.status === "ONLINE").length,
      idle: workers.filter((w) => w.status === "IDLE").length,
      busy: workers.filter((w) => w.status === "BUSY").length,
      offline: workers.filter((w) => w.status === "OFFLINE").length,
      error: workers.filter((w) => w.status === "ERROR").length,
    };
  }, [workers]);

  // =========================
  // HEARTBEAT TIME FORMAT
  // =========================
  const formatTimeAgo = (date) => {
    if (!date) return "Never";

    const diff = Math.floor((new Date() - new Date(date)) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  // =========================
  // HEARTBEAT
  // =========================
  const sendHeartbeat = async (id) => {
  try {
    await api.post(`/workers/${id}/heartbeat`);

    toast.success("Heartbeat received.");

    fetchWorkers();
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Heartbeat failed."
    );
  }
};

  
  const handleDelete = async () => {
  try {
    await api.delete(`/workers/${deleteTarget.id}`);

    toast.success("Worker deleted.");

    setDeleteTarget(null);

    fetchWorkers();
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Delete failed."
    );
  }
};

  
  const openWorker = (worker) => {
    setSelectedWorker(worker);
    setShowDrawer(true);
  };

  return (
    <div className="p-6 text-white bg-[#0b0f19] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workers</h1>
          <p className="text-gray-400">
            Monitor and manage all worker nodes
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded ${
              autoRefresh ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            {autoRefresh ? (
              <Wifi size={16} />
            ) : (
              <WifiOff size={16} />
            )}
          </button>

          <button
            onClick={fetchWorkers}
            className="p-2 bg-gray-800 rounded"
          >
            <RefreshCcw size={18} />
          </button>

          <button
  onClick={() => {
    setSelectedWorker(null);
    setShowModal(true);
  }}
            className="px-4 py-2 bg-blue-600 rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Add Worker
          </button>
        </div>
      </div>

      {/* LAST UPDATED */}
      <div className="text-sm text-gray-400 mb-4">
        Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 p-3 rounded mb-4 flex gap-2">
          <AlertCircle />
          {error}
        </div>
      )}
      {/* ========================= */}
      {/* SEARCH */}
      {/* ========================= */}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search workers by name, hostname or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#151b28] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* ========================= */}
      {/* STATS */}
      {/* ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">

        <div className="bg-[#151b28] rounded-xl p-5 border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Workers</p>
              <h2 className="text-3xl font-bold mt-2">{stats.total}</h2>
            </div>

            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Server size={30} className="text-blue-400"/>
            </div>
          </div>
        </div>

        <div className="bg-[#151b28] rounded-xl p-5 border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Online</p>
              <h2 className="text-3xl font-bold mt-2 text-green-400">
                {stats.online}
              </h2>
            </div>

            <div className="bg-green-500/20 p-3 rounded-lg">
              <Wifi size={30} className="text-green-400"/>
            </div>
          </div>
        </div>

        <div className="bg-[#151b28] rounded-xl p-5 border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Idle</p>
              <h2 className="text-3xl font-bold mt-2 text-cyan-400">
                {stats.idle}
              </h2>
            </div>

            <div className="bg-cyan-500/20 p-3 rounded-lg">
              <Activity size={30} className="text-cyan-400"/>
            </div>
          </div>
        </div>

        <div className="bg-[#151b28] rounded-xl p-5 border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Busy</p>
              <h2 className="text-3xl font-bold mt-2 text-orange-400">
                {stats.busy}
              </h2>
            </div>

            <div className="bg-orange-500/20 p-3 rounded-lg">
              <Activity size={30} className="text-orange-400"/>
            </div>
          </div>
        </div>

        <div className="bg-[#151b28] rounded-xl p-5 border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Offline</p>
              <h2 className="text-3xl font-bold mt-2 text-gray-300">
                {stats.offline}
              </h2>
            </div>

            <div className="bg-gray-700 p-3 rounded-lg">
              <WifiOff size={30}/>
            </div>
          </div>
        </div>

        <div className="bg-[#151b28] rounded-xl p-5 border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Error</p>
              <h2 className="text-3xl font-bold mt-2 text-red-400">
                {stats.error}
              </h2>
            </div>

            <div className="bg-red-500/20 p-3 rounded-lg">
              <AlertCircle size={30} className="text-red-400"/>
            </div>
          </div>
        </div>

      </div>

      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#151b28]">

        <table className="w-full">

          <thead className="bg-[#1d2435]">

            <tr className="text-left">

              <th className="px-5 py-4">Status</th>

              <th className="px-5 py-4">Worker</th>

              <th className="px-5 py-4">Hostname</th>

              <th className="px-5 py-4">Heartbeat</th>

              <th className="px-5 py-4">Created</th>

              <th className="px-5 py-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {loading && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-12 text-gray-400"
                >
                  Loading workers...
                </td>

              </tr>

            )}

            {!loading && filteredWorkers.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-12 text-gray-500"
                >
                  No workers found.
                </td>

              </tr>

            )}

            {!loading &&
              filteredWorkers.map((worker) => (

                <tr
                  key={worker.id}
                  className="border-t border-gray-800 hover:bg-[#1d2435]"
                >

                  <td className="px-5 py-4">
                    <StatusBadge status={worker.status}/>
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {worker.name}
                  </td>

                  <td className="px-5 py-4 text-gray-300">
                    {worker.hostname}
                  </td>

                  <td className="px-5 py-4">
                    {formatTimeAgo(worker.last_heartbeat)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {new Date(worker.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() => openWorker(worker)}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          setSelectedWorker(worker);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => sendHeartbeat(worker.id)}
                        className="px-3 py-1 rounded bg-green-600 hover:bg-green-700"
                      >
                        Heartbeat
                      </button>

                      <button
                        onClick={() => setDeleteTarget(worker)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>
      {/* ========================= */}
      {/* WORKER DRAWER */}
      {/* ========================= */}

      {showDrawer && selectedWorker && (
        <WorkerDrawer
          worker={selectedWorker}
          onClose={() => setShowDrawer(false)}
          formatTimeAgo={formatTimeAgo}
        />
      )}

      {/* ========================= */}
      {/* WORKER MODAL (CREATE / EDIT) */}
      {/* ========================= */}

      {showModal && (
        <WorkerModal
          worker={selectedWorker}
          onClose={() => {
            setShowModal(false);
            setSelectedWorker(null);
          }}
          refresh={fetchWorkers}
        />
      )}

      {/* ========================= */}
      {/* DELETE CONFIRMATION */}
      {/* ========================= */}

      {deleteTarget && (
        <DeleteDialog
          title="Delete Worker"
          message={`Are you sure you want to delete ${deleteTarget.name}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}