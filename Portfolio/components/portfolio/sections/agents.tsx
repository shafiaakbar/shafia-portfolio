"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, useInView } from "framer-motion"

// ── Coordinate system (SVG viewBox 0 0 1040 420) ────────────────────────────
const ROOT     = { cx: 580, cy: 60,  hw: 100, hh: 23 }
const INBOUND  = { cx: 295, cy: 192, hw: 84,  hh: 23 }
const OUTBOUND = { cx: 865, cy: 192, hw: 84,  hh: 23 }

// dotDelay/dotDuration are pre-computed so Math.random() never runs in render
const LEAVES = [
  { cx: 80,  cy: 338, hw: 60, hh: 27, l1: "NEW PATIENT", l2: "INTAKE",       branch: "in",  slug: "new-patient-intake",     dotDelay: "0s",   dotDur: "2.1s" },
  { cx: 225, cy: 338, hw: 60, hh: 27, l1: "APPOINTMENT", l2: "SCHEDULING",   branch: "in",  slug: "appointment-scheduling", dotDelay: "0.4s", dotDur: "2.4s" },
  { cx: 370, cy: 338, hw: 60, hh: 27, l1: "MEDICATION",  l2: "REFILL",       branch: "in",  slug: "medication-refill",      dotDelay: "0.8s", dotDur: "2.7s" },
  { cx: 510, cy: 338, hw: 60, hh: 27, l1: "IVR",         l2: "AGENTS",       branch: "in",  slug: "ivr-agents",             dotDelay: "1.2s", dotDur: "2.5s" },
  { cx: 770, cy: 338, hw: 65, hh: 27, l1: "INSURANCE",   l2: "VERIFICATION", branch: "out", slug: "insurance-verification", dotDelay: "0.6s", dotDur: "2.2s" },
  { cx: 960, cy: 338, hw: 65, hh: 27, l1: "REFERRAL",    l2: "VERIFICATION", branch: "out", slug: "referral-verification",  dotDelay: "1.0s", dotDur: "2.8s" },
]

const PATHS: { d: string; delay: number }[] = [
  { d: `M 580,83 L 580,140`,                           delay: 0.1  },
  { d: `M 580,140 L 295,140 L 295,169`,                delay: 0.3  },
  { d: `M 580,140 L 865,140 L 865,169`,                delay: 0.3  },
  { d: `M 295,215 L 295,270`,                          delay: 0.75 },
  { d: `M 80,270 L 510,270`,                           delay: 0.95 },
  { d: `M 80,270 L 80,311`,                            delay: 1.1  },
  { d: `M 225,270 L 225,311`,                          delay: 1.18 },
  { d: `M 370,270 L 370,311`,                          delay: 1.26 },
  { d: `M 510,270 L 510,311`,                          delay: 1.34 },
  { d: `M 865,215 L 865,270`,                          delay: 0.75 },
  { d: `M 770,270 L 960,270`,                          delay: 0.95 },
  { d: `M 770,270 L 770,311`,                          delay: 1.1  },
  { d: `M 960,270 L 960,311`,                          delay: 1.18 },
]

const DASH = 2000

// Pure CSS transition — no JS frame loop
function GlowPath({ d, delay, isInView }: { d: string; delay: number; isInView: boolean }) {
  const offset = isInView ? 0 : DASH
  const op     = isInView ? 1 : 0
  return (
    <g>
      <path d={d} fill="none" strokeLinecap="round" stroke="rgba(255,0,127,0.07)" strokeWidth={12}
        style={{ strokeDasharray: DASH, strokeDashoffset: offset, opacity: op,
          transition: `stroke-dashoffset 0.7s ease-in-out ${delay}s, opacity 0.3s ease ${delay}s` }} />
      <path d={d} fill="none" strokeLinecap="round" stroke="rgba(255,0,127,0.28)" strokeWidth={2}
        style={{ strokeDasharray: DASH, strokeDashoffset: offset, opacity: op,
          transition: `stroke-dashoffset 0.7s ease-in-out ${delay + 0.05}s, opacity 0.3s ease ${delay + 0.05}s` }} />
      <path d={d} fill="none" strokeLinecap="round" stroke="rgba(255,0,127,0.9)"  strokeWidth={0.75}
        style={{ strokeDasharray: DASH, strokeDashoffset: offset, opacity: op,
          transition: `stroke-dashoffset 0.7s ease-in-out ${delay + 0.1}s, opacity 0.3s ease ${delay + 0.1}s` }} />
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
      {[[-hw, -hh], [hw, -hh], [-hw, hh], [hw, hh]].map(([ox, oy], i) => (
        <g key={i}>
          <line x1={cx + ox} y1={cy + oy} x2={cx + ox + (ox! < 0 ? 8 : -8)} y2={cy + oy}
            stroke="rgba(255,0,127,0.7)" strokeWidth="1.5" />
          <line x1={cx + ox} y1={cy + oy} x2={cx + ox} y2={cy + oy + (oy! < 0 ? 8 : -8)}
            stroke="rgba(255,0,127,0.7)" strokeWidth="1.5" />
        </g>
      ))}
      <rect x={cx - hw} y={cy - hh} width={hw * 2} height={hh * 2}
        fill="rgba(255,0,127,0.04)" stroke="rgba(255,0,127,0.55)" strokeWidth={0.75} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="14"
        fontFamily="monospace" fontWeight="700" letterSpacing="2">AI AGENT NETWORK</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fill="rgba(255,0,127,0.6)" fontSize="10"
        fontFamily="monospace" letterSpacing="1">NEURAL_NET_V1</text>
      {/* CSS keyframe pulse — no JS */}
      <circle cx={cx - hw + 8} cy={cy} r={2.5} fill="rgba(255,0,127,0.9)"
        style={{ animation: "agentPulse 1.6s ease-in-out infinite" }} />
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
      <rect x={cx - hw} y={cy - hh} width={hw * 2} height={2} fill={`${col}0.6)`} />
      <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="13"
        fontFamily="monospace" fontWeight="800" letterSpacing="2">{label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={`${col}0.55)`} fontSize="9.5"
        fontFamily="monospace" letterSpacing="1">{sub}</text>
    </motion.g>
  )
}

function LeafNode({
  cx, cy, hw, hh, l1, l2, delay, isInView, branch, onClick, dotDelay, dotDur,
}: (typeof LEAVES)[0] & { delay: number; isInView: boolean; onClick: () => void }) {
  const col     = branch === "out" ? "rgba(0,210,255," : "rgba(255,0,127,"
  const textCol = branch === "out" ? "rgba(0,210,255,0.75)" : "rgba(255,0,127,0.75)"
  const dotFill = branch === "out" ? "rgba(0,210,255,0.9)"  : "rgba(255,0,127,0.9)"
  return (
    <motion.g
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 280, damping: 22 }}
      style={{ transformOrigin: `${cx}px ${cy}px`, cursor: "pointer" }}
    >
      <rect x={cx - hw - 2} y={cy - hh - 2} width={hw * 2 + 4} height={hh * 2 + 4}
        fill="none" stroke={`${col}0.08)`} strokeWidth={6} rx={1} />
      <rect x={cx - hw} y={cy - hh} width={hw * 2} height={hh * 2}
        fill="rgba(0,0,0,0.85)" stroke={`${col}0.55)`} strokeWidth={0.75} rx={1} />
      <rect x={cx - hw} y={cy - hh} width={hw * 2} height={1.5} fill={`${col}0.7)`} />
      <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="11"
        fontFamily="monospace" fontWeight="700" letterSpacing="1.5">{l1}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={textCol} fontSize="10"
        fontFamily="monospace" letterSpacing="1">{l2}</text>
      {/* CSS keyframe pulse — fixed delay, no Math.random() in render */}
      <circle cx={cx + hw - 7} cy={cy - hh + 7} r={2} fill={dotFill}
        style={{ animation: `agentPulse ${dotDur} ease-in-out ${dotDelay} infinite` }} />
    </motion.g>
  )
}

export function Agents() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const router = useRouter()

  return (
    <section id="agents" className="py-16 md:py-28 px-4 md:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-baseline justify-between border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white" style={{ fontFamily: "var(--font-orbitron)" }}>Projects</h2>
        </motion.div>

        {/* Desktop SVG tree */}
        <div ref={ref} className="hidden md:block w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <svg
              viewBox="0 0 1040 400"
              className="w-full"
              style={{ filter: "drop-shadow(0 0 1px rgba(255,0,127,0.2))" }}
            >
              <defs>
                <style>{`
                  @keyframes agentPulse { 0%,100%{opacity:1} 50%{opacity:0.15} }
                `}</style>
                <pattern id="grid-agents" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="0" cy="0" r="0.6" fill="rgba(255,0,127,0.08)" />
                </pattern>
              </defs>
              <rect width="1040" height="400" fill="url(#grid-agents)" />

              {PATHS.map((p, i) => (
                <GlowPath key={i} d={p.d} delay={p.delay} isInView={isInView} />
              ))}

              <RootNode isInView={isInView} />
              <BranchNode {...INBOUND}  label="INBOUND"  sub="▲ RECEIVING"    delay={0.5} isInView={isInView} />
              <BranchNode {...OUTBOUND} label="OUTBOUND" sub="▼ TRANSMITTING" delay={0.5} isInView={isInView} color="cyan" />

              {LEAVES.map((leaf, i) => (
                <LeafNode key={leaf.l1} {...leaf} delay={1.4 + i * 0.1} isInView={isInView}
                  onClick={() => router.push(`/agents/${leaf.slug}`)} />
              ))}
            </svg>
          </div>
        </div>

        {/* Mobile: card layout */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          <div>
            <div className="mb-3 flex items-center gap-3 border border-pink-500/30 bg-pink-500/5 px-4 py-2">
              <span className="font-mono text-xs font-bold tracking-widest text-pink-500">▲ INBOUND</span>
              <div className="h-px flex-1 bg-pink-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LEAVES.filter((l) => l.branch === "in").map((leaf) => (
                <motion.div
                  key={leaf.l1}
                  onClick={() => router.push(`/agents/${leaf.slug}`)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="cursor-pointer border border-zinc-800 bg-zinc-950/60 p-3 hover:border-pink-500/40 transition-colors"
                >
                  <p className="font-mono text-[10px] font-bold tracking-widest text-white">{leaf.l1}</p>
                  <p className="font-mono text-[10px] tracking-widest text-pink-500/70">{leaf.l2}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-3 border border-cyan-500/30 bg-cyan-500/5 px-4 py-2">
              <span className="font-mono text-xs font-bold tracking-widest text-cyan-400">▼ OUTBOUND</span>
              <div className="h-px flex-1 bg-cyan-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LEAVES.filter((l) => l.branch === "out").map((leaf) => (
                <motion.div
                  key={leaf.l1}
                  onClick={() => router.push(`/agents/${leaf.slug}`)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="cursor-pointer border border-zinc-800 bg-zinc-950/60 p-3 hover:border-cyan-500/40 transition-colors"
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
