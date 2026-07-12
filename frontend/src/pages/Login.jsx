import { motion } from "framer-motion";
import AuthBackground from "../components/auth/AuthBackground";
import AuthBrand from "../components/auth/AuthBrand";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712]">
      {/* Animated Background */}
      <AuthBackground />

      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[180px]" />

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(124,58,237,0.25)]">
            <div className="p-10">
              <AuthBrand />

              <div className="mt-8">
                <LoginForm />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}