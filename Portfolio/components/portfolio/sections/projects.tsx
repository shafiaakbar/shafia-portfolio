"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Phone, Pill, UserCheck, Zap, ArrowUpRight } from "lucide-react"
import { TextRotate, type TextRotateRef } from "@/components/ui/text-rotate"
import { SpotlightCursor } from "@/components/ui/spotlight-cursor"

const projects = [
  {
    index: "01",
    total: "04",
    icon: Phone,
    title: "Healthcare Voice AI Agent",
    label: "AUTONOMOUS SCHEDULING",
    description:
      "AI that picks up calls and books appointments autonomously — functioning as a real front desk with zero human intervention.",
    chips: ["LiveKit", "n8n", "Athenahealth"],
  },
  {
    index: "02",
    total: "04",
    icon: Pill,
    title: "Prescription Refill Agent",
    label: "MEDICATION WORKFLOWS",
    description:
      "Voice AI that handles prescription refill requests end-to-end, syncing directly with patient records without data loss.",
    chips: ["LiveKit", "Athenahealth", "Python"],
  },
  {
    index: "03",
    total: "04",
    icon: UserCheck,
    title: "Provider Matching System",
    label: "INTELLIGENT ROUTING",
    description:
      "Smart matching logic that pairs patients to the right doctor based on exact insurance coverage — no guessing, no manual lookups.",
    chips: ["n8n", "Athenahealth", "LLMs"],
  },
  {
    index: "04",
    total: "04",
    icon: Zap,
    title: "Voice + Automation Workflows",
    label: "END-TO-END PIPELINES",
    description:
      "End-to-end pipeline connecting voice conversations to backend systems — every call instantly triggers real clinical actions.",
    chips: ["LiveKit", "n8n", "Webhooks"],
  },
]

function ProjectCard({
  project,
  index,
  onInView,
}: {
  project: (typeof projects)[0]
  index: number
  onInView: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" })
  const Icon = project.icon

  useEffect(() => {
    if (isInView) onInView(index)
  }, [isInView, index, onInView])

  return (
    <div
      ref={ref}
      className="flex h-[80vh] items-center justify-center px-4 md:px-10"
    >
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="group relative w-full max-w-sm border border-zinc-900 bg-black p-8 transition-colors duration-500 hover:border-pink-500/25 hover:bg-zinc-950"
      >
        <SpotlightCursor size={280} />

        {/* Top accent bar */}
        <div className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-pink-500 via-pink-400 to-transparent transition-all duration-700 ease-out group-hover:w-full" />

        {/* Index watermark */}
        <span className="absolute right-5 top-5 font-mono text-[10px] tracking-[0.2em] text-zinc-800 transition-colors group-hover:text-zinc-700">
          NODE_{project.index}
        </span>

        {/* Icon */}
        <div className="mb-6 flex h-11 w-11 items-center justify-center border border-zinc-800 bg-zinc-950 text-pink-500 transition-all duration-300 group-hover:border-pink-500/40 group-hover:shadow-[0_0_16px_rgba(255,0,127,0.2)]">
          <Icon className="h-5 w-5" />
        </div>

        {/* Label */}
        <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-pink-500/60">
          {project.label}
        </p>

        {/* Description */}
        <p className="mb-6 text-sm leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
          {project.description}
        </p>

        {/* Footer */}
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
          <div className="ml-4 flex shrink-0 items-center gap-1 font-mono text-[10px] tracking-widest text-pink-500 opacity-0 transition-all duration-300 group-hover:opacity-100">
            OPEN <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>

        {/* Bottom scan line */}
        <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-pink-500/30 to-transparent transition-all delay-100 duration-700 ease-out group-hover:w-2/3" />
      </motion.div>
    </div>
  )
}

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const titleRef = useRef<TextRotateRef>(null)
  const descRef = useRef<TextRotateRef>(null)

  const handleInView = useCallback((index: number) => {
    setActiveIndex(index)
    titleRef.current?.jumpTo(index)
    descRef.current?.jumpTo(index)
  }, [])

  const activeProject = projects[activeIndex]

  return (
    <section id="projects" className="relative">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl px-4 pt-24 pb-4 md:px-10"
      >
        <div className="flex items-baseline justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-baseline gap-4">
            <h2 className="text-2xl text-white">NODE_WORKFLOW_V2</h2>
            <span className="font-mono text-xs text-pink-500">PROJECT_ORCHESTRATION</span>
          </div>
          <span className="hidden font-mono text-xs text-zinc-700 md:block">
            04 NODES ACTIVE
          </span>
        </div>
      </motion.div>

      {/* Desktop: sticky left + scrollable right */}
      <div className="hidden md:flex">
        {/* Sticky left panel */}
        <div className="sticky top-0 flex h-screen w-1/2 flex-col justify-center px-10 lg:px-16">
          {/* Counter */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mb-4 font-mono text-xs tracking-[0.3em] text-zinc-600"
            >
              {activeProject.index} / {activeProject.total} —{" "}
              <span className="text-pink-500/60">{activeProject.label}</span>
            </motion.p>
          </AnimatePresence>

          {/* Rotating title */}
          <div className="mb-6 overflow-hidden">
            <TextRotate
              ref={titleRef}
              texts={projects.map((p) => p.title)}
              auto={false}
              loop={false}
              splitBy="characters"
              staggerFrom="first"
              staggerDuration={0.018}
              animatePresenceMode="wait"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              mainClassName="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight"
              splitLevelClassName="overflow-hidden pb-1"
            />
          </div>

          {/* Rotating description */}
          <div className="mb-8 max-w-sm overflow-hidden">
            <TextRotate
              ref={descRef}
              texts={projects.map((p) => p.description)}
              auto={false}
              loop={false}
              splitBy="words"
              staggerFrom="first"
              staggerDuration={0.01}
              animatePresenceMode="wait"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              mainClassName="text-sm leading-relaxed text-zinc-500 flex-wrap"
            />
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-3">
            {projects.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === activeIndex ? 24 : 6,
                  backgroundColor:
                    i === activeIndex
                      ? "rgb(236 72 153)"
                      : "rgb(39 39 42)",
                }}
                transition={{ duration: 0.3 }}
                className="h-[2px] rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Scrollable right panel */}
        <div className="w-1/2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.index}
              project={project}
              index={i}
              onInView={handleInView}
            />
          ))}
          {/* Extra padding so last card can reach center */}
          <div className="h-[20vh]" />
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="block px-4 pb-16 md:hidden">
        <div className="mb-8 overflow-hidden">
          <TextRotate
            ref={titleRef}
            texts={projects.map((p) => p.title)}
            auto={true}
            loop={true}
            rotationInterval={2800}
            splitBy="characters"
            staggerFrom="first"
            staggerDuration={0.015}
            animatePresenceMode="wait"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            mainClassName="text-2xl font-black text-white leading-tight"
            splitLevelClassName="overflow-hidden pb-1"
          />
        </div>

        <div className="flex flex-col gap-4">
          {projects.map((project, i) => {
            const Icon = project.icon
            return (
              <motion.div
                key={project.index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative border border-zinc-900 bg-black p-6 hover:border-pink-500/25"
              >
                <SpotlightCursor size={240} />
                <div className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-pink-500 to-transparent transition-all duration-700 group-hover:w-full" />
                <div className="mb-4 flex h-9 w-9 items-center justify-center border border-zinc-800 bg-zinc-950 text-pink-500">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mb-1 font-mono text-[9px] tracking-widest text-pink-500/60">{project.label}</p>
                <h3 className="mb-2 font-bold text-white">{project.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-zinc-500">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.chips.map((chip) => (
                    <span key={chip} className="border border-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-600">
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
