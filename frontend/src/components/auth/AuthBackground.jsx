import { motion } from "framer-motion";

export default function AuthBackground() {
  return (
    <>
      {/* Base Background */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Aurora Gradient */}
      <motion.div
        animate={{
          backgroundPosition: [
            "0% 50%",
            "100% 50%",
            "0% 50%",
          ],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          inset-0
          opacity-40
        "
        style={{
          background: `
            linear-gradient(
              -45deg,
              rgba(59,130,246,0.18),
              rgba(124,58,237,0.20),
              rgba(37,99,235,0.18),
              rgba(147,51,234,0.22)
            )
          `,
          backgroundSize: "400% 400%",
        }}
      />

      {/* Purple Orb */}
      <motion.div
        animate={{
          x: [0, 70, -40, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[-180px]
          top-[-120px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-violet-600/30
          blur-[140px]
        "
      />

      {/* Blue Orb */}
      <motion.div
        animate={{
          x: [0, -70, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-[-200px]
          bottom-[-180px]
          h-[600px]
          w-[600px]
          rounded-full
          bg-blue-600/25
          blur-[170px]
        "
      />

      {/* Center Glow */}
      <motion.div
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="
          absolute
          left-1/2
          top-1/2
          h-[700px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-purple-700/10
          blur-[180px]
        "
      />

      {/* Spotlight */}
      <div
        className="
          absolute
          inset-0
          opacity-40
        "
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,.08), transparent 65%)",
        }}
      />

      {/* Grid */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.05]
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Bottom Fade */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-72
        "
        style={{
          background:
            "linear-gradient(to top, rgba(3,7,18,1), transparent)",
        }}
      />

      {/* Top Fade */}
      <div
        className="
          absolute
          top-0
          left-0
          right-0
          h-40
        "
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,7,18,1), transparent)",
        }}
      />

      {/* Noise Texture */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.025]
          mix-blend-soft-light
        "
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />
    </>
  );
}