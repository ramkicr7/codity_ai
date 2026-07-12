import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  description: "",
  priority: 5,
  concurrency_limit: 1,
  max_retries: 3,
  project_id: "",
};

export default function Queues() {
  const [queues, setQueues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

const API = `${import.meta.env.VITE_API_BASE_URL}/queues`;
const PROJECT_API = `${import.meta.env.VITE_API_BASE_URL}/projects`;
  // ==========================
  // FETCH QUEUES
  // ==========================
  const fetchQueues = async () => {
    try {
      setLoading(true);

      const res = await fetch(API);
      const data = await res.json();

      if (data.success) {
        setQueues(data.data);
        setError("");
      } else {
        setError(data.message || "Failed to fetch queues");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // FETCH PROJECTS
  // ==========================
  const fetchProjects = async () => {
    try {
      const res = await fetch(PROJECT_API);
      const data = await res.json();

      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueues();
    fetchProjects();
  }, []);
  console.log("Queues.jsx loaded");

  // ==========================
  // HANDLE INPUT
  // ==========================
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // ==========================
  // CREATE / UPDATE
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
    ? `${API}/${editingId}`
    : API;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        fetchQueues();
        closeModal();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this queue?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        fetchQueues();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  // ==========================
  // EDIT
  // ==========================
  const handleEdit = (queue) => {
    setEditingId(queue.id);

    setForm({
      name: queue.name || "",
      description: queue.description || "",
      priority: queue.priority || 5,
      concurrency_limit: queue.concurrency_limit || 1,
      max_retries: queue.max_retries || 3,
      project_id: queue.project_id || "",
    });

    setShowModal(true);
  };

  // ==========================
  // OPEN CREATE
  // ==========================
  const openCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowModal(true);
  };

  // ==========================
  // CLOSE MODAL
  // ==========================
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div className="p-6 min-h-screen bg-[#0B1120]">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          Queues
        </h1>

        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Create Queue
        </button>
      </div>

      {loading && (
        <p className="text-gray-400">Loading queues...</p>
      )}

      {error && (
        <p className="text-red-400 mb-4">
          {error}
        </p>
      )}

      {!loading && (
        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-[#111827]">

          <table className="w-full">

            <thead>

              <tr className="bg-[#1F2937] text-left">

                <th className="p-3 text-gray-300 font-medium">Name</th>

                <th className="p-3 text-gray-300 font-medium">Description</th>

                <th className="p-3 text-gray-300 font-medium">Priority</th>

                <th className="p-3 text-gray-300 font-medium">Concurrency</th>

                <th className="p-3 text-gray-300 font-medium">Retries</th>

                <th className="p-3 text-gray-300 font-medium">Status</th>

                <th className="p-3 text-gray-300 font-medium">Actions</th>

              </tr>

            </thead>

            <tbody>

              {queues.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-400"
                  >
                    No queues found.
                  </td>

                </tr>

              ) : (

                queues.map((queue) => (

                  <tr
                    key={queue.id}
                    className="border-t border-gray-700 hover:bg-gray-800 transition-colors"
                  >

                    <td className="p-3 text-white">{queue.name}</td>

                    <td className="p-3 text-gray-400">{queue.description}</td>

                    <td className="p-3 text-white">{queue.priority}</td>

                    <td className="p-3 text-white">{queue.concurrency_limit}</td>

                    <td className="p-3 text-white">{queue.max_retries}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          queue.is_paused
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {queue.is_paused ? "Paused" : "Running"}
                      </span>
                    </td>

                    <td className="p-3 space-x-2">

                      <button
                        onClick={() => handleEdit(queue)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(queue.id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      )}

      {showModal && (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

          <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 w-[450px] shadow-xl">

            <h2 className="text-xl font-semibold mb-4 text-white">

              {editingId ? "Edit Queue" : "Create Queue"}

            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >

              <input
                name="name"
                placeholder="Queue Name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#1F2937] border border-gray-700 text-white placeholder:text-gray-500 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-[#1F2937] border border-gray-700 text-white placeholder:text-gray-500 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              <input
                type="number"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full bg-[#1F2937] border border-gray-700 text-white placeholder:text-gray-500 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              <input
                type="number"
                name="concurrency_limit"
                value={form.concurrency_limit}
                onChange={handleChange}
                className="w-full bg-[#1F2937] border border-gray-700 text-white placeholder:text-gray-500 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              <input
                type="number"
                name="max_retries"
                value={form.max_retries}
                onChange={handleChange}
                className="w-full bg-[#1F2937] border border-gray-700 text-white placeholder:text-gray-500 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                className="w-full bg-[#1F2937] border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">
                  Select Project
                </option>

                {projects.map((project) => (

                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>

                ))}

              </select>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editingId ? "Update Queue" : "Create Queue"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
