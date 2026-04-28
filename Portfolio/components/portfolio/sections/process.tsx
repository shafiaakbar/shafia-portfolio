"use client"

import { motion } from "framer-motion"
import { Users, Layers, Zap, FlaskConical, Rocket } from "lucide-react"
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline"

const processData = [
  {
    id: 1,
    title: "Client Intake",
    date: "Phase 01",
    content:
      "First contact — deep-dive into requirements, pain points, and success criteria before writing a single line of code.",
    category: "Discovery",
    icon: Users,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Architecture",
    date: "Phase 02",
    content:
      "System design, tech selection (LiveKit, n8n, Athenahealth), timeline estimation, and risk mapping.",
    category: "Design",
    icon: Layers,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 88,
  },
  {
    id: 3,
    title: "Build",
    date: "Phase 03",
    content:
      "Rapid implementation with daily check-ins. Voice pipelines, automation workflows, EHR integrations — shipped iteratively.",
    category: "Development",
    icon: Zap,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 72,
  },
  {
    id: 4,
    title: "Test",
    date: "Phase 04",
    content:
      "End-to-end QA on real patient flows. Edge-case handling, load testing, clinical data validation.",
    category: "QA",
    icon: FlaskConical,
    relatedIds: [3, 5],
    status: "in-progress" as const,
    energy: 55,
  },
  {
    id: 5,
    title: "Deploy",
    date: "Phase 05",
    content:
      "Production release with monitoring, rollback plan, and handoff documentation. Zero-downtime deployments.",
    category: "Release",
    icon: Rocket,
    relatedIds: [4],
    status: "pending" as const,
    energy: 35,
  },
]

export function Process() {
  return (
    <section id="process" className="py-8">
      <div className="mx-auto max-w-6xl px-4 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">DEPLOY_PROTOCOL</h2>
          <span className="font-mono text-xs text-pink-500">HOW_I_WORK</span>
        </motion.div>
      </div>
      <RadialOrbitalTimeline timelineData={processData} />
    </section>
  )
}
