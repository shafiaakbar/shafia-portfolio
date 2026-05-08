"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const entries = [
  {
    period: "JUNE 2025 → PRESENT",
    role: "Forward Deployed Engineer",
    company: "KARING.AI",
    type: "FULL_TIME",
    active: true,
  },
  {
    period: "2024 → 2025",
    role: "AI Automation Engineer",
    company: "FREELANCE",
    type: "FREELANCE",
    active: false,
  },
  {
    period: "2023 → 2024",
    role: "Data Engineer Intern",
    company: "1ARCHIVER",
    type: "INTERNSHIP",
    active: false,
  },
  {
    period: "2022 → JUNE 2026",
    role: "BS Computer Science",
    company: "IOBM",
    type: "EDUCATION",
    active: false,
  },
]

const typeColors: Record<string, string> = {
  FULL_TIME:  "border-pink-500/40 text-pink-400",
  FREELANCE:  "border-zinc-600 text-zinc-400",
  INTERNSHIP: "border-zinc-600 text-zinc-400",
  EDUCATION:  "border-zinc-600 text-zinc-400",
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="logs" className="py-16 md:py-28 px-4 md:px-16">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">DEPLOY_HISTORY</h2>
          <span className="font-mono text-xs text-pink-500">MISSION_TIMELINE</span>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative pl-6 md:pl-10">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-pink-500/60 via-pink-500/20 to-transparent" />

          <div className="flex flex-col gap-12">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.company}
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative"
              >
                {/* Dot */}
                <div className={`absolute -left-[25px] md:-left-[41px] top-1.5 h-2.5 w-2.5 rounded-none border ${
                  entry.active
                    ? "border-pink-500 bg-pink-500 shadow-[0_0_12px_rgba(255,0,127,0.8)]"
                    : "border-zinc-700 bg-zinc-900"
                }`} />

                {/* Content */}
                <div className="flex flex-col gap-2">
                  {/* Period + badge row */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-pink-500/80">
                      {entry.period}
                    </span>
                    <span className={`border px-2 py-0.5 font-mono text-[9px] tracking-widest ${typeColors[entry.type]}`}>
                      {entry.type}
                    </span>
                    {entry.active && (
                      <span className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-green-400">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                        ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Role */}
                  <h3 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                    {entry.role}
                  </h3>

                  {/* Company */}
                  <p className="font-mono text-sm tracking-[0.15em] text-zinc-500">
                    {entry.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
