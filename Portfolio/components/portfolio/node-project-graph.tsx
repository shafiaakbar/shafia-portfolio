"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, Cpu, Workflow } from "lucide-react"

type ProjectNode = {
  id: string
  title: string
  summary: string
  tools: string[]
  architecture: string
  outcome: string
  x: number
  y: number
}

const nodes: ProjectNode[] = [
  {
    id: "voice-ai",
    title: "Voice AI Orchestrator",
    summary: "Pipeline for streaming speech, intent, and response actions.",
    tools: ["LiveKit", "Whisper", "LangChain", "FastAPI"],
    architecture: "Edge ASR -> intent router -> memory layer -> synthesis",
    outcome: "Reduced latency to near real-time with resilient fallback flows.",
    x: 8,
    y: 14,
  },
  {
    id: "agentops",
    title: "AgentOps Automation",
    summary: "Autonomous monitoring and issue triage for distributed services.",
    tools: ["n8n", "Sentry", "Datadog", "OpenTelemetry"],
    architecture: "Signals -> event graph -> priority engine -> action queues",
    outcome: "Cut manual triage effort by 40% and improved incident visibility.",
    x: 36,
    y: 44,
  },
  {
    id: "lab-stack",
    title: "AI Lab Deployment Stack",
    summary: "Developer platform for rapid model releases and experiments.",
    tools: ["Next.js", "Kubernetes", "Postgres", "Redis"],
    architecture: "Service mesh + model gateway + observability backbone",
    outcome: "Enabled faster iteration cycles and safer rollout automation.",
    x: 68,
    y: 22,
  },
]

const edges: Array<[string, string]> = [
  ["voice-ai", "agentops"],
  ["agentops", "lab-stack"],
]

function nodeById(id: string) {
  return nodes.find((n) => n.id === id)
}

export function NodeProjectGraph() {
  const [active, setActive] = useState<ProjectNode | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const edgeLines = useMemo(
    () =>
      edges.map(([from, to]) => {
        const a = nodeById(from)
        const b = nodeById(to)
        if (!a || !b) return null
        return {
          id: `${from}-${to}`,
          x1: `${a.x + 16}%`,
          y1: `${a.y + 9}%`,
          x2: `${b.x + 16}%`,
          y2: `${b.y + 9}%`,
        }
      }),
    []
  )

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f17] p-8 shadow-2xl">
        <div className="mb-7 flex items-center gap-3">
          <Workflow className="h-5 w-5 text-sky-300" />
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Project Systems Graph
          </h2>
        </div>

        <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(98,124,255,0.2),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.2),transparent_40%),#090d15]">
          <svg className="absolute inset-0 h-full w-full">
            {edgeLines.map((line) =>
              line ? (
                <motion.line
                  key={line.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={hovered ? "#7dd3fc" : "#5b6ea7"}
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: 1.1 }}
                />
              ) : null
            )}
          </svg>

          {nodes.map((node, idx) => (
            <motion.button
              key={node.id}
              className="absolute w-[34%] rounded-xl border border-white/15 bg-white/5 p-4 text-left text-white backdrop-blur"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              whileHover={{
                y: -7,
                x: idx % 2 === 0 ? 4 : -4,
                boxShadow: "0 0 35px rgba(56,189,248,0.2)",
              }}
              transition={{ duration: 0.45, delay: idx * 0.13 }}
              onClick={() => setActive(node)}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="mb-2 flex items-center gap-2 text-sky-300">
                {idx === 0 ? <Bot className="h-4 w-4" /> : <Cpu className="h-4 w-4" />}
                <span className="text-xs uppercase tracking-[0.2em]">Node</span>
              </div>
              <h3 className="text-base font-semibold">{node.title}</h3>
              <p className="mt-2 text-sm text-white/75">{node.summary}</p>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#0f1522] p-7 text-white"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-semibold">{active.title}</h3>
              <p className="mt-3 text-white/80">{active.summary}</p>
              <p className="mt-4 text-sm text-white/90">
                <span className="font-semibold text-sky-300">Architecture:</span>{" "}
                {active.architecture}
              </p>
              <p className="mt-2 text-sm text-white/90">
                <span className="font-semibold text-sky-300">Outcome:</span>{" "}
                {active.outcome}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {active.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
