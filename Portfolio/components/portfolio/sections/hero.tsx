"use client"

import { motion } from "framer-motion"
import { SplineScene } from "@/components/ui/splite"

export function Hero() {
  return (
    <section id="core" className="relative min-h-screen">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-pink-500 opacity-[0.07] blur-[140px]" />
      </div>

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center px-8 py-24 pt-28 md:px-16 gap-7 relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex w-fit items-center gap-2 border border-pink-500/30 bg-pink-500/5 px-3 py-1 font-mono text-xs tracking-widest text-pink-500"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
            </span>
            SYSTEM_ACTIVE // V4.0.2
          </motion.div>

          {/* Name */}
          <div>
            {["SHAFIA", "BAHAR"].map((word, i) => (
              <motion.h1
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.25 + i * 0.12 }}
                className="text-6xl font-black leading-none tracking-wider text-white md:text-7xl"
              >
                {word}
              </motion.h1>
            ))}
          </div>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.52 }}
            className="font-mono text-sm tracking-[0.3em] text-pink-500"
          >
            FORWARD DEPLOYED AI ENGINEER
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.62 }}
            className="max-w-md border-l-2 border-zinc-800 pl-4 leading-relaxed text-zinc-400"
          >
            Building voice-first AI systems and autonomous healthcare workflows
            at the intersection of LLMs and real-world operations.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.72 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <button
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-pink-600 px-6 py-3 text-sm font-semibold tracking-widest text-black shadow-[0_0_18px_rgba(255,0,127,0.35)] transition hover:bg-pink-500"
            >
              VIEW_PROJECTS
            </button>
            <button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="border border-pink-500 px-6 py-3 text-sm font-semibold tracking-widest text-pink-500 transition hover:bg-pink-500/10"
            >
              CONTACT
            </button>
          </motion.div>
        </motion.div>

        {/* Right — Spline 3D */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="relative hidden md:block"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,0,127,0.07),transparent_70%)]" />
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
          <p className="absolute bottom-4 left-4 font-mono text-[10px] text-pink-500/30">
            RENDER_ENGINE: NEURAL_VIZ_4 // COORD: 45.23.001.X9
          </p>
        </motion.div>
      </div>
    </section>
  )
}
