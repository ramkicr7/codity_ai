import api from "./api";

/* ---------------- REGISTER ---------------- */

export const registerUser = async (data) => {
    return await api.post("/auth/register", data);
};

/* ---------------- LOGIN ---------------- */

export const loginUser = async (credentials) => {
    console.log("LOGIN REQUEST:", credentials);

    return await api.post("/auth/login", credentials);
};

/* ---------------- LOGOUT ---------------- */

export const logoutUser = async () => {
    return await api.post("/auth/logout");
};

/* ---------------- CURRENT USER ---------------- */

export const getCurrentUser = async () => {
    return await api.get("/auth/me");
};

/* ---------------- REFRESH ---------------- */

export const refreshToken = async () => {
    return await api.post("/auth/refresh");
};