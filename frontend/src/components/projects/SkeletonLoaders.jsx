import React from "react";

export function ProjectStatsSkeleton() {
    return (
        <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="h-24 animate-pulse rounded-lg bg-slate-200"
                />
            ))}
        </div>
    );
}

export function ProjectListSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="h-20 animate-pulse rounded-lg bg-slate-200"
                />
            ))}
        </div>
    );
}