import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  RefreshCw,
  Plus,
  RotateCcw,
  Trash2,
  XCircle,
  Search,
  X,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";

// ---------------------------------------------------------------------------
// Static configuration
// ---------------------------------------------------------------------------

const STATUS_CONFIG = {
  RUNNING: {
    label: "Running",
    badge: "bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20",
    dot: "bg-blue-400",
  },
  COMPLETED: {
    label: "Completed",
    badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
    dot: "bg-emerald-400",
  },
  FAILED: {
    label: "Failed",
    badge: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20",
    dot: "bg-red-400",
  },
  PENDING: {
    label: "Pending",
    badge: "bg-yellow-500/10 text-yellow-400 ring-1 ring-inset ring-yellow-500/20",
    dot: "bg-yellow-400",
  },
  CLAIMED: {
    label: "Claimed",
    badge: "bg-purple-500/10 text-purple-400 ring-1 ring-inset ring-purple-500/20",
    dot: "bg-purple-400",
  },
  CANCELLED: {
    label: "Cancelled",
    badge: "bg-gray-500/10 text-gray-400 ring-1 ring-inset ring-gray-500/20",
    dot: "bg-gray-400",
  },
};

const DEFAULT_STATUS_STYLE = {
  label: "Unknown",
  badge: "bg-slate-500/10 text-slate-400 ring-1 ring-inset ring-slate-500/20",
  dot: "bg-slate-400",
};

const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CLAIMED", label: "Claimed" },
  { value: "RUNNING", label: "Running" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PRIORITY_FILTER_OPTIONS = [
  { value: "ALL", label: "All priorities", test: () => true },
  { value: "HIGH", label: "High (8-10)", test: (p) => p >= 8 },
  { value: "MEDIUM", label: "Medium (4-7)", test: (p) => p >= 4 && p <= 7 },
  { value: "LOW", label: "Low (1-3)", test: (p) => p <= 3 },
];

const RETRYABLE_STATUSES = new Set(["FAILED"]);
const CANCELLABLE_STATUSES = new Set(["RUNNING", "PENDING", "CLAIMED"]);

const PAGE_SIZE = 8;

const INITIAL_FORM = {
  title: "",
  description: "",
  priority: 5,
  queue_id: "",
  project_id: "",
  input_data: "{}",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateTime(dateString) {
  if (!dateString) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch {
    return "—";
  }
}

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || fallback;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const [actionState, setActionState] = useState({}); // { [jobId]: "retrying" | "cancelling" | "deleting" }

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  const fetchJobs = useCallback(async ({ silent = false } = {}) => {
    silent ? setIsRefreshing(true) : setIsLoading(true);
    setLoadError("");

    try {
      const res = await api.get("/jobs");
      if (res.data?.success) {
        setJobs(res.data.data || []);
      } else {
        throw new Error(res.data?.message || "Failed to load jobs");
      }
    } catch (err) {
      const message = getErrorMessage(err, "Unable to load jobs. Please try again.");
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // -------------------------------------------------------------------------
  // Derived data — search, filters, pagination
  // -------------------------------------------------------------------------

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const priorityTest =
      PRIORITY_FILTER_OPTIONS.find((opt) => opt.value === priorityFilter)?.test ?? (() => true);

    return jobs.filter((job) => {
      const matchesSearch = query === "" || (job.title || "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
      const matchesPriority = priorityTest(Number(job.priority) || 0);
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [jobs, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, page]);

  // Reset to page 1 whenever the filtered set changes shape.
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // -------------------------------------------------------------------------
  // Job actions — retry / cancel / delete (optimistic updates)
  // -------------------------------------------------------------------------

  const setJobAction = (id, action) => {
    setActionState((prev) => {
      if (!action) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: action };
    });
  };

  const retryJob = useCallback(async (job) => {
    const previousStatus = job.status;
    setJobAction(job.id, "retrying");
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: "PENDING" } : j)));

    try {
      const res = await api.post(`/jobs${job.id}/retry`);
      if (!res.data?.success) throw new Error(res.data?.message || "Retry failed");
      toast.success("Job queued for retry");
      if (res.data?.data) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...res.data.data } : j)));
      }
    } catch (err) {
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: previousStatus } : j)));
      toast.error(getErrorMessage(err, "Failed to retry job"));
    } finally {
      setJobAction(job.id, null);
    }
  }, []);

  const cancelJob = useCallback(async (job) => {
    const previousStatus = job.status;
    setJobAction(job.id, "cancelling");
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: "CANCELLED" } : j)));

    try {
      const res = await api.post(`/jobs${job.id}/cancel`);
      if (!res.data?.success) throw new Error(res.data?.message || "Cancel failed");
      toast.success("Job cancelled");
      if (res.data?.data) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...res.data.data } : j)));
      }
    } catch (err) {
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: previousStatus } : j)));
      toast.error(getErrorMessage(err, "Failed to cancel job"));
    } finally {
      setJobAction(job.id, null);
    }
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const job = deleteTarget;

    setJobAction(job.id, "deleting");
    setJobs((prev) => prev.filter((j) => j.id !== job.id));

    try {
      const res = await api.delete(`/jobs${job.id}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Delete failed");
      toast.success("Job deleted");
      setDeleteTarget(null);
    } catch (err) {
      setJobs((prev) => [...prev, job].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      toast.error(getErrorMessage(err, "Failed to delete job"));
    } finally {
      setJobAction(job.id, null);
    }
  }, [deleteTarget]);

  // -------------------------------------------------------------------------
  // Create job form
  // -------------------------------------------------------------------------

  const updateForm = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.queue_id.trim()) errors.queue_id = "Queue ID is required.";
    if (!form.project_id.trim()) errors.project_id = "Project ID is required.";

    const priorityNum = Number(form.priority);
    if (Number.isNaN(priorityNum) || priorityNum < 1 || priorityNum > 10) {
      errors.priority = "Priority must be a number between 1 and 10.";
    }

    if (form.input_data.trim()) {
      try {
        JSON.parse(form.input_data);
      } catch {
        errors.input_data = "Input data must be valid JSON.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setForm(INITIAL_FORM);
    setFormErrors({});
  }, []);

  const submitCreateJob = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsCreating(true);
      try {
        const res = await api.post("/jobs", {
          title: form.title.trim(),
          description: form.description.trim(),
          priority: Number(form.priority),
          queue_id: form.queue_id.trim(),
          project_id: form.project_id.trim(),
          input_data: JSON.parse(form.input_data || "{}"),
        });

        if (!res.data?.success) throw new Error(res.data?.message || "Failed to create job");

        toast.success("Job created");
        if (res.data?.data) {
          setJobs((prev) => [res.data.data, ...prev]);
        } else {
          fetchJobs({ silent: true });
        }
        closeCreateModal();
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to create job"));
      } finally {
        setIsCreating(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, closeCreateModal, fetchJobs]
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#0B1120] p-6 text-white">
      <PageHeader
        onRefresh={() => fetchJobs({ silent: true })}
        isRefreshing={isRefreshing}
        onCreate={() => setShowCreateModal(true)}
      />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      {isLoading ? (
        <JobsTableSkeleton />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={() => fetchJobs()} />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          hasJobs={jobs.length > 0}
          onCreate={() => setShowCreateModal(true)}
          onClearFilters={() => {
            setSearch("");
            setStatusFilter("ALL");
            setPriorityFilter("ALL");
          }}
        />
      ) : (
        <>
          <JobsTable
            jobs={paginatedJobs}
            actionState={actionState}
            onRetry={retryJob}
            onCancel={cancelJob}
            onDeleteRequest={setDeleteTarget}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {showCreateModal && (
        <CreateJobModal
          form={form}
          errors={formErrors}
          isSubmitting={isCreating}
          onChange={updateForm}
          onSubmit={submitCreateJob}
          onClose={closeCreateModal}
        />
      )}

      {deleteTarget && (
        <DeleteJobModal
          job={deleteTarget}
          isDeleting={actionState[deleteTarget.id] === "deleting"}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page header
// ---------------------------------------------------------------------------

function PageHeader({ onRefresh, isRefreshing, onCreate }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Jobs</h1>
        <p className="mt-1 text-sm text-gray-400">Manage all distributed jobs across your queues.</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[#111827] px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
        >
          <Plus size={16} />
          New Job
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toolbar — search + filters
// ---------------------------------------------------------------------------

function Toolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          aria-hidden="true"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search jobs by title…"
          aria-label="Search jobs"
          className="w-full rounded-lg border border-gray-700 bg-[#111827] py-2 pl-9 pr-9 text-sm text-white placeholder:text-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-500 transition hover:bg-gray-700 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        aria-label="Filter by status"
        className="rounded-lg border border-gray-700 bg-[#111827] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => onPriorityFilterChange(e.target.value)}
        aria-label="Filter by priority"
        className="rounded-lg border border-gray-700 bg-[#111827] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        {PRIORITY_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

function JobsTable({ jobs, actionState, onRetry, onCancel, onDeleteRequest }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-700 bg-[#111827] shadow-sm">
      <div className="max-h-[32rem] overflow-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-[#1F2937]">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-gray-300">Title</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-gray-300">Status</th>
              <th className="hidden px-4 py-3 font-semibold uppercase tracking-wide text-xs text-gray-300 sm:table-cell">
                Priority
              </th>
              <th className="hidden px-4 py-3 font-semibold uppercase tracking-wide text-xs text-gray-300 md:table-cell">
                Retries
              </th>
              <th className="hidden px-4 py-3 font-semibold uppercase tracking-wide text-xs text-gray-300 lg:table-cell">
                Created
              </th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide text-xs text-gray-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {jobs.map((job) => {
              const statusStyle = STATUS_CONFIG[job.status] ?? DEFAULT_STATUS_STYLE;
              const currentAction = actionState[job.id];
              const isRetrying = currentAction === "retrying";
              const isCancelling = currentAction === "cancelling";
              const isDeleting = currentAction === "deleting";
              const isBusy = Boolean(currentAction);

              return (
                <tr key={job.id} className="transition-colors hover:bg-gray-800">
                  <td className="max-w-[220px] px-4 py-3.5">
                    <p className="truncate font-medium text-white" title={job.title}>
                      {job.title || "Untitled job"}
                    </p>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
                      {statusStyle.label}
                    </span>
                  </td>

                  <td className="hidden px-4 py-3.5 text-gray-300 sm:table-cell">{job.priority}</td>

                  <td className="hidden px-4 py-3.5 text-gray-300 md:table-cell">{job.retry_count ?? 0}</td>

                  <td className="hidden whitespace-nowrap px-4 py-3.5 text-gray-400 lg:table-cell">
                    {formatDateTime(job.created_at)}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {RETRYABLE_STATUSES.has(job.status) && (
                        <button
                          type="button"
                          onClick={() => onRetry(job)}
                          disabled={isBusy}
                          aria-label={`Retry ${job.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRetrying ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <RotateCcw size={16} />
                          )}
                        </button>
                      )}

                      {CANCELLABLE_STATUSES.has(job.status) && (
                        <button
                          type="button"
                          onClick={() => onCancel(job)}
                          disabled={isBusy}
                          aria-label={`Cancel ${job.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500/10 text-yellow-400 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isCancelling ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeleteRequest(job)}
                        disabled={isBusy}
                        aria-label={`Delete ${job.title}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-gray-400">
        Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="inline-flex items-center gap-1 rounded-lg border border-gray-700 bg-[#111827] px-3 py-1.5 text-sm text-gray-200 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
          className="inline-flex items-center gap-1 rounded-lg border border-gray-700 bg-[#111827] px-3 py-1.5 text-sm text-gray-200 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading / empty / error states
// ---------------------------------------------------------------------------

function JobsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-700 bg-[#111827] shadow-sm">
      <div className="border-b border-gray-700 bg-[#1F2937] px-4 py-3">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-700" />
      </div>
      <div className="divide-y divide-gray-700">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-700" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-gray-700" />
            <div className="h-4 w-10 animate-pulse rounded bg-gray-700" />
            <div className="ml-auto h-8 w-24 animate-pulse rounded bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ hasJobs, onCreate, onClearFilters }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-700 bg-[#111827] p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
        <Inbox className="h-6 w-6 text-gray-500" aria-hidden="true" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-white">
        {hasJobs ? "No jobs match your filters" : "No jobs yet"}
      </h2>
      <p className="mt-1 text-sm text-gray-400">
        {hasJobs
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Create your first job to start processing work on your queues."}
      </p>

      <button
        type="button"
        onClick={hasJobs ? onClearFilters : onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
      >
        {hasJobs ? "Clear filters" : (
          <>
            <Plus size={16} />
            New Job
          </>
        )}
      </button>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-900/40 bg-[#111827] p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
        <AlertCircle className="h-6 w-6 text-red-400" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-white">Couldn't load jobs</h2>
      <p className="mt-1 text-sm text-gray-400">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
      >
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal shell — shared escape / click-outside behavior
// ---------------------------------------------------------------------------

function ModalShell({ onClose, disableClose, labelledBy, children, widthClass = "max-w-lg" }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && !disableClose) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, disableClose]);

  const handleBackdropClick = (e) => {
    if (!disableClose && panelRef.current && !panelRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`w-full ${widthClass} rounded-2xl border border-gray-700 bg-[#111827] p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-150`}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create job modal
// ---------------------------------------------------------------------------

function CreateJobModal({ form, errors, isSubmitting, onChange, onSubmit, onClose }) {
  const titleId = "create-job-title";

  return (
    <ModalShell onClose={onClose} disableClose={isSubmitting} labelledBy={titleId} widthClass="max-w-lg">
      <div className="flex items-start justify-between">
        <h2 id={titleId} className="text-lg font-semibold text-white">
          Create Job
        </h2>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close"
          className="rounded-md p-1 text-gray-400 transition hover:bg-gray-700 hover:text-white disabled:opacity-50"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
        <Field label="Title" error={errors.title} required>
          <input
            type="text"
            value={form.title}
            onChange={onChange("title")}
            placeholder="e.g. Generate weekly report"
            className={inputClass(errors.title)}
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            value={form.description}
            onChange={onChange("description")}
            placeholder="Optional details about this job"
            rows={2}
            className={inputClass(errors.description)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Queue ID" error={errors.queue_id} required>
            <input
              type="text"
              value={form.queue_id}
              onChange={onChange("queue_id")}
              placeholder="queue-uuid"
              className={inputClass(errors.queue_id)}
            />
          </Field>

          <Field label="Project ID" error={errors.project_id} required>
            <input
              type="text"
              value={form.project_id}
              onChange={onChange("project_id")}
              placeholder="project-uuid"
              className={inputClass(errors.project_id)}
            />
          </Field>
        </div>

        <Field label="Priority (1-10)" error={errors.priority} required>
          <input
            type="number"
            min={1}
            max={10}
            value={form.priority}
            onChange={onChange("priority")}
            className={inputClass(errors.priority)}
          />
        </Field>

        <Field label="Input Data (JSON)" error={errors.input_data}>
          <textarea
            value={form.input_data}
            onChange={onChange("input_data")}
            placeholder='{"key":"value"}'
            rows={3}
            spellCheck={false}
            className={`${inputClass(errors.input_data)} font-mono text-xs`}
          />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Creating…" : "Create Job"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function Field({ label, error, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-red-400">
          <AlertTriangle size={12} />
          {error}
        </span>
      )}
    </label>
  );
}

function inputClass(hasError) {
  return `w-full rounded-lg border bg-[#1F2937] px-3 py-2 text-sm text-white placeholder:text-gray-500 transition focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
      : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/30"
  }`;
}

// ---------------------------------------------------------------------------
// Delete confirmation modal
// ---------------------------------------------------------------------------

function DeleteJobModal({ job, isDeleting, onConfirm, onCancel }) {
  const titleId = "delete-job-title";

  return (
    <ModalShell onClose={onCancel} disableClose={isDeleting} labelledBy={titleId} widthClass="max-w-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
      </div>

      <h2 id={titleId} className="mt-4 text-base font-semibold text-white">
        Delete "{job.title}"?
      </h2>
      <p className="mt-1.5 text-sm text-gray-400">
        This will permanently remove the job and its history. This action can't be undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          autoFocus
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isDeleting && <Loader2 size={16} className="animate-spin" />}
          {isDeleting ? "Deleting…" : "Delete job"}
        </button>
      </div>
    </ModalShell>
  );
}
