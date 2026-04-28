"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, Globe, Code2 } from "lucide-react"

const terminalLines = [
  "UPLINK_ESTABLISHED",
  "STATUS: ACCEPTING_NEW_MISSIONS",
  "PING: shafia.akbar1@gmail.com",
  "NETWORK: linkedin/shafia-b",
  "REPO: github/shafiaakbar",
]

const links = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "shafia.akbar1@gmail.com",
    href: "mailto:shafia.akbar1@gmail.com",
    external: false,
  },
  {
    icon: Globe,
    label: "LINKEDIN",
    value: "linkedin/shafia-b-05810427a",
    href: "https://www.linkedin.com/in/shafia-b-05810427a/",
    external: true,
  },
  {
    icon: Code2,
    label: "GITHUB",
    value: "github/shafiaakbar",
    href: "https://github.com/shafiaakbar",
    external: true,
  },
]

export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="contact" className="py-28 px-4 md:px-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">UPLINK_TERMINAL</h2>
          <span className="font-mono text-xs text-pink-500">ESTABLISH_CONNECTION</span>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="border border-zinc-900 bg-zinc-950/50 p-7 font-mono text-sm"
          >
            {terminalLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.12 }}
                className="mb-2 text-zinc-500"
              >
                <span className="text-pink-500">&gt; </span>
                {line}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 + terminalLines.length * 0.12 }}
              className="animate-pulse text-pink-500"
            >
              &gt; █
            </motion.p>
          </motion.div>

          {/* Link cards */}
          <div className="flex flex-col gap-3">
            {links.map((link, i) => {
              const Icon = link.icon
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="group flex items-center gap-4 border border-zinc-900 bg-zinc-950/30 px-5 py-4 transition-all duration-300 hover:border-pink-500/30"
                >
                  <Icon className="h-4 w-4 text-pink-500 transition group-hover:drop-shadow-[0_0_5px_rgba(255,0,127,0.7)]" />
                  <div>
                    <p className="mb-0.5 font-mono text-[9px] tracking-widest text-zinc-600">
                      {link.label}
                    </p>
                    <p className="text-sm text-white">{link.value}</p>
                  </div>
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
