"use client"

import Image from "next/image"
import {
  Activity,
  Binary,
  BrainCircuit,
  Cpu,
  Grid2X2,
  History,
  Layers,
  Radio,
  Terminal,
} from "lucide-react"

const skillBars = [
  { label: "MOD_01: REACT_JS / NEXT_JS", value: 95 },
  { label: "MOD_02: N8N / AUTOMATION", value: 98 },
  { label: "MOD_03: PYTHON / LLMS", value: 92 },
  { label: "MOD_04: CLOUD_INFRA / AWS", value: 88 },
]

export function NeuralPortfolio() {
  return (
    <main className="neural-body overflow-x-hidden pb-16 pt-14 text-zinc-200 md:pb-0">
      <header className="fixed left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-black/90 px-4 shadow-[0_0_10px_rgba(255,0,127,0.2)] backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-pink-500" />
          <span className="text-lg font-black tracking-widest text-pink-500">
            ENGINEER_PORTFOLIO_V4.0
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a className="text-sm font-semibold tracking-wider text-pink-500 drop-shadow-[0_0_8px_#FF007F]">
            CORE
          </a>
          <a className="text-sm font-semibold tracking-wider text-zinc-500 transition hover:text-pink-400">
            STACK
          </a>
          <a className="text-sm font-semibold tracking-wider text-zinc-500 transition hover:text-pink-400">
            AUTO
          </a>
          <a className="text-sm font-semibold tracking-wider text-zinc-500 transition hover:text-pink-400">
            LOGS
          </a>
        </div>
        <Radio className="h-5 w-5 text-pink-500" />
      </header>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-8 md:px-8">
        <section className="relative flex min-h-[707px] flex-col items-center justify-center pt-8">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
            <div className="h-[600px] w-[600px] rounded-full bg-pink-500 blur-[120px]" />
          </div>

          <div className="z-10 grid w-full grid-cols-1 items-center gap-8 md:grid-cols-12">
            <div className="space-y-6 md:col-span-5">
              <div className="inline-flex items-center gap-2 border border-pink-500/30 bg-pink-500/5 px-3 py-1 font-mono text-xs tracking-widest text-pink-500">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
                </span>
                SYSTEM_ACTIVE // V4.0.2
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl font-bold leading-none text-white md:text-6xl">
                  SHAFIA BAHAR
                </h1>
                <h2 className="text-2xl font-light tracking-[0.2em] text-pink-500">
                  NEURAL ARCHITECT
                </h2>
              </div>

              <p className="max-w-md border-l-2 border-zinc-800 pl-4 text-lg leading-relaxed text-zinc-400">
                Synthesizing autonomous ecosystems through advanced node
                orchestration and neural connectivity.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="neon-glow-pink bg-pink-600 px-6 py-3 text-sm font-semibold tracking-widest text-black transition hover:bg-pink-500">
                  INITIALIZE_CORE
                </button>
                <button className="border border-pink-500 px-6 py-3 text-sm font-semibold tracking-widest text-pink-500 transition hover:bg-pink-500/10">
                  VIEW_LOGS
                </button>
              </div>
            </div>

            <div className="relative h-[400px] md:col-span-7 md:h-[600px]">
              <div className="glass-panel group absolute inset-0 overflow-hidden border-pink-500/20">
                <Image
                  alt="3D abstract particle core"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsZB37stdk165AiuNl37EL8nx2Gp3PpCJa_C9o_UCz0YpJukRdvrF6cXP_0AhzkHfYeADxYceCzX0HUAzhMwfjDPB4s3Pwwl3FGRY9b-r52TGEokK3wNjx5CoezqXYoFNhipDtZjpTEOgVRjLETx__scJR8In46cLOrVGXsjCw-O8Lst9P0tYHk6lUxBvbUe7fz1B8bOf2Ba18GrI_L_iuq4IUGThmHKJRXwznho5zmCg-t8xoOB0xaUjfsg3iKWNLSSvm78GxdCXT"
                  fill
                  className="object-cover opacity-60 mix-blend-screen transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  <div className="h-1 w-24 bg-pink-500/40" />
                  <div className="h-1 w-16 self-end bg-pink-500/40" />
                </div>
                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-pink-500/60">
                  COORD: 45.23.001.X9
                  <br />
                  RENDER_ENGINE: NEURAL_VIZ_4
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-end gap-4 border-b border-zinc-800 pb-2">
            <h3 className="text-2xl text-white">NODE_WORKFLOW_V2</h3>
            <span className="mb-1 font-mono text-xs text-pink-500">
              PROJECT_ORCHESTRATION
            </span>
          </div>

          <div className="relative grid grid-cols-1 gap-0 md:grid-cols-3">
            {[
              {
                title: "Omni-Channel AI",
                desc: "Unified intelligence layer across fragmented communication streams with real-time semantic routing.",
                chips: ["GPT-4o", "n8n"],
                icon: <BrainCircuit className="h-5 w-5" />,
              },
              {
                title: "Predictive Ops",
                desc: "Infrastructure failure prediction engine utilizing historical logs and live telemetry data.",
                chips: ["Python", "AWS"],
                icon: <Activity className="h-5 w-5" />,
              },
              {
                title: "Neural Bridge",
                desc: "Low-latency bridge connecting legacy database protocols with generative AI interfaces.",
                chips: ["React", "Node"],
                icon: <Binary className="h-5 w-5" />,
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="glass-panel group relative cursor-pointer p-6 transition hover:border-pink-500"
              >
                {idx < 2 ? (
                  <div className="absolute -right-[1px] top-1/2 hidden h-[1px] w-8 bg-pink-500 md:block" />
                ) : null}
                <div className="space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-zinc-800 bg-zinc-900 text-pink-500 transition group-hover:neon-border-pink">
                    {item.icon}
                  </div>
                  <h4 className="text-xl text-white">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-zinc-500">{item.desc}</p>
                  <div className="flex gap-2">
                    {item.chips.map((chip) => (
                      <span
                        key={chip}
                        className="border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <div className="flex items-end gap-4 border-b border-zinc-800 pb-2">
              <h3 className="text-2xl text-white">MODULE_DIAGNOSTICS</h3>
              <span className="mb-1 font-mono text-xs text-pink-500">
                CAPABILITY_METRICS
              </span>
            </div>
            <div className="space-y-6">
              {skillBars.map((skill) => (
                <div key={skill.label} className="space-y-2">
                  <div className="flex justify-between font-mono text-xs text-zinc-400">
                    <span>{skill.label}</span>
                    <span className="text-pink-500">{skill.value}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden border border-zinc-800 bg-zinc-900">
                    <div
                      className="h-full bg-pink-500 shadow-[0_0_8px_#FF007F]"
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-end gap-4 border-b border-zinc-800 pb-2">
              <h3 className="text-2xl text-white">MISSION_LOG</h3>
              <span className="mb-1 font-mono text-xs text-pink-500">
                ARCHITECT_BIO
              </span>
            </div>
            <div className="relative overflow-hidden border border-zinc-900 bg-zinc-950/50 p-6 font-mono text-sm leading-relaxed text-zinc-400">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,127,0.03),transparent)]" />
              <div className="space-y-4">
                <p>&gt; INITIALIZING ARCHITECT DATA...</p>
                <p>
                  &gt; Shafia Bahar is a specialized AI Automation Engineer focused
                  on the intersection of human-computer interaction and autonomous
                  workflows.
                </p>
                <p>
                  &gt; Current objective: Scaling neural networks for enterprise
                  operations through decentralized node structures and low-latency
                  API integration.
                </p>
                <p>
                  &gt; Status: Constant iteration. Optimization complete. System
                  ready for new deployment.
                </p>
                <p className="animate-pulse">&gt; CURSOR_WAITING_</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-16 flex w-full flex-col items-center justify-between gap-4 border-t border-zinc-800 bg-zinc-950 px-6 py-6 md:flex-row">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-pink-600">
            ENGINEER_PORTFOLIO_V4.0
          </span>
          <span className="font-mono text-[9px] text-zinc-700">
            SYSTEM_STABLE: v2.4.0-RELEASE
          </span>
        </div>
        <div className="flex gap-8">
          {["ROOT", "SSH", "UPLINK"].map((item) => (
            <a
              key={item}
              className="font-mono text-[9px] uppercase text-zinc-700 transition hover:text-pink-400"
            >
              {item}
            </a>
          ))}
        </div>
      </footer>

      <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around border-t border-zinc-800 bg-black/95 md:hidden">
        {[
          { label: "CORE", icon: <Grid2X2 className="h-4 w-4" />, active: true },
          { label: "STACK", icon: <Layers className="h-4 w-4" /> },
          { label: "AUTO", icon: <Cpu className="h-4 w-4" /> },
          { label: "LOGS", icon: <History className="h-4 w-4" /> },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex h-full flex-1 flex-col items-center justify-center pt-1 ${
              item.active
                ? "border-t-2 border-pink-500 text-pink-500"
                : "text-zinc-600 hover:bg-pink-500/5"
            }`}
          >
            {item.icon}
            <span className="font-mono text-[10px] uppercase tracking-tight">
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </main>
  )
}
