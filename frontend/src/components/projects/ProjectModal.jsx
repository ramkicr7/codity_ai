import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";


const NAME_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 280;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = "Project name is required.";
  } else if (values.name.trim().length > NAME_MAX_LENGTH) {
    errors.name = `Keep it under ${NAME_MAX_LENGTH} characters.`;
  }
  if (values.description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Keep it under ${DESCRIPTION_MAX_LENGTH} characters.`;
  }
  return errors;
}

export default function ProjectModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [values, setValues] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (isOpen) {
      setValues({ name: "", description: "", status: "active" });
      setErrors({});
      setTouched({});
      // Delay focus until after the entrance animation mounts the input.
      const timer = setTimeout(() => nameInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (field) => (event) => {
    const nextValues = { ...values, [field]: event.target.value };
    setValues(nextValues);
    if (touched[field]) {
      setErrors(validate(nextValues));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ name: true, description: true });

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await onSubmit({
    name: values.name.trim(),
    description: values.description.trim(),
});
      onClose();
    } catch {
      
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <h2 id={titleId} className="text-lg font-semibold text-slate-900">
                Create project
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="project-name"
                  ref={nameInputRef}
                  type="text"
                  value={values.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  maxLength={NAME_MAX_LENGTH}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "project-name-error" : undefined}
                  placeholder="e.g. Website redesign"
                  className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/30"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/30"
                  }`}
                />
                {errors.name && (
                  <p id="project-name-error" className="mt-1.5 text-xs text-rose-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="project-description" className="block text-sm font-medium text-slate-700">
                  Description <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="project-description"
                  value={values.description}
                  onChange={handleChange("description")}
                  onBlur={handleBlur("description")}
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  rows={3}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "project-description-error" : undefined}
                  placeholder="What is this project about?"
                  className={`mt-1.5 block w-full resize-none rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 ${
                    errors.description
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/30"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/30"
                  }`}
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.description ? (
                    <p id="project-description-error" className="text-xs text-rose-600">
                      {errors.description}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-slate-400">
                    {values.description.length}/{DESCRIPTION_MAX_LENGTH}
                  </span>
                </div>
              </div>

              

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {isSubmitting ? "Creating…" : "Create project"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
