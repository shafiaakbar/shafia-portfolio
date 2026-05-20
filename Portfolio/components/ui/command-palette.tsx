"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Search, Home, Cpu, Terminal, Radio, Phone, Mail,
  ExternalLink, ArrowRight, Layers, User,
} from "lucide-react"
import { getLenis } from "@/lib/lenis"

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset: 0 })
  } else {
    el.scrollIntoView({ behavior: "smooth" })
  }
}

const COMMANDS = [
  // Navigate
  { id: "core",     label: "Go to Hero",            category: "NAVIGATE", icon: Home,     action: () => scrollTo("core") },
  { id: "agents",   label: "Go to Projects",         category: "NAVIGATE", icon: Radio,    action: () => scrollTo("agents") },
  { id: "logs",     label: "Go to Mission Log",      category: "NAVIGATE", icon: Terminal, action: () => scrollTo("logs") },
  { id: "process",  label: "Go to Deploy Protocol",  category: "NAVIGATE", icon: Cpu,      action: () => scrollTo("process") },
  { id: "exp",      label: "Go to Experience",       category: "NAVIGATE", icon: Layers,   action: () => scrollTo("experience") },
  { id: "contact",  label: "Go to Contact",          category: "NAVIGATE", icon: User,     action: () => scrollTo("contact") },
  // Actions
  { id: "talk",     label: "Talk to Shafia",         category: "ACTION",   icon: Phone,    action: () => { scrollTo("core"); setTimeout(() => (document.querySelector("[data-vapi-btn]") as HTMLElement)?.click(), 600) } },
  { id: "email",    label: "Send Email",             category: "ACTION",   icon: Mail,     action: () => window.open("mailto:asfia.akbar2002@gmail.com") },
  // External
  { id: "github",   label: "View GitHub",            category: "EXTERNAL", icon: ExternalLink, action: () => window.open("https://github.com/shafiaakbar", "_blank") },
]

const CATEGORIES = ["NAVIGATE", "ACTION", "EXTERNAL"] as const

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  )

  const execute = useCallback((cmd: (typeof COMMANDS)[0]) => {
    cmd.action()
    setOpen(false)
    setQuery("")
  }, [])

  // Keyboard shortcut to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", down)
    return () => window.removeEventListener("keydown", down)
  }, [])

  // Arrow key navigation + enter inside palette
  useEffect(() => {
    if (!open) return
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIdx((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter" && filtered[activeIdx]) {
        execute(filtered[activeIdx])
      }
    }
    window.addEventListener("keydown", down)
    return () => window.removeEventListener("keydown", down)
  }, [open, filtered, activeIdx, execute])

  // Reset active index when query changes
  useEffect(() => { setActiveIdx(0) }, [query])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else setQuery("")
  }, [open])

  return (
    <>
      {/* Trigger hint — fixed bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-20 left-4 z-40 hidden items-center gap-2 md:flex md:bottom-6"
      >
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 border border-zinc-800 bg-black/60 px-3 py-1.5 backdrop-blur-sm transition hover:border-pink-500/40"
        >
          <span className="font-mono text-[10px] tracking-widest text-zinc-600">⌘K</span>
          <span className="font-mono text-[10px] tracking-widest text-zinc-700">COMMAND</span>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
            />

            {/* Palette */}
            <motion.div
              className="fixed left-1/2 top-[20%] z-[9999] w-full max-w-lg -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="overflow-hidden border border-pink-500/20 bg-zinc-950 shadow-[0_0_60px_rgba(255,0,127,0.12)]">

                {/* Search input */}
                <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
                  <Search className="h-4 w-4 shrink-0 text-pink-500/60" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a command..."
                    className="flex-1 bg-transparent font-mono text-sm text-white placeholder-zinc-600 outline-none"
                  />
                  <span className="font-mono text-[10px] text-zinc-700">ESC</span>
                </div>

                {/* Commands */}
                <div className="max-h-72 overflow-y-auto py-2">
                  {filtered.length === 0 ? (
                    <p className="px-4 py-6 text-center font-mono text-xs text-zinc-600">
                      NO COMMANDS FOUND
                    </p>
                  ) : (
                    CATEGORIES.map((cat) => {
                      const items = filtered.filter((c) => c.category === cat)
                      if (items.length === 0) return null
                      return (
                        <div key={cat}>
                          <p className="px-4 pb-1 pt-3 font-mono text-[9px] tracking-[0.2em] text-zinc-600">
                            {cat}
                          </p>
                          {items.map((cmd) => {
                            const globalIdx = filtered.indexOf(cmd)
                            const isActive = globalIdx === activeIdx
                            const Icon = cmd.icon
                            return (
                              <button
                                key={cmd.id}
                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                                  isActive
                                    ? "bg-pink-500/10 text-white"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                }`}
                                onMouseEnter={() => setActiveIdx(globalIdx)}
                                onClick={() => execute(cmd)}
                              >
                                {/* Active bar */}
                                <div className={`h-5 w-px shrink-0 transition-colors ${isActive ? "bg-pink-500" : "bg-transparent"}`} />
                                <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-pink-400" : "text-zinc-600"}`} />
                                <span className="flex-1 font-mono text-xs tracking-wide">{cmd.label}</span>
                                {isActive && (
                                  <ArrowRight className="h-3 w-3 text-pink-500/60" />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-zinc-900 px-4 py-2">
                  <span className="font-mono text-[9px] text-zinc-700">
                    {filtered.length} COMMANDS
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[9px] text-zinc-700">
                    <span>↑↓ navigate</span>
                    <span>↵ select</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
