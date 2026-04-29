"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

// Each line is an array of segments: { t: text, c: color-key }
// Colors: "cmd" dim-pink | "pink" bright pink | "white" bright white | "dim" zinc-600 | "mid" zinc-400
type Seg = { t: string; c?: "cmd" | "pink" | "white" | "dim" | "mid" }
type Line = Seg[] | null // null = blank line

const LINES: Line[] = [
  // ── Init ──────────────────────────────────────────────────────────────────
  [{ t: "> ", c: "pink" }, { t: "Initializing Architect Data...", c: "cmd" }],
  null,
  // ── Identity ──────────────────────────────────────────────────────────────
  [
    { t: "> ", c: "pink" },
    { t: "Shafia B", c: "white" },
    { t: ", " },
    { t: "Forward Deployed Engineer", c: "pink" },
    { t: " @ " },
    { t: "Karing.ai", c: "white" },
  ],
  [
    { t: "> ", c: "pink" },
    { t: "Builds healthcare voice agents that have handled " },
    { t: "400k+ real calls", c: "pink" },
  ],
  null,
  // ── Why Shafia ─────────────────────────────────────────────────────────────
  [{ t: "> ", c: "pink" }, { t: "Why Shafia?", c: "white" }],
  [
    { t: "  - ", c: "pink" },
    { t: "Takes projects from " },
    { t: '"idea..."', c: "dim" },
    { t: " to " },
    { t: '"it\'s live btw"', c: "pink" },
  ],
  [
    { t: "  - ", c: "pink" },
    { t: "Works directly with clients" },
    { t: " — no middle drama", c: "white" },
  ],
  [
    { t: "  - ", c: "pink" },
    { t: "Saves lives", c: "white" },
    { t: " and money" },
  ],
  null,
  // ── Side Quest ─────────────────────────────────────────────────────────────
  [{ t: "> ", c: "pink" }, { t: "Side Quest:", c: "white" }],
  [
    { t: "  - ", c: "pink" },
    { t: "BuyBestie", c: "pink" },
    { t: ", a white-glove shopping" },
    { t: ", but actually reliable", c: "white" },
  ],
  null,
  // ── Education ──────────────────────────────────────────────────────────────
  [
    { t: "> ", c: "pink" },
    { t: "BSCS @ IOBM, " },
    { t: "June 2026", c: "white" },
    { t: " (almost there…)", c: "cmd" },
  ],
  null,
  // ── Status ─────────────────────────────────────────────────────────────────
  [
    { t: "> ", c: "pink" },
    { t: "Status:  " },
    { t: "Deployed. Iterating. Building in production.", c: "pink" },
  ],
]

const COLOR: Record<string, string> = {
  cmd:   "text-pink-500/50",
  pink:  "text-pink-400",
  white: "text-white font-medium",
  dim:   "text-zinc-600 italic",
  mid:   "text-zinc-400",
  default: "text-zinc-500",
}

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  // Flatten for delay calculation (blank lines still count as a beat)
  let lineIdx = 0

  return (
    <section id="logs" className="py-28 px-4 md:px-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">MISSION_LOG</h2>
          <span className="font-mono text-xs text-pink-500">ARCHITECT_BIO</span>
        </motion.div>

        <div
          ref={ref}
          className="relative overflow-hidden border border-zinc-900 bg-zinc-950/50 p-8 font-mono text-sm leading-relaxed"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,127,0.025),transparent)]" />

          <div className="space-y-[6px]">
            {LINES.map((line, i) => {
              const delay = lineIdx * 0.1
              lineIdx++

              if (line === null) {
                return <div key={i} className="h-2" />
              }

              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay }}
                >
                  {line.map((seg, j) => (
                    <span key={j} className={COLOR[seg.c ?? "default"]}>
                      {seg.t}
                    </span>
                  ))}
                </motion.p>
              )
            })}

            {/* Blinking cursor */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: lineIdx * 0.1 }}
              className="animate-pulse text-pink-500"
            >
              &gt; █
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
