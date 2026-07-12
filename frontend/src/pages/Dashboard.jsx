import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Activity,
  Server,
  Layers,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
} from "lucide-react";



export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
  setLoading(true);

  try {
    const [jobRes, workerRes, queueRes] = await Promise.all([
      api.get("/jobs"),
      api.get("/workers"),
      api.get("/queues"),
    ]);

    setJobs(jobRes.data.data || []);
    setWorkers(workerRes.data.data || []);
    setQueues(queueRes.data.data || []);
  } catch (err) {
    console.error("Dashboard fetch error:", err);

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // METRICS
  // =========================

  const stats = {
    totalJobs: jobs.length,
    running: jobs.filter(j => j.status === "RUNNING").length,
    pending: jobs.filter(j => j.status === "PENDING").length,
    completed: jobs.filter(j => j.status === "COMPLETED").length,
    failed: jobs.filter(j => j.status === "FAILED").length,
    workers: workers.length,
    queues: queues.length,
  };

  return (
    <div className="p-6 bg-[#0b0f19] min-h-screen text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">
            System overview of Codity AI execution engine
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">

        <Card title="Total Jobs" value={stats.totalJobs} icon={<Layers />} />
        <Card title="Running" value={stats.running} icon={<Activity />} />
        <Card title="Pending" value={stats.pending} icon={<Clock />} />
        <Card title="Completed" value={stats.completed} icon={<CheckCircle />} />
        <Card title="Failed" value={stats.failed} icon={<XCircle />} />
        <Card title="Workers" value={stats.workers} icon={<Server />} />
        <Card title="Queues" value={stats.queues} icon={<Layers />} />

      </div>

      {/* LIVE ACTIVITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* JOB HEALTH */}
        <div className="bg-[#151b28] p-5 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Job Health</h2>

          <Progress label="Completed" value={stats.completed} total={stats.totalJobs} color="green" />
          <Progress label="Running" value={stats.running} total={stats.totalJobs} color="blue" />
          <Progress label="Pending" value={stats.pending} total={stats.totalJobs} color="yellow" />
          <Progress label="Failed" value={stats.failed} total={stats.totalJobs} color="red" />
        </div>

        {/* LIVE WORKERS */}
        <div className="bg-[#151b28] p-5 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Worker Status</h2>

          <div className="space-y-3">

            {workers.slice(0, 5).map(worker => (
              <div
                key={worker.id}
                className="flex justify-between items-center bg-[#0b0f19] p-3 rounded"
              >
                <div>
                  <p className="font-semibold">{worker.name}</p>
                  <p className="text-xs text-gray-400">{worker.hostname}</p>
                </div>

                <span className={`text-xs px-2 py-1 rounded ${
                  worker.status === "ONLINE"
                    ? "bg-green-500/20 text-green-400"
                    : worker.status === "IDLE"
                    ? "bg-blue-500/20 text-blue-400"
                    : worker.status === "BUSY"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}>
                  {worker.status}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* RECENT JOBS */}
      <div className="mt-6 bg-[#151b28] p-5 rounded-xl border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Recent Jobs</h2>

        <div className="space-y-2">

          {jobs.slice(0, 6).map(job => (
            <div
              key={job.id}
              className="flex justify-between items-center bg-[#0b0f19] p-3 rounded"
            >
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-xs text-gray-400">{job.queue_id}</p>
              </div>

              <span className={`text-xs px-2 py-1 rounded ${
                job.status === "COMPLETED"
                  ? "bg-green-500/20 text-green-400"
                  : job.status === "RUNNING"
                  ? "bg-blue-500/20 text-blue-400"
                  : job.status === "FAILED"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {job.status}
              </span>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

// =========================
// CARD COMPONENT
// =========================
function Card({ title, value, icon }) {
  return (
    <div className="bg-[#151b28] p-5 rounded-xl border border-gray-800 flex justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      <div className="text-blue-400">{icon}</div>
    </div>
  );
}

// =========================
// PROGRESS BAR
// =========================
function Progress({ label, value, total, color }) {
  const percent = total ? (value / total) * 100 : 0;

  const colors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="w-full bg-gray-700 h-2 rounded">
        <div
          className={`${colors[color]} h-2 rounded`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}