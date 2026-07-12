import React from "react";
import { motion } from "framer-motion";
import { FolderKanban, CheckCircle2, Archive, Sparkles } from "lucide-react";
import { ProjectStatsSkeleton } from "./SkeletonLoaders";

const STAT_CONFIG = [
  { key: "total", label: "Total projects", icon: FolderKanban, tint: "text-indigo-600 bg-indigo-50" },
  { key: "active", label: "Active", icon: Sparkles, tint: "text-emerald-600 bg-emerald-50" },
  { key: "completed", label: "Completed", icon: CheckCircle2, tint: "text-sky-600 bg-sky-50" },
  { key: "archived", label: "Archived", icon: Archive, tint: "text-slate-600 bg-slate-100" },
];

export default function ProjectStats({ stats, isLoading }) {
  if (isLoading) return <ProjectStatsSkeleton />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, tint }, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
          className="rounded-xl border border-gray-700 bg-[#111827]p-4"
        >
          <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${tint}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums text-white">
            {stats[key]}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
