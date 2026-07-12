import { motion } from "framer-motion";
import { Cpu, Sparkles } from "lucide-react";

export default function AuthBrand() {
  return (
    <div className="flex flex-col items-center">

      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="relative"
      >
        {/* Outer Glow */}
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.45, 0.8, 0.45],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-violet-600 blur-3xl"
        />

        {/* Glass Circle */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_0_45px_rgba(124,58,237,0.45)]">

          <Cpu className="h-10 w-10 text-violet-300" />

        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.6,
        }}
        className="
          mt-7
          text-center
          text-4xl
          font-black
          tracking-tight
        "
      >
        <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
          Codity
        </span>

        <span className="ml-2 text-white">
          AI
        </span>
      </motion.h1>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.4,
        }}
        className="mt-4"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 backdrop-blur-xl">

          <Sparkles size={15} />

          Next Generation Automation Platform

        </div>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.55,
        }}
        className="
          mt-6
          max-w-sm
          text-center
          text-sm
          leading-7
          text-slate-400
        "
      >
        Build, schedule and monitor intelligent distributed jobs with
        enterprise-grade performance, security and real-time analytics.
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          delay: 0.7,
          duration: 0.7,
        }}
        className="mt-8 h-px w-full origin-center bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
      />
    </div>
  );
}