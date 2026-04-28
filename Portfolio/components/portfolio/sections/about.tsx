"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const lines: { text: string; highlight?: string }[] = [
  { text: "> INITIALIZING ARCHITECT DATA...", highlight: "cmd" },
  { text: "> Shafia Bahar is a Forward Deployed AI Engineer at Karing.ai," },
  { text: "  specialising in voice AI systems and healthcare automation." },
  { text: "> Core stack: LiveKit · n8n · Athenahealth · Python · LLMs." },
  { text: "  Building AI agents that replace manual clinical workflows —" },
  { text: "  from appointment booking to prescription refills." },
  { text: "> BSCS candidate at IOBM — expected graduation: June 2026." },
  { text: "> Status: Deployed. Iterating. Building in production." },
]

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="about" className="py-28 px-4 md:px-16">
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
          <div className="space-y-2">
            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.13 }}
                className={
                  line.highlight === "cmd"
                    ? "text-pink-500/60"
                    : line.text.startsWith("  ")
                    ? "pl-4 text-zinc-600"
                    : "text-zinc-400"
                }
              >
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: lines.length * 0.13 }}
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
