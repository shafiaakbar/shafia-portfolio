"use client"

import { useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { SplineScene } from "@/components/ui/splite"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { useVapi } from "@/hooks/use-vapi"

const STATUS_LABEL: Record<string, string> = {
  idle: "",
  connecting: "ESTABLISHING_UPLINK...",
  active: "VOICE_CHANNEL_OPEN",
  ending: "TERMINATING_SESSION...",
  error: "CONNECTION_FAILED",
}

export function Hero() {
  const splineRef = useRef<any>(null)
  const { status, volume, isSpeaking, errorMsg, toggle } = useVapi()

  const handleSplineLoad = useCallback((spline: any) => {
    splineRef.current = spline
  }, [])

  const isLive = status === "active" || status === "connecting"
  const isError = status === "error"

  function handleTalkClick() {
    toggle()
    if (splineRef.current) {
      try {
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
              onClick={handleTalkClick}
              disabled={status === "connecting" || status === "ending"}
              className={`font-mono tracking-widest transition-all duration-300 disabled:opacity-60 ${
                isLive
                  ? "text-pink-300 shadow-[0_0_28px_rgba(255,0,127,0.5)]"
                  : "text-pink-400 shadow-[0_0_18px_rgba(255,0,127,0.25)]"
              }`}
            >
              <span className="flex items-center gap-2">
                {status === "connecting" || status === "ending" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : status === "active" ? (
                  <MicOff className="h-3.5 w-3.5" />
                ) : (
                  <Mic className="h-3.5 w-3.5" />
                )}
                {status === "active" ? "END_CALL" : status === "connecting" ? "CONNECTING..." : "TALK_TO_ME"}
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

          {/* Error display */}
          {isError && errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs text-red-400/80"
            >
              ✕ {errorMsg}
            </motion.div>
          )}

          {/* Live voice indicator */}
          {isLive && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 font-mono text-xs text-pink-500/70"
            >
              {/* Volume-driven waveform bars */}
              <span className="flex items-end gap-[3px]">
                {[0.4, 0.7, 1, 0.7, 0.5, 0.85, 0.6, 0.4, 0.9, 0.55].map((base, i) => {
                  const h = status === "active" ? Math.max(4, (volume * base * 28) + 4) : 4
                  return (
                    <motion.span
                      key={i}
                      className="inline-block w-[3px] rounded-full bg-pink-500"
                      animate={{ height: `${h}px` }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      style={{ height: "4px" }}
                    />
                  )
                })}
              </span>
              {STATUS_LABEL[status]}
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

          {/* Float wrapper — bobs faster when speaking */}
          <motion.div
            className="h-full w-full"
            animate={{ y: [0, -14, 0] }}
            transition={{
              duration: isSpeaking ? 1.8 : 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="h-full w-full"
              onLoad={handleSplineLoad}
            />
          </motion.div>

          {/* Pulsing rings — volume-driven scale */}
          {isLive && (
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute h-48 w-48 rounded-full border border-pink-500/25"
                  animate={{
                    scale: [1 + i * 0.35, 1 + i * 0.35 + 0.25 + volume * 0.5, 1 + i * 0.35],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: isSpeaking ? 0.8 : 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
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
