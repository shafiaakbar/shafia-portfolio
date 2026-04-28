"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ArrowRight, Mail } from "lucide-react"

import { NodeProjectGraph } from "@/components/portfolio/node-project-graph"

const HeroRobotScene = dynamic(
  () => import("@/components/portfolio/hero-robot-scene").then((m) => m.HeroRobotScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-[64vh] min-h-[480px] w-full animate-pulse rounded-3xl border border-white/10 bg-black/40" />
    ),
  }
)

const modules = [
  "Voice AI",
  "Agent Orchestration",
  "System Design",
  "Workflow Automation",
  "Observability",
  "Prompt Engineering",
]

export function InteractivePortfolio() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a11] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_15%_20%,rgba(55,93,255,0.25),transparent_35%),radial-gradient(circle_at_85%_65%,rgba(56,189,248,0.2),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(11,16,28,0.7)_100%)]" />

      <section className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 py-20 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="mb-10 space-y-6"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-sky-300/90">
            AI Engineer / Forward Deployed Engineer
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
            Building intelligent systems that think, adapt, and execute.
          </h1>
          <p className="max-w-2xl text-base text-white/75 md:text-lg">
            I design automation-first products with voice AI, robust pipelines,
            and production-ready architecture.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-sky-200"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-medium text-white/90 transition hover:bg-white/10"
            >
              Contact
            </a>
          </div>
        </motion.div>

        <HeroRobotScene />
      </section>

      <section id="projects" className="relative mx-auto max-w-7xl px-6 py-16 md:px-10">
        <NodeProjectGraph />
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
        >
          <h2 className="text-2xl font-semibold md:text-3xl">Skills as Modules</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {modules.map((module) => (
              <span
                key={module}
                className="rounded-full border border-sky-300/35 bg-sky-300/10 px-3 py-1.5 text-xs tracking-wide text-sky-100"
              >
                {module}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
        >
          <h2 className="text-2xl font-semibold md:text-3xl">Experience Flow</h2>
          <p className="mt-4 text-sm text-white/75">
            From prototyping AI interfaces to deploying orchestration layers, I
            focus on reliable automation, measurable outcomes, and human-centered
            interactions.
          </p>
          <div className="mt-6 h-1 w-full rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-300 to-indigo-400"
              initial={{ width: "20%" }}
              whileInView={{ width: "88%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            />
          </div>
        </motion.div>
      </section>

      <section id="contact" className="relative mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-10">
        <div className="rounded-2xl border border-white/15 bg-[#0e1525] p-8">
          <h2 className="text-3xl font-semibold">Let&apos;s Build Something Intelligent</h2>
          <p className="mt-3 max-w-2xl text-white/75">
            If you&apos;re designing AI products, workflow platforms, or automation
            systems, I can help architect and ship the experience end-to-end.
          </p>
          <a
            href="mailto:shafia@example.com"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
          >
            <Mail className="h-4 w-4" /> shafia@example.com
          </a>
        </div>
      </section>
    </main>
  )
}
