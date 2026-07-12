import api from "./api";

/* GET ALL PROJECTS */
export const getProjects = async () => {
    const response = await api.get("/projects/");
    return response.data;
};

/* CREATE PROJECT */
export const createProject = async (project) => {
    const response = await api.post("/projects/", project);
    return response.data;
};

/* UPDATE PROJECT */
export const updateProject = async (id, project) => {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
};

/* DELETE PROJECT */
export const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};