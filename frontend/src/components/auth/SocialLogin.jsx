import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";


export default function SocialLogin({
    loading = false,
    onGoogleLogin,
    onGithubLogin,
    disabled = false
}) {
    const isDisabled = disabled || loading;

    const handleGoogleClick = () => {
        if (isDisabled) return;
        onGoogleLogin?.();
    };

    const handleGithubClick = () => {
        if (isDisabled) return;
        onGithubLogin?.();
    };

    return (
        <div className="w-full">
            {/* Divider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="relative py-2"
            >
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                </div>

                <div className="relative flex justify-center">
                    <span className="bg-[#030712] px-4 text-sm text-slate-500">
                        OR CONTINUE WITH
                    </span>
                </div>
            </motion.div>

            {/* Social Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
                {/* Google Button */}
                <motion.button
                    type="button"
                    onClick={handleGoogleClick}
                    disabled={isDisabled}
                    aria-label="Continue with Google"
                    aria-busy={loading}
                    whileHover={
                        isDisabled
                            ? undefined
                            : {
                                  scale: 1.02,
                                  boxShadow: "0px 0px 24px rgba(124,58,237,.3)"
                              }
                    }
                    whileTap={isDisabled ? undefined : { scale: 0.97 }}
                    className="
                        group
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2.5
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        py-3
                        font-medium
                        text-slate-200
                        outline-none
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        focus-visible:ring-2
                        focus-visible:ring-violet-500/60
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-[#030712]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        enabled:hover:border-violet-500/40
                        enabled:hover:bg-white/10
                    "
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin text-slate-300" />
                    ) : (
                        <FcGoogle
                            size={19}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                    )}
                    Google
                </motion.button>

                {/* GitHub Button */}
                <motion.button
                    type="button"
                    onClick={handleGithubClick}
                    disabled={isDisabled}
                    aria-label="Continue with GitHub"
                    aria-busy={loading}
                    whileHover={
                        isDisabled
                            ? undefined
                            : {
                                  scale: 1.02,
                                  boxShadow: "0px 0px 24px rgba(37,99,235,.35)"
                              }
                    }
                    whileTap={isDisabled ? undefined : { scale: 0.97 }}
                    className="
                        group
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2.5
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        py-3
                        font-medium
                        text-slate-200
                        outline-none
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        focus-visible:ring-2
                        focus-visible:ring-blue-500/60
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-[#030712]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        enabled:hover:border-blue-500/40
                        enabled:hover:bg-white/10
                    "
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin text-slate-300" />
                    ) : (
                        <FaGithub
                            size={18}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                    )}
                    GitHub
                </motion.button>
            </motion.div>
        </div>
    );
}