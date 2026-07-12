import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    User,
    AtSign,
    Mail,
    Loader2,
    ArrowRight,
    ShieldCheck,
    Check
} from "lucide-react";


import PasswordInput from "./PasswordInput";
import { useAuth } from "./AuthContext";



const PASSWORD_RULES = [
    { id: "length", label: "8+ characters", test: (value) => value.length >= 8 },
    { id: "uppercase", label: "Uppercase letter", test: (value) => /[A-Z]/.test(value) },
    { id: "lowercase", label: "Lowercase letter", test: (value) => /[a-z]/.test(value) },
    { id: "number", label: "Number", test: (value) => /[0-9]/.test(value) },
    {
        id: "special",
        label: "Special character",
        test: (value) => /[^A-Za-z0-9]/.test(value)
    }
];

const STRENGTH_META = [
    { label: "Very weak", color: "bg-red-500", text: "text-red-400" },
    { label: "Weak", color: "bg-orange-500", text: "text-orange-400" },
    { label: "Fair", color: "bg-yellow-500", text: "text-yellow-400" },
    { label: "Good", color: "bg-blue-500", text: "text-blue-400" },
    { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" }
];

const registerSchema = z
    .object({
        first_name: z
            .string()
            .min(1, "First name is required")
            .min(2, "First name must be at least 2 characters"),

        last_name: z
            .string()
            .min(1, "Last name is required")
            .min(2, "Last name must be at least 2 characters"),

        username: z
            .string()
            .min(1, "Username is required")
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must be at most 30 characters")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores"
            ),

        email: z
            .string()
            .min(1, "Email is required")
            .email("Enter a valid email"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must include an uppercase letter")
            .regex(/[a-z]/, "Password must include a lowercase letter")
            .regex(/[0-9]/, "Password must include a number")
            .regex(/[^A-Za-z0-9]/, "Password must include a special character"),

        confirm_password: z.string().min(1, "Please confirm your password"),

        terms: z.boolean().refine((value) => value === true, {
            message: "You must accept the Terms & Conditions to continue"
        })
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"]
    });

export default function RegisterForm() {
    const { register: registerUser } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            confirm_password: "",
            terms: false
        }
    });

    const passwordValue = watch("password") || "";
    const termsAccepted = watch("terms");

    // Recomputed only when the password value changes, so typing in
    // any other field doesn't trigger unnecessary strength checks.
    const passwordStrength = useMemo(() => {
        if (!passwordValue) return { score: 0, passedRules: [] };

        const passedRules = PASSWORD_RULES.filter((rule) =>
            rule.test(passwordValue)
        );

        return { score: passedRules.length, passedRules: passedRules.map((r) => r.id) };
    }, [passwordValue]);

    const strengthMeta =
        STRENGTH_META[Math.max(passwordStrength.score - 1, 0)] ?? STRENGTH_META[0];

    const onSubmit = async (formValues) => {
        try {
            // eslint-disable-next-line no-unused-vars
            const { confirm_password, terms, ...rest } = formValues;

            await registerUser({
                ...rest,
                confirm_password: formValues.confirm_password
            });
        } catch (error) {
           
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Animated Heading */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 text-center"
            >
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Create your account
                </h1>
                <p className="mt-2 text-slate-400">
                    Start building with Codity AI in minutes.
                </p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* First Name + Last Name */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="first_name"
                            className="mb-1.5 block text-sm font-medium text-slate-300"
                        >
                            First name
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                id="first_name"
                                type="text"
                                autoComplete="given-name"
                                placeholder="Ada"
                                aria-invalid={Boolean(errors.first_name)}
                                {...register("first_name")}
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
                                    transition-all
                                    placeholder:text-slate-500
                                    focus:border-violet-500/60
                                    focus:bg-white/10
                                "
                            />
                        </div>

                        {errors.first_name && (
                            <p className="mt-1.5 text-sm text-red-400">
                                {errors.first_name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="last_name"
                            className="mb-1.5 block text-sm font-medium text-slate-300"
                        >
                            Last name
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                id="last_name"
                                type="text"
                                autoComplete="family-name"
                                placeholder="Lovelace"
                                aria-invalid={Boolean(errors.last_name)}
                                {...register("last_name")}
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
                                    transition-all
                                    placeholder:text-slate-500
                                    focus:border-violet-500/60
                                    focus:bg-white/10
                                "
                            />
                        </div>

                        {errors.last_name && (
                            <p className="mt-1.5 text-sm text-red-400">
                                {errors.last_name.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Username */}
                <div>
                    <label
                        htmlFor="username"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                        Username
                    </label>

                    <div className="relative">
                        <AtSign
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            id="username"
                            type="text"
                            autoComplete="username"
                            placeholder="ada_lovelace"
                            aria-invalid={Boolean(errors.username)}
                            {...register("username")}
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
                                transition-all
                                placeholder:text-slate-500
                                focus:border-violet-500/60
                                focus:bg-white/10
                            "
                        />
                    </div>

                    {errors.username && (
                        <p className="mt-1.5 text-sm text-red-400">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                        Email
                    </label>

                    <div className="relative">
                        <Mail
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            aria-invalid={Boolean(errors.email)}
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
                                transition-all
                                placeholder:text-slate-500
                                focus:border-violet-500/60
                                focus:bg-white/10
                            "
                        />
                    </div>

                    {errors.email && (
                        <p className="mt-1.5 text-sm text-red-400">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="password"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                        Password
                    </label>

                    <PasswordInput
                        id="password"
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        aria-invalid={Boolean(errors.password)}
                        {...register("password")}
                    />

                    {errors.password && (
                        <p className="mt-1.5 text-sm text-red-400">
                            {errors.password.message}
                        </p>
                    )}

                    {/* Password Strength Indicator */}
                    {passwordValue.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.25 }}
                            className="mt-3 space-y-2"
                        >
                            <div className="flex items-center gap-1.5">
                                {STRENGTH_META.map((meta, index) => (
                                    <div
                                        key={meta.label}
                                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                                            index < passwordStrength.score
                                                ? strengthMeta.color
                                                : "bg-white/10"
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${strengthMeta.text}`}>
                                    {strengthMeta.label}
                                </span>
                            </div>

                            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                {PASSWORD_RULES.map((rule) => {
                                    const passed = passwordStrength.passedRules.includes(
                                        rule.id
                                    );

                                    return (
                                        <li
                                            key={rule.id}
                                            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                                                passed ? "text-emerald-400" : "text-slate-500"
                                            }`}
                                        >
                                            <Check
                                                size={13}
                                                className={
                                                    passed ? "opacity-100" : "opacity-30"
                                                }
                                            />
                                            {rule.label}
                                        </li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label
                        htmlFor="confirm_password"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                        Confirm password
                    </label>

                    <PasswordInput
                        id="confirm_password"
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        aria-invalid={Boolean(errors.confirm_password)}
                        {...register("confirm_password")}
                    />

                    {errors.confirm_password && (
                        <p className="mt-1.5 text-sm text-red-400">
                            {errors.confirm_password.message}
                        </p>
                    )}
                </div>

                {/* Terms & Conditions */}
                <div>
                    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-400">
                        <input
                            type="checkbox"
                            aria-invalid={Boolean(errors.terms)}
                            {...register("terms")}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-violet-600"
                        />
                        <span>
                            I agree to the{" "}
                            <Link
                                to="/terms"
                                className="font-medium text-violet-400 transition hover:text-violet-300"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                to="/privacy"
                                className="font-medium text-violet-400 transition hover:text-violet-300"
                            >
                                Privacy Policy
                            </Link>
                        </span>
                    </label>

                    {errors.terms && (
                        <p className="mt-1.5 text-sm text-red-400">
                            {errors.terms.message}
                        </p>
                    )}
                </div>

                {/* Register Button */}
                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: "0px 0px 40px rgba(124,58,237,.45)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || !termsAccepted}
                    className="
                        group
                        relative
                        flex
                        w-full
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-2xl
                        bg-gradient-to-r
                        from-violet-600
                        via-purple-600
                        to-blue-600
                        py-4
                        font-semibold
                        text-white
                        transition-all
                        duration-300
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                    "
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 animate-spin" size={20} />
                            Creating account...
                        </>
                    ) : (
                        <>
                            Create account
                            <ArrowRight
                                size={18}
                                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </>
                    )}
                </motion.button>

                {/* Security Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-emerald-500/20
                        bg-emerald-500/5
                        py-3
                        text-sm
                        text-emerald-300
                    "
                >
                    <ShieldCheck size={17} />
                    Your data is encrypted end-to-end
                </motion.div>

                {/* Login Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <p className="text-slate-400">
                        Already have an account?
                        <Link
                            to="/login"
                            className="ml-2 font-semibold text-violet-400 transition hover:text-violet-300"
                        >
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </form>
        </div>
    );
}
