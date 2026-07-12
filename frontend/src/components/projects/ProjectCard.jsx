import React from "react";
import { motion } from "framer-motion";
import { Trash2, Loader2, CalendarDays } from "lucide-react";

const STATUS_STYLES = {
  active: "bg-emerald-900/30 text-emerald-400 ring-emerald-500/20",
  completed: "bg-blue-900/30 text-blue-400 ring-blue-500/20",
  archived: "bg-gray-800 text-gray-300 ring-gray-600/20",
};

function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return "—";
  }
}

export default function ProjectCard({ project, onRequestDelete, isDeleting }) {
  const statusStyle = STATUS_STYLES[project.status] ?? STATUS_STYLES.active;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col rounded-xl border border-gray-700 bg-[#111827] p-5 shadow-sm text-white transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate text-base font-semibold text-white" title={project.name}>
          {project.name}
        </h3>
        <span
          className={`inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${statusStyle}`}
        >
          {project.status}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-gray-400">
        {project.description || "No description provided."}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{formatDate(project.created_at)}</span>
        </div>

        <button
          type="button"
          onClick={() => onRequestDelete(project)}
          disabled={isDeleting}
          aria-label={`Delete ${project.name}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 opacity-0 transition hover:bg-red-900/30 hover:text-red-400 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 group-hover:opacity-100"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
