import { Navigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../components/auth/AuthContext";


function AuthenticatingScreen() {
    return (
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#030712]">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-40 right-1/3 h-[380px] w-[380px] rounded-full bg-blue-600/20 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/5 px-10 py-9 backdrop-blur-xl"
                role="status"
                aria-live="polite"
            >
                <div className="relative flex h-14 w-14 items-center justify-center">
                    <motion.span
                        className="absolute inset-0 rounded-full border-2 border-white/10"
                        aria-hidden="true"
                    />
                    <motion.span
                        className="absolute inset-0 rounded-full border-2 border-t-violet-500 border-r-blue-500 border-b-transparent border-l-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        aria-hidden="true"
                    />
                </div>

                <p className="text-sm font-medium tracking-wide text-slate-300">
                    Authenticating...
                </p>
            </motion.div>
        </div>
    );
}


export default function PublicRoute() {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return <AuthenticatingScreen />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}