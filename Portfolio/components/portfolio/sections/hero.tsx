"use client"

import { useCallback, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff } from "lucide-react"
import { SplineScene } from "@/components/ui/splite"
import { LiquidButton } from "@/components/ui/liquid-glass-button"

export function Hero() {
  const splineRef = useRef<any>(null)
  const [talking, setTalking] = useState(false)

  const handleSplineLoad = useCallback((spline: any) => {
    splineRef.current = spline
  }, [])

  function triggerRobotTalk() {
    setTalking((v) => !v)
    if (splineRef.current) {
      try {
        // Try common names used in Spline hero robot scenes
        splineRef.current.emitEvent("mouseDown", "Robot")
        splineRef.current.emitEvent("mouseDown", "Scene")
      } catch {}
    }
  }

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
            <LiquidButton
              size="lg"
              onClick={triggerRobotTalk}
              className={`font-mono tracking-widest transition-all duration-300 ${
                talking
                  ? "text-pink-300 shadow-[0_0_24px_rgba(255,0,127,0.45)]"
                  : "text-pink-400 shadow-[0_0_18px_rgba(255,0,127,0.25)]"
              }`}
            >
              <span className="flex items-center gap-2">
                {talking ? (
                  <MicOff className="h-3.5 w-3.5" />
                ) : (
                  <Mic className="h-3.5 w-3.5" />
                )}
                {talking ? "END_CALL" : "TALK_TO_ME"}
              </span>
            </LiquidButton>

            <LiquidButton
              size="lg"
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-mono tracking-widest text-zinc-300"
            >
              VIEW_PROJECTS
            </LiquidButton>
          </motion.div>

          {/* Talking state indicator */}
          {talking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 font-mono text-xs text-pink-500/70"
            >
              <span className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block w-0.5 rounded-full bg-pink-500"
                    animate={{ height: ["6px", "18px", "6px"] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                    style={{ height: "6px" }}
                  />
                ))}
              </span>
              VOICE_CHANNEL_OPEN // CONNECTING...
            </motion.div>
          )}
        </motion.div>

        {/* Right — Spline 3D */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="relative hidden md:block"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,0,127,0.07),transparent_70%)]" />

          {/* Float wrapper */}
          <motion.div
            className="h-full w-full"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="h-full w-full"
              onLoad={handleSplineLoad}
            />
          </motion.div>

          {/* Talking ring pulse around robot */}
          {talking && (
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[1, 1.4, 1.8].map((scale, i) => (
                <motion.div
                  key={i}
                  className="absolute h-48 w-48 rounded-full border border-pink-500/20"
                  animate={{ scale: [scale, scale + 0.3, scale], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          )}

          <p className="absolute bottom-4 left-4 font-mono text-[10px] text-pink-500/30">
            RENDER_ENGINE: NEURAL_VIZ_4 // COORD: 45.23.001.X9
          </p>
        </motion.div>
      </div>
    </section>
  )
}
