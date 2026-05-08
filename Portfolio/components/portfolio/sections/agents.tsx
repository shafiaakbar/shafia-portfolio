"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

// ── Coordinate system (SVG viewBox 0 0 1040 420) ────────────────────────────
const ROOT     = { cx: 580, cy: 60,  hw: 100, hh: 23 }
const INBOUND  = { cx: 295, cy: 192, hw: 84,  hh: 23 }
const OUTBOUND = { cx: 865, cy: 192, hw: 84,  hh: 23 }

const LEAVES = [
  { cx: 80,  cy: 338, hw: 60, hh: 27, l1: "NEW PATIENT", l2: "INTAKE",       branch: "in" },
  { cx: 225, cy: 338, hw: 60, hh: 27, l1: "APPOINTMENT", l2: "SCHEDULING",   branch: "in" },
  { cx: 370, cy: 338, hw: 60, hh: 27, l1: "MEDICATION",  l2: "REFILL",       branch: "in" },
  { cx: 510, cy: 338, hw: 60, hh: 27, l1: "IVR",         l2: "AGENTS",       branch: "in" },
  { cx: 770, cy: 338, hw: 65, hh: 27, l1: "INSURANCE",   l2: "VERIFICATION", branch: "out" },
  { cx: 960, cy: 338, hw: 65, hh: 27, l1: "REFERRAL",    l2: "VERIFICATION", branch: "out" },
]

// ── Pre-computed path data ───────────────────────────────────────────────────
const PATHS: { d: string; delay: number }[] = [
  // Root stem
  { d: `M 580,83 L 580,140`,                           delay: 0.1 },
  // To INBOUND
  { d: `M 580,140 L 295,140 L 295,169`,                delay: 0.3 },
  // To OUTBOUND
  { d: `M 580,140 L 865,140 L 865,169`,                delay: 0.3 },
  // INBOUND → children junction
  { d: `M 295,215 L 295,270`,                          delay: 0.75 },
  // Horizontal span across inbound children
  { d: `M 80,270 L 510,270`,                           delay: 0.95 },
  // Drops to inbound leaves
  { d: `M 80,270 L 80,311`,                            delay: 1.1  },
  { d: `M 225,270 L 225,311`,                          delay: 1.18 },
  { d: `M 370,270 L 370,311`,                          delay: 1.26 },
  { d: `M 510,270 L 510,311`,                          delay: 1.34 },
  // OUTBOUND → junction
  { d: `M 865,215 L 865,270`,                          delay: 0.75 },
  // Horizontal span across outbound children
  { d: `M 770,270 L 960,270`,                          delay: 0.95 },
  // Drops to outbound leaves
  { d: `M 770,270 L 770,311`,                          delay: 1.1  },
  { d: `M 960,270 L 960,311`,                          delay: 1.18 },
]

// ── Sub-components ───────────────────────────────────────────────────────────

function GlowPath({ d, delay, isInView }: { d: string; delay: number; isInView: boolean }) {
  const base = { duration: 0.7, delay, ease: "easeInOut" as const }
  const anim = isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
  return (
    <g>
      <motion.path d={d} stroke="rgba(255,0,127,0.07)" strokeWidth={12} fill="none" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={anim} transition={base} />
      <motion.path d={d} stroke="rgba(255,0,127,0.28)" strokeWidth={2} fill="none" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={anim} transition={{ ...base, delay: delay + 0.05 }} />
      <motion.path d={d} stroke="rgba(255,0,127,0.9)" strokeWidth={0.75} fill="none" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={anim} transition={{ ...base, delay: delay + 0.1 }} />
    </g>
  )
}

function RootNode({ isInView }: { isInView: boolean }) {
  const { cx, cy, hw, hh } = ROOT
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* Pink corner marks */}
      {[[-hw, -hh], [hw - 8, -hh], [-hw, hh - 8], [hw - 8, hh - 8]].map(([ox, oy], i) => (
        <motion.g key={i}>
          <line x1={cx + ox} y1={cy + oy} x2={cx + ox + (ox < 0 ? 8 : -8)} y2={cy + oy}
            stroke="rgba(255,0,127,0.7)" strokeWidth="1.5" />
          <line x1={cx + ox} y1={cy + oy} x2={cx + ox} y2={cy + oy + (oy < 0 ? 8 : -8)}
            stroke="rgba(255,0,127,0.7)" strokeWidth="1.5" />
        </motion.g>
      ))}
      {/* Box glow */}
      <rect x={cx - hw} y={cy - hh} width={hw * 2} height={hh * 2}
        fill="rgba(255,0,127,0.04)" stroke="rgba(255,0,127,0.55)" strokeWidth={0.75} />
      {/* Labels */}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="11"
        fontFamily="monospace" fontWeight="700" letterSpacing="2">
        AI AGENT NETWORK
      </text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(255,0,127,0.6)" fontSize="8"
        fontFamily="monospace" letterSpacing="1">
        NEURAL_NET_V1
      </text>
      {/* Pulsing dot */}
      <motion.circle cx={cx - hw + 8} cy={cy} r={2.5} fill="rgba(255,0,127,0.9)"
        animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
    </motion.g>
  )
}

function BranchNode({
  cx, cy, hw, hh, label, sub, delay, isInView, color = "pink",
}: {
  cx: number; cy: number; hw: number; hh: number
  label: string; sub: string; delay: number; isInView: boolean; color?: string
}) {
  const col = color === "cyan" ? "rgba(0,255,255," : "rgba(255,0,127,"
  return (
    <motion.g
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
    >
      <rect x={cx - hw} y={cy - hh} width={hw * 2} height={hh * 2}
        fill={`${col}0.06)`} stroke={`${col}0.5)`} strokeWidth={0.75} />
      <rect x={cx - hw} y={cy - hh} width={hw * 2} height={2}
        fill={`${col}0.6)`} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="10"
        fontFamily="monospace" fontWeight="800" letterSpacing="2">
        {label}
      </text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill={`${col}0.55)`} fontSize="7.5"
        fontFamily="monospace" letterSpacing="1">
        {sub}
      </text>
    </motion.g>
  )
}

function LeafNode({
  cx, cy, hw, hh, l1, l2, delay, isInView, branch,
}: (typeof LEAVES)[0] & { delay: number; isInView: boolean }) {
  const col = branch === "out" ? "rgba(0,210,255," : "rgba(255,0,127,"
  const textCol = branch === "out" ? "rgba(0,210,255,0.75)" : "rgba(255,0,127,0.75)"
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 280, damping: 22 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* Outer glow */}
      <rect x={cx - hw - 2} y={cy - hh - 2} width={hw * 2 + 4} height={hh * 2 + 4}
        fill="none" stroke={`${col}0.08)`} strokeWidth={6} rx={1} />
      {/* Box */}
      <rect x={cx - hw} y={cy - hh} width={hw * 2} height={hh * 2}
        fill="rgba(0,0,0,0.85)" stroke={`${col}0.55)`} strokeWidth={0.75} rx={1} />
      {/* Top accent */}
      <rect x={cx - hw} y={cy - hh} width={hw * 2} height={1.5} fill={`${col}0.7)`} />
      {/* Labels */}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="8.5"
        fontFamily="monospace" fontWeight="700" letterSpacing="1.5">
        {l1}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={textCol} fontSize="8"
        fontFamily="monospace" letterSpacing="1">
        {l2}
      </text>
      {/* Active dot */}
      <motion.circle cx={cx + hw - 7} cy={cy - hh + 7} r={2} fill={`${col}0.9)`}
        animate={{ opacity: [1, 0.15, 1], r: [2, 3, 2] }}
        transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 1.5 }} />
    </motion.g>
  )
}

// ── Main section ─────────────────────────────────────────────────────────────

export function Agents() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="agents" className="py-16 md:py-28 px-4 md:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-baseline justify-between border-b border-zinc-800 pb-4"
        >
          <div className="flex items-baseline gap-4">
            <h2 className="text-2xl text-white">PROJECTS</h2>
            <span className="font-mono text-xs text-pink-500">AGENT_NETWORK_MAP</span>
          </div>
          <span className="hidden font-mono text-xs text-zinc-700 md:block">
            06 AGENTS DEPLOYED
          </span>
        </motion.div>

        {/* Desktop SVG tree */}
        <div ref={ref} className="hidden md:block w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <svg
              viewBox="0 0 1040 400"
              className="w-full"
              style={{ filter: "drop-shadow(0 0 1px rgba(255,0,127,0.2))" }}
            >
              {/* Grid dots background */}
              <defs>
                <pattern id="grid-agents" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="0" cy="0" r="0.6" fill="rgba(255,0,127,0.08)" />
                </pattern>
              </defs>
              <rect width="1040" height="400" fill="url(#grid-agents)" />

              {/* Glowing paths */}
              {PATHS.map((p, i) => (
                <GlowPath key={i} d={p.d} delay={p.delay} isInView={isInView} />
              ))}

              {/* Root node */}
              <RootNode isInView={isInView} />

              {/* Branch nodes */}
              <BranchNode {...INBOUND} label="INBOUND" sub="▼ RECEIVING" delay={0.5} isInView={isInView} />
              <BranchNode {...OUTBOUND} label="OUTBOUND" sub="▲ TRANSMITTING" delay={0.5} isInView={isInView} color="cyan" />

              {/* Leaf nodes */}
              {LEAVES.map((leaf, i) => (
                <LeafNode key={leaf.l1} {...leaf} delay={1.4 + i * 0.1} isInView={isInView} />
              ))}
            </svg>
          </div>
        </div>

        {/* Mobile: card layout */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {/* Inbound */}
          <div>
            <div className="mb-3 flex items-center gap-3 border border-pink-500/30 bg-pink-500/5 px-4 py-2">
              <span className="font-mono text-xs font-bold tracking-widest text-pink-500">▼ INBOUND</span>
              <div className="h-px flex-1 bg-pink-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LEAVES.filter((l) => l.branch === "in").map((leaf) => (
                <motion.div
                  key={leaf.l1}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border border-zinc-800 bg-zinc-950/60 p-3"
                >
                  <p className="font-mono text-[10px] font-bold tracking-widest text-white">{leaf.l1}</p>
                  <p className="font-mono text-[10px] tracking-widest text-pink-500/70">{leaf.l2}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Outbound */}
          <div>
            <div className="mb-3 flex items-center gap-3 border border-cyan-500/30 bg-cyan-500/5 px-4 py-2">
              <span className="font-mono text-xs font-bold tracking-widest text-cyan-400">▲ OUTBOUND</span>
              <div className="h-px flex-1 bg-cyan-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LEAVES.filter((l) => l.branch === "out").map((leaf) => (
                <motion.div
                  key={leaf.l1}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border border-zinc-800 bg-zinc-950/60 p-3"
                >
                  <p className="font-mono text-[10px] font-bold tracking-widest text-white">{leaf.l1}</p>
                  <p className="font-mono text-[10px] tracking-widest text-cyan-400/70">{leaf.l2}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
