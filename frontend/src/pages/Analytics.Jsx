import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart3,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
const res = await api.get("/jobs");

export default function Analytics() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get("/jobs");
    setJobs(res.data.data || []);
  };

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === "COMPLETED").length,
    failed: jobs.filter(j => j.status === "FAILED").length,
    running: jobs.filter(j => j.status === "RUNNING").length,
    pending: jobs.filter(j => j.status === "PENDING").length,
  };

  return (
    <div className="p-6 text-white bg-[#0b0f19] min-h-screen">

      <h1 className="text-3xl font-bold mb-2">Analytics</h1>
      <p className="text-gray-400 mb-6">
        System performance overview
      </p>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <Card title="Total Jobs" value={stats.total} icon={<BarChart3 />} />
        <Card title="Completed" value={stats.completed} icon={<CheckCircle />} />
        <Card title="Running" value={stats.running} icon={<Activity />} />
        <Card title="Failed" value={stats.failed} icon={<XCircle />} />
        <Card title="Pending" value={stats.pending} icon={<AlertTriangle />} />

      </div>

      {/* SIMPLE VISUAL CHART */}
      <div className="bg-[#151b28] p-6 rounded-xl border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Job Distribution</h2>

        <div className="space-y-3">

          <Progress label="Completed" value={stats.completed} total={stats.total} color="green" />
          <Progress label="Running" value={stats.running} total={stats.total} color="blue" />
          <Progress label="Failed" value={stats.failed} total={stats.total} color="red" />
          <Progress label="Pending" value={stats.pending} total={stats.total} color="yellow" />

        </div>
      </div>

    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-[#151b28] p-5 rounded-xl border border-gray-800 flex justify-between items-center">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      <div className="text-blue-400">{icon}</div>
    </div>
  );
}

function Progress({ label, value, total, color }) {
  const percent = total ? (value / total) * 100 : 0;

  const colors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div>
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