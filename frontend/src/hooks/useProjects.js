import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
    getProjects,
    createProject,
    deleteProject,
} from "../services/projects";

export function useProjects() {

    const [projects, setProjects] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const [isCreating, setCreating] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    const fetchProjects = async () => {

        try {

            setLoading(true);

            const res = await getProjects();

            setProjects(res.data || []);

            setError(null);

        } catch (err) {

            console.error(err);

            setError("Failed to load projects.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchProjects();

    }, []);

    const addProject = async (project) => {

        try {

            setCreating(true);

            await createProject(project);

            toast.success("Project created.");

            fetchProjects();

        } catch (err) {

            toast.error("Failed to create project.");

            throw err;

        } finally {

            setCreating(false);

        }

    };

    const removeProject = async (project) => {

        try {

            setDeletingId(project.id);

            await deleteProject(project.id);

            toast.success("Project deleted.");

            fetchProjects();

        } catch (err) {

            toast.error("Failed to delete project.");

        } finally {

            setDeletingId(null);

        }

    };

    const filteredProjects = useMemo(() => {

        if (!searchTerm.trim()) return projects;

        return projects.filter((project) => {

            return (

                project.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())

                ||

                project.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())

            );

        });

    }, [projects, searchTerm]);

    const stats = {

        total: projects.length,

        active: projects.filter(p => p.status === "active").length,

        completed: projects.filter(p => p.status === "completed").length,

        archived: projects.filter(p => p.status === "archived").length,

    };

    return {

        projects: filteredProjects,

        allProjectsCount: projects.length,

        stats,

        isLoading,

        error,

        isCreating,

        deletingId,

        searchTerm,

        setSearchTerm,

        refetch: fetchProjects,

        addProject,

        removeProject,

    };

}