import React, { useState } from "react";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";

import SearchBar from "../components/projects/SearchBar";
import ProjectStats from "../components/projects/ProjectStats";
import ProjectTable from "../components/projects/ProjectTable";
import ProjectModal from "../components/projects/ProjectModal";
import DeleteProjectDialog from "../components/projects/DeleteProjectDialog";

import { useProjects } from "../hooks/useProjects";

export default function Projects() {
    const {
        projects,
        allProjectsCount,
        stats,
        isLoading,
        error,
        isCreating,
        deletingId,
        searchTerm,
        setSearchTerm,
        refetch,
        addProject,
        removeProject,
    } = useProjects();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleDelete = async () => {
        if (!selectedProject) return;

        await removeProject(selectedProject);

        setSelectedProject(null);
    };

    return (
        <div className="p-6">

            {/* Header */}

            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        Projects
                    </h1>

                    <p className="text-gray-500">
                        Manage your distributed AI projects
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white"
                >
                    <Plus size={18} />
                    New Project
                </button>

            </div>

            {/* Stats */}

            <ProjectStats
                stats={stats}
                isLoading={isLoading}
            />

            {/* Error */}

            {error && (
                <div className="mt-5 rounded-lg bg-red-100 p-4 text-red-700 flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}

                    <button
                        onClick={refetch}
                        className="ml-auto flex items-center gap-2 rounded bg-red-500 px-3 py-1 text-white"
                    >
                        <RefreshCw size={15} />
                        Retry
                    </button>
                </div>
            )}

            {/* Search */}

            <div className="my-5 flex items-center justify-between">

                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                />

                <span className="text-sm text-gray-500">
                    {projects.length} / {allProjectsCount} Projects
                </span>

            </div>

            {/* Loading */}

            {isLoading ? (

                <div className="rounded-lg border p-10 text-center">
                    Loading Projects...
                </div>

            ) : (

                <ProjectTable
                    projects={projects}
                    deletingId={deletingId}
                    onRequestDelete={setSelectedProject}
                />

            )}

            {/* Create */}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addProject}
                isSubmitting={isCreating}
            />

            {/* Delete */}

            <DeleteProjectDialog
                project={selectedProject}
                isDeleting={
                    deletingId === selectedProject?.id
                }
                onConfirm={handleDelete}
                onCancel={() => setSelectedProject(null)}
            />

        </div>
    );
}