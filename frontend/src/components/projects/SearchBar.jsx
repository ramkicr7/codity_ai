import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search projects…" }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search projects"
        className="w-full rounded-lg border border-gray-700 bg-[#111827] py-2 pl-9 pr-9 text-sm text-white placeholder:text-gray-500 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-500 transition hover:bg-gray-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
