"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Radio, Grid2X2, Layers, Cpu, History } from "lucide-react"
import { Hero } from "./sections/hero"
import { About } from "./sections/about"
import { Agents } from "./sections/agents"
import { Process } from "./sections/process"
import { Experience } from "./sections/experience"
import { Contact } from "./sections/contact"

const navLinks = [
  { label: "CORE", href: "core" },
  { label: "PROJECTS", href: "agents" },
  { label: "PROCESS", href: "process" },
  { label: "LOGS", href: "logs" },
  { label: "CONTACT", href: "contact" },
]

const mobileNavLinks = [
  { label: "CORE", icon: Grid2X2, href: "core" },

  { label: "PROCESS", icon: Cpu, href: "process" },
  { label: "LOGS", icon: History, href: "logs" },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export function Portfolio() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("core")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Highlight active nav link based on scroll position
  useEffect(() => {
    const ids = navLinks.map((l) => l.href)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.3 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <main className="neural-body overflow-x-hidden pb-16 text-zinc-200 md:pb-0">
      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed left-0 top-0 z-50 w-full transition-all duration-500"
      >
        {/* Glass panel — appears on scroll */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            scrolled
              ? "bg-black/40 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.4)]"
              : "bg-transparent backdrop-blur-none"
          }`}
        />

        <div className="relative flex h-16 items-center justify-between px-6 md:px-10">
          {/* Logo */}
          <button
            onClick={() => scrollTo("core")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative flex h-7 w-7 items-center justify-center">
              <div className="absolute inset-0 rounded-sm bg-pink-500/10 transition-all duration-300 group-hover:bg-pink-500/20" />
              <Terminal className="relative h-3.5 w-3.5 text-pink-500" />
            </div>
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-white/80 transition-colors group-hover:text-white">
              SB<span className="text-pink-500">_</span>V4
            </span>
          </button>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="relative px-4 py-2 font-mono text-[11px] tracking-[0.15em] transition-colors duration-200"
                >
                  <span
                    className={`transition-colors duration-200 ${
                      isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {link.label}
                  </span>
                  {/* Active underline dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-1 left-1/2 h-[2px] w-3 -translate-x-1/2 rounded-full bg-pink-500"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </nav>

          {/* Right — status */}
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] tracking-widest text-zinc-600 md:block">
              ONLINE
            </span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-pink-500" />
              </span>
              <Radio className="h-4 w-4 text-pink-500/70" />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sections */}
      <Hero />
      <About />
      <Agents />
      <Process />
      <Experience />
      <Contact />

      {/* Footer */}
      <footer className="flex w-full flex-col items-center justify-between gap-4 border-t border-zinc-800 bg-zinc-950 px-6 py-6 md:flex-row">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-pink-600">
            ENGINEER_PORTFOLIO_V4.0
          </span>
          <span className="font-mono text-[9px] text-zinc-700">
            SYSTEM_STABLE: v4.0.2
          </span>
        </div>
        <div className="flex gap-8">
          {["ROOT", "SSH", "UPLINK"].map((item) => (
            <span
              key={item}
              className="cursor-pointer font-mono text-[9px] uppercase text-zinc-700 transition hover:text-pink-400"
            >
              {item}
            </span>
          ))}
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around border-t border-white/[0.04] bg-black/60 backdrop-blur-xl md:hidden">
        {mobileNavLinks.map((item) => {
          const isActive = activeSection === item.href
          return (
            <button
              key={item.label}
              onClick={() => scrollTo(item.href)}
              className="flex h-full flex-1 flex-col items-center justify-center pt-1 transition-colors"
            >
              <item.icon
                className={`h-4 w-4 transition-colors ${isActive ? "text-pink-500" : "text-zinc-600"}`}
              />
              <span
                className={`mt-1 font-mono text-[10px] uppercase tracking-tight transition-colors ${
                  isActive ? "text-pink-500" : "text-zinc-600"
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </main>
  )
}
