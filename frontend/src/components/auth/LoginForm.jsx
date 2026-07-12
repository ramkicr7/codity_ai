import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Mail,
    Loader2,
    ArrowRight,
    ShieldCheck
} from "lucide-react";

import { useAuth } from "./AuthContext";

const loginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
    remember: z.boolean().optional()
});

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false
        }
    });

    const remember = watch("remember");

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // DEBUG (optional)
            console.log("LOGIN PAYLOAD:", data);

            await login({
                email: data.email.trim(),
                password: data.password
            });

        } catch (err) {
            console.log("LOGIN ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* EMAIL */}
            <div>
                <label className="block text-sm text-slate-300 mb-1">
                    Email
                </label>

                <div className="relative">
                    <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            py-3
                            pl-11
                            pr-4
                            text-slate-100
                            outline-none
                            focus:border-violet-500/60
                            focus:bg-white/10
                        "
                    />
                </div>

                {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* PASSWORD (FIXED - IMPORTANT PART) */}
            <div>
                <label className="block text-sm text-slate-300 mb-1">
                    Password
                </label>

                <input
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        py-3
                        px-4
                        text-slate-100
                        outline-none
                        focus:border-violet-500/60
                        focus:bg-white/10
                    "
                />

                {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* REMEMBER */}
            <label className="flex items-center gap-2 text-slate-400 text-sm">
                <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                        setValue("remember", e.target.checked)
                    }
                />
                Remember me
            </label>

            {/* SUBMIT */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-violet-600
                    py-3
                    font-semibold
                    text-white
                    disabled:opacity-60
                "
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        Signing in...
                    </>
                ) : (
                    <>
                        Sign in
                        <ArrowRight size={18} />
                    </>
                )}
            </motion.button>

            {/* SECURITY */}
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                <ShieldCheck size={16} />
                Secure JWT Authentication
            </div>

            {/* LINK */}
            <p className="text-center text-sm text-slate-400">
                Don’t have an account?{" "}
                <Link className="text-violet-400" to="/register">
                    Create Account
                </Link>
            </p>

        </form>
    );
}