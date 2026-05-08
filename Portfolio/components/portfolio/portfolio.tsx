"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Grid2X2, Layers, Cpu, History, ArrowUpRight } from "lucide-react"
import { Hero } from "./sections/hero"
import { StatementSection } from "./sections/statement"
import { About } from "./sections/about"
import { Agents } from "./sections/agents"
import { Process } from "./sections/process"
import { Experience } from "./sections/experience"
import { Contact } from "./sections/contact"
import { BootScreen } from "@/components/ui/boot-screen"
import { CustomCursor } from "@/components/ui/custom-cursor"
import { CommandPalette } from "@/components/ui/command-palette"

const navLinks = [
  { label: "ABOUT", href: "about" },
  { label: "PROJECTS", href: "agents" },
  { label: "PROCESS", href: "process" },
  { label: "LOGS", href: "logs" },
  { label: "CONTACT", href: "contact" },
]

const mobileNavLinks = [
  { label: "ABOUT", icon: Grid2X2, href: "about" },
  { label: "PROJECTS", icon: Layers, href: "agents" },
  { label: "PROCESS", icon: Cpu, href: "process" },
  { label: "LOGS", icon: History, href: "logs" },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export function Portfolio() {
  const [navVisible, setNavVisible] = useState(true)
  const [activeSection, setActiveSection] = useState("about")

  useEffect(() => {
    let lastY = window.scrollY
    const heroHeight = window.innerHeight

    const onScroll = () => {
      const y = window.scrollY
      const pastHero = y > heroHeight * 0.8
      const scrollingUp = y < lastY
      lastY = y

      if (!pastHero) {
        setNavVisible(true)
      } else if (scrollingUp) {
        setNavVisible(true)
      } else {
        setNavVisible(false)
      }
    }

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
      <BootScreen />
      <CustomCursor />
      <CommandPalette />
      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : -16 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-50 w-full"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
        />

        <div className="relative flex h-16 items-center justify-between px-5 md:px-10">

          {/* Logo */}
          <button
            onClick={() => scrollTo("core")}
            className="group flex items-center gap-2.5 shrink-0"
          >
            <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-sm">
              <div className="absolute inset-0 bg-pink-500/10 transition-all duration-300 group-hover:bg-pink-500/25" />
              <Terminal className="relative h-3.5 w-3.5 text-pink-500" />
            </div>
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-white/70 transition-colors duration-200 group-hover:text-white">
              SB<span className="text-pink-500">_</span>V4
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="relative px-4 py-2 font-mono text-[11px] tracking-[0.14em] transition-colors duration-200"
                >
                  <span className={`transition-colors duration-200 ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                    {link.label}
                  </span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-pink-500"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </nav>

          {/* Right — availability + CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* CTA */}
            <motion.button
              onClick={() => scrollTo("contact")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-1.5 border border-pink-500/60 px-4 py-1.5 font-mono text-[11px] tracking-widest text-pink-400 transition-all duration-300 hover:border-pink-500 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(255,0,127,0.2)]"
            >
              LET'S BUILD
              <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Sections */}
      <Hero />
      <StatementSection />
      <About />
      <Agents />
      <Process />
      <Experience />
      <Contact />

      {/* Footer */}
      <footer className="flex w-full flex-col border-t border-zinc-800 bg-zinc-950">
        <div className="flex w-full flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
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
