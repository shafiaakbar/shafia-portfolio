"use client"

import { Terminal, Radio, Grid2X2, Layers, Cpu, History } from "lucide-react"
import { Hero } from "./sections/hero"
import { About } from "./sections/about"
import { Projects } from "./sections/projects"
import { Process } from "./sections/process"
import { Experience } from "./sections/experience"
import { Contact } from "./sections/contact"

const navLinks = [
  { label: "CORE", href: "core" },
  { label: "PROJECTS", href: "projects" },
  { label: "PROCESS", href: "process" },
  { label: "LOGS", href: "logs" },
  { label: "CONTACT", href: "contact" },
]

const mobileNavLinks = [
  { label: "CORE", icon: Grid2X2, href: "core" },
  { label: "PROJECTS", icon: Layers, href: "projects" },
  { label: "PROCESS", icon: Cpu, href: "process" },
  { label: "LOGS", icon: History, href: "logs" },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export function Portfolio() {
  return (
    <main className="neural-body overflow-x-hidden pb-16 text-zinc-200 md:pb-0">
      {/* Fixed nav */}
      <header className="fixed left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-black/90 px-4 shadow-[0_0_10px_rgba(255,0,127,0.15)] backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-pink-500" />
          <span className="text-lg font-black tracking-widest text-pink-500">
            ENGINEER_PORTFOLIO_V4.0
          </span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-semibold tracking-wider text-zinc-500 transition hover:text-pink-400"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
          </span>
          <Radio className="h-5 w-5 text-pink-500" />
        </div>
      </header>

      {/* Sections */}
      <Hero />
      <About />
      <Projects />
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
      <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around border-t border-zinc-800 bg-black/95 md:hidden">
        {mobileNavLinks.map((item) => (
          <button
            key={item.label}
            onClick={() => scrollTo(item.href)}
            className="flex h-full flex-1 flex-col items-center justify-center pt-1 text-zinc-600 hover:bg-pink-500/5"
          >
            <item.icon className="h-4 w-4" />
            <span className="mt-1 font-mono text-[10px] uppercase tracking-tight">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </main>
  )
}
