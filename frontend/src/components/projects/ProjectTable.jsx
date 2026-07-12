import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { ProjectListSkeleton } from "./SkeletonLoaders";


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

export default function ProjectTable({
  projects,
  isLoading,
  deletingId,
  onRequestDelete,
  onCreate,
  hasSearchTerm,
  onClearSearch,
}) {
  if (isLoading) {
    return <ProjectListSkeleton />;
  }

  if (projects.length === 0) {
  return (
    <div className="rounded-xl border border-dashed border-gray-700 bg-[#111827] p-10 text-center">
      <h2 className="text-xl font-semibold text-white">No Projects Found</h2>

      <p className="mt-2 text-gray-400">
        Create your first project to get started.
      </p>

      <button
        onClick={onCreate}
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
      >
        Create Project
      </button>
    </div>
  );
}

  return (
    <>
      {/* Card grid — small screens */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
        <AnimatePresence mode="popLayout">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onRequestDelete={onRequestDelete}
              isDeleting={deletingId === project.id}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Data table — medium screens and up */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-700 bg-[#111827] md:block">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#1F2937]">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                Created
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-300">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            <AnimatePresence mode="popLayout">
              {projects.map((project) => {
                const statusLabel = project.status || "Active";
                const statusStyle = STATUS_STYLES[statusLabel.toLowerCase()] ?? STATUS_STYLES.active;
                const isDeleting = deletingId === project.id;
                return (
                  <motion.tr
                    key={project.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    className="group transition-colors hover:bg-gray-800"
                  >
                    <td className="max-w-xs px-4 py-3.5">
                      <p className="truncate text-sm font-medium text-white" title={project.name}>
                        {project.name}
                      </p>
                      <p className="truncate text-xs text-gray-400" title={project.description}>
                        {project.description || "No description provided."}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${statusStyle}`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-400">
                      {formatDate(project.created_at)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onRequestDelete(project)}
                        disabled={isDeleting}
                        aria-label={`Delete ${project.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-red-500/10 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </>
  );
}