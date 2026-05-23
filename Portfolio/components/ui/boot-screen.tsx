"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LINES = [
  { text: "> initializing portfolio_v4.0...", color: "text-pink-500/60" },
  { text: "> loading architect data...",      color: "text-pink-500/60" },
  { text: "> mounting voice agents...",       color: "text-pink-500/60" },
  { text: "> connecting neural network...",   color: "text-pink-500/60" },
  { text: "> SYSTEM ONLINE ✓",               color: "text-pink-400" },
]

export function BootScreen() {
  const [show, setShow] = useState(false)
  const [lines, setLines] = useState<number[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("sb_booted")) return
    setShow(true)

    let i = 0
    const interval = setInterval(() => {
      setLines((prev) => [...prev, i])
      i++
      if (i >= LINES.length) {
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          setTimeout(() => {
            sessionStorage.setItem("sb_booted", "1")
            setShow(false)
          }, 400)
        }, 500)
      }
    }, 320)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black"
          animate={done ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Scan line — y transform (composited, no layout) */}
          <motion.div
            className="absolute left-0 top-0 h-px w-full bg-pink-500/20"
            animate={{ y: ["0vh", "100vh"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
          />

          <div className="w-72 space-y-1.5 font-mono text-sm">
            <p className="mb-4 font-mono text-xs tracking-[0.3em] text-pink-500/40">
              SB_PORTFOLIO · BOOT SEQUENCE
            </p>
            {LINES.map((line, i) => (
              <motion.p
                key={i}
                className={lines.includes(i) ? line.color : "opacity-0"}
                initial={{ opacity: 0, x: -6 }}
                animate={lines.includes(i) ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.2 }}
              >
                {line.text}
              </motion.p>
            ))}
            {/* Blinking cursor — CSS animation, zero JS overhead */}
            {!done && lines.length > 0 && (
              <span className="inline-block text-pink-500" style={{ animation: "bootBlink 0.8s step-start infinite" }}>
                █
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
