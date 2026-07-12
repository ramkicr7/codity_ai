import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";


export default function WorkerModal({ worker, onClose, refresh }) {
  const isEdit = !!worker;

  const [form, setForm] = useState({
    name:"",
    hostname:"",
});

const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (worker) {
        setForm({
            name: worker.name || "",
            hostname: worker.hostname || "",
        });
    } else {
        setForm({
            name: "",
            hostname: "",
        });
    }
}, [worker]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    if (!form.name.trim()) {
        toast.error("Worker name is required.");
        return;
    }

    if (!form.hostname.trim()) {
        toast.error("Hostname is required.");
        return;
    }

    try {

        setSaving(true);

        if (isEdit) {
            await api.put(`/workers/${worker.id}`, form);
            toast.success("Worker updated successfully.");
        } else {
            await api.post("/workers", form);
            toast.success("Worker created successfully.");
        }

        refresh();
        onClose();

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Operation failed."
        );

    } finally {

        setSaving(false);

    }
};

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#151b28] p-6 rounded-xl w-[400px] border border-gray-700">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Worker" : "Create Worker"}
        </h2>

        <input
          name="name"
          placeholder="Worker Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 mb-3 bg-[#0b0f19] border border-gray-700 rounded"
        />

        <input
          name="hostname"
          placeholder="Hostname"
          value={form.hostname}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-[#0b0f19] border border-gray-700 rounded"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded"
          >
            Cancel
          </button>

          <button
    onClick={handleSubmit}
    disabled={saving}
    className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
>
    {saving ? "Saving..." : "Save"}
</button>
        </div>
      </div>
    </div>
  );
}