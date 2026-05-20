"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const CARDS = [
  {
    front: { label: "IDENTITY.EXE", title: "Who's Shafia?" },
    back:  { label: "IDENTITY.EXE", text: "Shafia is a student & FDE @ Karing.ai who likes exploring new things, solving problems, and turning complex stuff into things that actually provide value." },
  },
  {
    front: { label: "WHY_SHAFIA.SH", title: "Why Shafia?" },
    back:  { label: "WHY_SHAFIA.SH", text: "She figures things out on her own, works directly with clients, adapts fast, and has built automations + AI agents handling 5,000+ calls a day." },
  },
  {
    front: { label: "SIDE_QUEST.LOG", title: "Shafia's Side Quest?" },
    back:  { label: "SIDE_QUEST.LOG", text: "Building BuyBestie — a white-gloved personal shopping experience focused on making fashion sourcing feel effortless." },
  },
]

const floatClasses = ["animate-float-slow", "animate-float-med", "animate-float-fast"]

function FlipCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="flex-1 min-w-0"
    >
      {/* Float on outer wrapper — perspective container is static so float
          and 3D context are on separate elements */}
      <div className={floatClasses[index]}>
        <div
          className="flip-card-wrapper"
          style={{ perspective: "900px" }}
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
        >
          <div className={`relative h-[320px] md:h-[420px] flip-inner${flipped ? " flipped" : ""}`}>

            {/* ── FRONT ── */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 overflow-hidden flip-card-front">
              {/* Scanlines */}
              <div className="pointer-events-none absolute inset-0 opacity-30"
                style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)" }} />
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-pink-500 via-pink-400 to-transparent opacity-70" />
              {/* Corner brackets */}
              <div className="absolute top-2 left-2  h-3 w-3 border-l border-t border-pink-500/70" />
              <div className="absolute top-2 right-2 h-3 w-3 border-r border-t border-pink-500/70" />
              <div className="absolute bottom-2 left-2  h-3 w-3 border-b border-l border-pink-500/70" />
              <div className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-pink-500/70" />

              <span className="font-mono text-[9px] tracking-[0.2em] text-pink-500/60 z-10">
                {card.front.label}
              </span>

              <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
                <p
                  className="text-center text-3xl font-black leading-tight text-white"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {card.front.title}
                </p>
              </div>

              <p className="font-mono text-[9px] tracking-widest text-zinc-600 animate-pulse z-10 self-end">
                CLICK TO DECRYPT
              </p>
            </div>

            {/* ── BACK ── */}
            <div className="absolute inset-0 flex items-center justify-center p-8 overflow-hidden flip-card-back">
              {/* Scanlines */}
              <div className="pointer-events-none absolute inset-0 opacity-30"
                style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)" }} />
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
              {/* Corner brackets */}
              <div className="absolute top-2 left-2  h-3 w-3 border-l border-t border-pink-500" />
              <div className="absolute top-2 right-2 h-3 w-3 border-r border-t border-pink-500" />
              <div className="absolute bottom-2 left-2  h-3 w-3 border-b border-l border-pink-500" />
              <div className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-pink-500" />
              <span className="absolute top-6 left-6 font-mono text-[9px] tracking-[0.2em] text-pink-500 z-10">
                {card.back.label}
              </span>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(255,0,127,0.12),transparent_70%)]" />
              <p className="font-mono text-sm leading-relaxed text-zinc-200 z-10 text-center">
                {card.back.text}
              </p>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function About() {
  return (
    <section id="about" className="pt-2 pb-16 md:py-28 px-4 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          {CARDS.map((card, i) => (
            <FlipCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
