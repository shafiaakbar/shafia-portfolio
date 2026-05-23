"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, ArrowUpRight, Menu, X } from "lucide-react"
import { ConversationProvider } from "@elevenlabs/react"
import { Hero } from "./sections/hero"
import { StatementSection } from "./sections/statement"
import { About } from "./sections/about"
import { Agents } from "./sections/agents"
import { Experience } from "./sections/experience"
import { Contact } from "./sections/contact"
import { BootScreen } from "@/components/ui/boot-screen"
import { CustomCursor } from "@/components/ui/custom-cursor"
import { TalkButton } from "@/components/ui/talk-button"

const navLinks = [
  { label: "ABOUT", href: "about" },
  { label: "PROJECTS", href: "agents" },
  { label: "LOGS", href: "logs" },
  { label: "CONTACT", href: "contact" },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export function Portfolio() {
  const [navVisible, setNavVisible] = useState(true)
  const navVisibleRef = useRef(true)
  const [activeSection, setActiveSection] = useState("about")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const heroHeight = window.innerHeight

    const onScroll = () => {
      const y = window.scrollY
      const pastHero = y > heroHeight * 0.8
      const scrollingUp = y < lastY
      lastY = y

      const shouldShow = !pastHero || scrollingUp
      if (shouldShow !== navVisibleRef.current) {
        navVisibleRef.current = shouldShow
        setNavVisible(shouldShow)
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
    <ConversationProvider>
    <main className="neural-body overflow-x-hidden text-zinc-200">
      <BootScreen />
      <CustomCursor />
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
              SB
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

          {/* Right — CTA (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              onClick={() => scrollTo("contact")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group hidden md:flex items-center gap-1.5 border border-pink-500/60 px-4 py-1.5 font-mono text-[11px] tracking-widest text-pink-400 transition-all duration-300 hover:border-pink-500 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(255,0,127,0.2)]"
            >
              LET'S BUILD
              <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex md:hidden h-8 w-8 items-center justify-center text-zinc-400 transition-colors hover:text-white"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col bg-black/95 backdrop-blur-xl md:hidden"
          >
            {/* Top accent */}
            <div className="h-px w-full bg-gradient-to-r from-pink-500 via-pink-400/50 to-transparent" />

            <nav className="flex flex-1 flex-col justify-center px-10 gap-2">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  onClick={() => { scrollTo(link.href); setMenuOpen(false) }}
                  className="group flex items-center justify-between border-b border-zinc-900 py-5 text-left"
                >
                  <span className={`font-mono text-2xl font-bold tracking-widest transition-colors ${activeSection === link.href ? "text-pink-500" : "text-zinc-400 group-hover:text-white"}`}>
                    {link.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-zinc-700 transition-all group-hover:text-pink-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.06 + 0.06, duration: 0.25 }}
                onClick={() => { scrollTo("contact"); setMenuOpen(false) }}
                className="mt-6 border border-pink-500/60 px-6 py-3.5 font-mono text-sm tracking-widest text-pink-400"
              >
                LET'S BUILD
              </motion.button>
            </nav>

            <p className="pb-10 text-center font-mono text-[10px] tracking-widest text-zinc-700">
              shafiab.com
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections */}
      <Hero />
      <div className="h-0 md:h-48" />
      <StatementSection />
      <About />
      <Agents />
      <Experience />
      <Contact />

    </main>
    {/* Outside <main> — no overflow/transform ancestor can trap fixed positioning */}
    <TalkButton />
    </ConversationProvider>
  )
}
