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

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

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
          <h2 className="text-2xl text-white">DEPLOY_HISTORY</h2>
          <span className="font-mono text-xs text-pink-500">MISSION_TIMELINE</span>
        </motion.div>

        <div ref={ref} className="ml-3 space-y-10 border-l border-pink-500/20 pl-8">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.company}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              <div
                className={`absolute -left-[41px] top-1 h-3 w-3 border ${
                  entry.active
                    ? "border-pink-500 bg-pink-500 shadow-[0_0_10px_rgba(255,0,127,0.8)]"
                    : "border-zinc-700 bg-black"
                }`}
              />
              <p className="mb-1 font-mono text-[10px] tracking-widest text-pink-500">
                {entry.period}
              </p>
              <h3 className="text-base font-bold text-white">{entry.role}</h3>
              <p className="font-mono text-xs tracking-widest text-zinc-500">{entry.company}</p>
              <span className="mt-2 inline-block border border-zinc-800 px-2 py-0.5 font-mono text-[9px] tracking-widest text-zinc-600">
                {entry.type}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
