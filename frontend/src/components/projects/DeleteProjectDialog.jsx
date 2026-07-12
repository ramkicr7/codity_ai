import React, { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteProjectDialog({ project, isDeleting, onConfirm, onCancel }) {
  const isOpen = Boolean(project);
  const confirmButtonRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => confirmButtonRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isDeleting && onCancel()}
            aria-hidden="true"
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-sm rounded-2xl border border-gray-700 bg-[#111827] p-6 shadow-xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>

            <h2 id={titleId} className="mt-4 text-base font-semibold text-white">
              Delete "{project?.name}"?
            </h2>
            <p className="mt-1.5 text-sm text-gray-400">
              This will permanently remove the project and everything in it.
              This action can't be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isDeleting}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isDeleting ? "Deleting…" : "Delete project"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
