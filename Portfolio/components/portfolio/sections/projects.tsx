"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Phone, Pill, UserCheck, Zap, ArrowUpRight } from "lucide-react"
import { SpotlightCursor } from "@/components/ui/spotlight-cursor"

const projects = [
  {
    index: "NODE_01",
    icon: Phone,
    title: "Healthcare Voice AI Agent",
    description:
      "AI that picks up calls and books appointments autonomously — functioning as a real front desk with zero human intervention.",
    chips: ["LiveKit", "n8n", "Athenahealth"],
  },
  {
    index: "NODE_02",
    icon: Pill,
    title: "Prescription Refill Agent",
    description:
      "Voice AI that handles prescription refill requests end-to-end, syncing directly with patient records without data loss.",
    chips: ["LiveKit", "Athenahealth", "Python"],
  },
  {
    index: "NODE_03",
    icon: UserCheck,
    title: "Provider Matching System",
    description:
      "Smart matching logic that pairs patients to the right doctor based on exact insurance coverage — no guessing, no manual lookups.",
    chips: ["n8n", "Athenahealth", "LLMs"],
  },
  {
    index: "NODE_04",
    icon: Zap,
    title: "Voice + Automation Workflows",
    description:
      "End-to-end pipeline connecting voice conversations to backend systems — every call instantly triggers real clinical actions.",
    chips: ["LiveKit", "n8n", "Webhooks"],
  },
]

export function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="projects" className="py-28 px-4 md:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-baseline justify-between border-b border-zinc-800 pb-4"
        >
          <div className="flex items-baseline gap-4">
            <h2 className="text-2xl text-white">NODE_WORKFLOW_V2</h2>
            <span className="font-mono text-xs text-pink-500">PROJECT_ORCHESTRATION</span>
          </div>
          <span className="hidden font-mono text-xs text-zinc-700 md:block">
            04 NODES ACTIVE
          </span>
        </motion.div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2">
          {projects.map((project, i) => {
            const Icon = project.icon
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
                className="group relative border border-zinc-900 bg-black p-8 transition-colors duration-500 hover:border-pink-500/25 hover:bg-zinc-950"
              >
                {/* Interactive cursor spotlight */}
                <SpotlightCursor size={320} />

                {/* Top accent bar */}
                <div className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-pink-500 via-pink-400 to-transparent transition-all duration-700 ease-out group-hover:w-full" />

                {/* Node index watermark */}
                <span className="absolute right-6 top-6 font-mono text-[10px] tracking-[0.2em] text-zinc-800 transition-colors duration-300 group-hover:text-zinc-700">
                  {project.index}
                </span>

                {/* Icon */}
                <div className="mb-6 flex h-11 w-11 items-center justify-center border border-zinc-800 bg-zinc-950 text-pink-500 transition-all duration-300 group-hover:border-pink-500/40 group-hover:shadow-[0_0_16px_rgba(255,0,127,0.2)]">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold leading-tight text-white">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="mb-6 text-sm leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                  {project.description}
                </p>

                {/* Footer: chips + CTA */}
                <div className="flex items-end justify-between">
                  <div className="flex flex-wrap gap-2">
                    {project.chips.map((chip) => (
                      <span
                        key={chip}
                        className="border border-zinc-800 bg-zinc-900/50 px-2 py-1 font-mono text-[10px] tracking-wider text-zinc-500 transition-colors duration-300 group-hover:border-zinc-700 group-hover:text-zinc-400"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Hover CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="ml-4 flex shrink-0 items-center gap-1 font-mono text-[10px] tracking-widest text-pink-500 opacity-0 transition-all duration-300 group-hover:opacity-100"
                  >
                    OPEN_NODE
                    <ArrowUpRight className="h-3 w-3" />
                  </motion.div>
                </div>

                {/* Bottom left scan line on hover */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-pink-500/30 to-transparent transition-all delay-100 duration-700 ease-out group-hover:w-2/3" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
