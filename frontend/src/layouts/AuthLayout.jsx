import { motion } from "framer-motion";
import AuthBackground from "../components/auth/AuthBackground";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

      {/* Animated Background */}
      <AuthBackground />

      {/* Purple Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[180px]" />

      {/* Blue Glow */}
      <div className="pointer-events-none absolute right-[-180px] top-[-120px] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[160px]" />

      {/* Bottom Glow */}
      <div className="pointer-events-none absolute bottom-[-250px] left-[-150px] h-[500px] w-[500px] rounded-full bg-purple-700/10 blur-[180px]" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-6 py-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="w-full max-w-md"
        >

          {/* Glass Card */}
          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-2xl
              shadow-[0_25px_80px_rgba(76,29,149,.45)]
            "
          >
            <div className="p-10">

              {children}

            </div>
          </div>

        </motion.div>

      </div>

    </div>
  );
}