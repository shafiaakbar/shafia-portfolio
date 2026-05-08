"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const CARDS = [
  {
    front: { label: "IDENTITY.EXE", title: "Who's Shafia?" },
    back:  { label: "IDENTITY.EXE", text: "Shafia is a student & FDE @ Karing.ai who likes exploring new things, solving problems, and turning complex shit into things that actually provide value." },
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
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="flex-1 min-w-0"
    >
      <div
        onMouseEnter={() => { setHovered(true); setFlipped(true) }}
        onMouseLeave={() => { setHovered(false); setFlipped(false) }}
        style={{ perspective: 900 }}
        className={`cursor-pointer w-full select-none ${floatClasses[index]}`}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" } as React.CSSProperties}
          className="relative h-80"
        >

          {/* ── FRONT ── */}
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
              willChange: "transform",
              border: hovered && !flipped ? "1px solid rgba(255,0,127,0.6)" : "1px solid rgba(255,0,127,0.3)",
              background: "rgba(9,9,11,0.9)",
              boxShadow: hovered && !flipped
                ? "0 0 30px rgba(255,0,127,0.25), 0 0 80px rgba(255,0,127,0.1)"
                : "0 0 20px rgba(255,0,127,0.12), 0 0 60px rgba(255,0,127,0.05)",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease",
            }}
          >
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

            {/* Centered title */}
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
          <div
            className="absolute inset-0 flex items-center justify-center p-6 overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              willChange: "transform",
              border: "1px solid rgba(255,0,127,0.5)",
              background: "#09090b",
              boxShadow: "0 0 30px rgba(255,0,127,0.2), 0 0 80px rgba(255,0,127,0.08)",
            }}
          >
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
            {/* Label — pinned top */}
            <span className="absolute top-6 left-6 font-mono text-[9px] tracking-[0.2em] text-pink-500 z-10">
              {card.back.label}
            </span>
            {/* Pink glow blob */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(255,0,127,0.12),transparent_70%)]" />
            <p className="font-mono text-sm leading-relaxed text-zinc-200 z-10 text-center">
              {card.back.text}
            </p>
          </div>

        </motion.div>
      </div>
    </motion.div>
  )
}

export function About() {
  return (
    <section id="about" className="py-16 md:py-28 px-4 md:px-16">
      <div className="mx-auto max-w-6xl">
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

        <div className="flex flex-col gap-6 md:flex-row">
          {CARDS.map((card, i) => (
            <FlipCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
