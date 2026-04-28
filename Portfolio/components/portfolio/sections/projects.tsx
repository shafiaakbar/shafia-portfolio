"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Phone, Pill, UserCheck, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"

const projects = [
  {
    icon: Phone,
    title: "Healthcare Voice AI Agent",
    description:
      "AI that picks up calls and books appointments autonomously — functioning as a real front desk with zero human intervention.",
    chips: ["LiveKit", "n8n", "Athenahealth"],
  },
  {
    icon: Pill,
    title: "Prescription Refill Agent",
    description:
      "Voice AI that handles prescription refill requests end-to-end, syncing directly with patient records without data loss.",
    chips: ["LiveKit", "Athenahealth", "Python"],
  },
  {
    icon: UserCheck,
    title: "Provider Matching System",
    description:
      "Smart matching logic that pairs patients to the right doctor based on exact insurance coverage — no guessing, no manual lookups.",
    chips: ["n8n", "Athenahealth", "LLMs"],
  },
  {
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">NODE_WORKFLOW_V2</h2>
          <span className="font-mono text-xs text-pink-500">PROJECT_ORCHESTRATION</span>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 gap-px bg-zinc-900 md:grid-cols-2">
          {projects.map((project, i) => {
            const Icon = project.icon
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <Card className="group relative h-full overflow-hidden rounded-none border-zinc-900 bg-black transition-all duration-300 hover:border-pink-500/40">
                  <Spotlight
                    className="-left-10 -top-10 md:-left-6 md:-top-6"
                    fill="rgba(255, 0, 127, 0.12)"
                  />
                  <CardContent className="space-y-4 p-8">
                    <div className="flex h-10 w-10 items-center justify-center border border-zinc-800 bg-zinc-900 text-pink-500 transition group-hover:border-pink-500/40 group-hover:shadow-[0_0_10px_rgba(255,0,127,0.25)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-500">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.chips.map((chip) => (
                        <span
                          key={chip}
                          className="border border-zinc-800 bg-zinc-900/50 px-2 py-1 font-mono text-[10px] tracking-wider text-zinc-400"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
