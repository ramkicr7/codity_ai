import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./components/auth/AuthContext";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import DashboardLayout from "./layouts/DashboardLayout.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";

/* ================= PAGES ================= */
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Jobs from "./pages/Jobs.jsx";
import Workers from "./pages/Workers.jsx";
import Queues from "./pages/Queues.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: "#0f172a",
                            color: "#fff",
                            border: "1px solid rgba(124,58,237,.3)",
                        },
                    }}
                />

                <Routes>

                    {/* ================= PUBLIC ROUTES ================= */}

                    <Route element={<PublicRoute />}>

                        <Route
                            path="/"
                            element={<Navigate to="/login" replace />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                    </Route>

                    {/* ================= PROTECTED ROUTES ================= */}

                    <Route element={<ProtectedRoute />}>

                        <Route element={<DashboardLayout />}>

                            {/* Dashboard */}
                            <Route
                                path="/dashboard"
                                element={<Dashboard />}
                            />

                            {/* Projects */}
                            <Route
                                path="/projects"
                                element={<Projects />}
                            />

                            {/* Jobs */}
                            <Route
                                path="/jobs"
                                element={<Jobs />}
                            />

                            {/* Queues */}
                            <Route
                                path="/queues"
                                element={<Queues />}
                            />

                            {/* Workers */}
                            <Route
                                path="/workers"
                                element={<Workers />}
                            />

                            {/* Analytics */}
                            <Route
                                path="/analytics"
                                element={<Analytics />}
                            />

                            {/* Settings */}
                            <Route
                                path="/settings"
                                element={<Settings />}
                            />

                            {/* Profile */}
                            <Route
                                path="/profile"
                                element={<Profile />}
                            />

                        </Route>

                    </Route>

                    {/* ================= 404 ================= */}

                    <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                    />

                </Routes>

            </AuthProvider>
        </BrowserRouter>
    );
}