"use client"

import { useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { SplineScene } from "@/components/ui/splite"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { Magnetic } from "@/components/ui/magnetic"
import { ScrambleText } from "@/components/ui/scramble-text"
import { useElevenLabs } from "@/hooks/use-elevenlabs"
import { getLenis } from "@/lib/lenis"

const STATUS_LABEL: Record<string, string> = {
  idle: "",
  connecting: "ESTABLISHING_UPLINK...",
  active: "VOICE_CHANNEL_OPEN",
  ending: "TERMINATING_SESSION...",
  error: "CONNECTION_FAILED",
}

export function Hero() {
  const splineRef = useRef<any>(null)
  const { status, volume, isSpeaking, errorMsg, toggle } = useElevenLabs()

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
    <section id="core" className="relative min-h-screen overflow-hidden">
      {/* Background glow — centered */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500 opacity-[0.07] blur-[160px]" />
      </div>

      {/* Full-screen robot — centered, mouse-interactive */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute inset-0"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,0,127,0.07),transparent_70%)]" />

        <div
          className="h-full w-full hero-float"
          style={{ "--float-dur": isSpeaking ? "1.8s" : "5s" } as React.CSSProperties}
        >
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
            onLoad={handleSplineLoad}
          />
        </div>

        {/* Pulse rings when live */}
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
      </motion.div>

      {/* Bottom gradient so text stays readable */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Bottom bar — text left, buttons right */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-8 pb-8 md:px-14 md:pb-12">

        {/* Left: name + title + voice feedback */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-1.5"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-mono text-lg tracking-widest text-zinc-300 font-semibold"
          >
            Hi,
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
            className="text-5xl font-black leading-none tracking-tight md:text-7xl"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <ScrambleText
              text="Shafia here."
              delay={0.3}
              speed={35}
              charDelay={2}
              style={{
                backgroundImage: "linear-gradient(90deg, #ff007f, #ffffff, #ff007f)",
                backgroundSize: "200% auto",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradient-sweep 4s linear infinite",
              }}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="font-mono text-sm tracking-[0.2em] text-pink-400 font-bold md:text-base"
          >
            <ScrambleText
              text="FORWARD DEPLOYED ENGINEER"
              delay={1.4}
              speed={30}
              charDelay={1}
              className="text-pink-400"
            />
          </motion.p>

          {isError && errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs text-red-400/80"
            >
              ✕ {errorMsg}
            </motion.div>
          )}

          {isLive && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 font-mono text-xs text-pink-500/70"
            >
              <span className="flex items-end gap-[3px]">
                {[0.4, 0.7, 1, 0.7, 0.5, 0.85, 0.6, 0.4, 0.9, 0.55].map((base, i) => {
                  const h = status === "active" ? Math.max(4, volume * base * 28 + 4) : 4
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

        {/* Right: CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.72 }}
          className="flex flex-col items-end gap-3"
        >
          <Magnetic>
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
          </Magnetic>

          <Magnetic>
            <LiquidButton
              size="lg"
              onClick={() => {
                const el = document.getElementById("agents")
                if (!el) return
                const lenis = getLenis()
                lenis ? lenis.scrollTo(el, { offset: 0 }) : el.scrollIntoView({ behavior: "smooth" })
              }}
              className="font-mono tracking-widest text-zinc-300"
            >
              VIEW_PROJECTS
            </LiquidButton>
          </Magnetic>
        </motion.div>
      </div>

    </section>
  )
}
