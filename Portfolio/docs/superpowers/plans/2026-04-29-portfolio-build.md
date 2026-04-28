# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Shafia Bahar's neural/cyberpunk portfolio replacing the existing `neural-portfolio.tsx` monolith with a cinematic 7-section single-page site.

**Architecture:** Section-based component architecture — `components/portfolio/portfolio.tsx` shell renders 6 focused section components from `components/portfolio/sections/`. Framer Motion drives all scroll-triggered and mount animations. SplineScene, Card, Spotlight, and RadialOrbitalTimeline are wired into their respective sections.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, TypeScript, Framer Motion v12, shadcn component structure, lucide-react v1.11.0, @splinetool/react-spline

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `package.json` | Add @radix-ui/react-slot |
| Create | `components/ui/badge.tsx` | Badge component (needed by radial-orbital-timeline) |
| Create | `components/ui/radial-orbital-timeline.tsx` | Interactive orbital timeline |
| Create | `components/portfolio/portfolio.tsx` | Page shell: fixed nav, renders sections, footer, mobile nav |
| Create | `components/portfolio/sections/hero.tsx` | Split hero: text left, SplineScene right |
| Create | `components/portfolio/sections/about.tsx` | Terminal bio with line-by-line reveal |
| Create | `components/portfolio/sections/projects.tsx` | 2×2 project card grid with Spotlight |
| Create | `components/portfolio/sections/process.tsx` | RadialOrbitalTimeline with 5 process nodes |
| Create | `components/portfolio/sections/experience.tsx` | Cyberpunk vertical timeline |
| Create | `components/portfolio/sections/contact.tsx` | Terminal prompt + link cards |
| Modify | `app/page.tsx` | Replace NeuralPortfolio with Portfolio |
| Modify | `app/globals.css` | Add smooth scroll + section spacing |

---

## Task 1: Install @radix-ui/react-slot

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install the dependency**

```bash
npm install @radix-ui/react-slot
```

Expected output includes `added 1 package` (or similar).

- [ ] **Step 2: Verify it installed**

```bash
ls node_modules/@radix-ui/react-slot
```

Expected: directory listing with `package.json`, `dist/`, etc.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: install @radix-ui/react-slot"
```

---

## Task 2: Create badge.tsx

**Files:**
- Create: `components/ui/badge.tsx`

- [ ] **Step 1: Create the file**

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/badge.tsx
git commit -m "feat: add Badge UI component"
```

---

## Task 3: Create radial-orbital-timeline.tsx

**Files:**
- Create: `components/ui/radial-orbital-timeline.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];
      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulseEffect[relId] = true; });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval>;
    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
      }, 50);
    }
    return () => { if (rotationTimer) clearInterval(rotationTimer); };
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed": return "text-white bg-black border-white";
      case "in-progress": return "text-black bg-white border-black";
      case "pending": return "text-white bg-black/40 border-white/50";
      default: return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70" />
            <div className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-50" style={{ animationDelay: "0.5s" }} />
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md" />
          </div>

          <div className="absolute w-96 h-96 rounded-full border border-white/10" />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform
                    ${isExpanded ? "bg-white text-black border-white shadow-lg shadow-white/30 scale-150"
                      : isRelated ? "bg-white/50 text-black border-white animate-pulse"
                      : "bg-black text-white border-white/40"}`}
                >
                  <Icon size={16} />
                </div>
                <div className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${isExpanded ? "text-white scale-125" : "text-white/70"}`}>
                  {item.title}
                </div>
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-black/90 backdrop-blur-lg border-white/30 shadow-xl shadow-white/10 overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "COMPLETE" : item.status === "in-progress" ? "IN PROGRESS" : "PENDING"}
                        </Badge>
                        <span className="text-xs font-mono text-white/50">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/80">
                      <p>{item.content}</p>
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center"><Zap size={10} className="mr-1" />Energy Level</span>
                          <span className="font-mono">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${item.energy}%` }} />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-white/70 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">Connected Nodes</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 text-white/60" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/badge.tsx components/ui/radial-orbital-timeline.tsx
git commit -m "feat: add RadialOrbitalTimeline and Badge UI components"
```

---

## Task 4: Create portfolio.tsx shell

**Files:**
- Create: `components/portfolio/portfolio.tsx`
- Create: `components/portfolio/sections/` (directory, via file creation)

- [ ] **Step 1: Create portfolio.tsx**

```tsx
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
```

Note: this file imports from `./sections/*` which don't exist yet — that's fine, TypeScript will error until all section files are created. Create placeholder stubs in the next step.

- [ ] **Step 2: Create stub files so TypeScript resolves imports**

Create `components/portfolio/sections/hero.tsx`:
```tsx
"use client"
export function Hero() { return <section id="core" /> }
```

Create `components/portfolio/sections/about.tsx`:
```tsx
"use client"
export function About() { return <section id="about" /> }
```

Create `components/portfolio/sections/projects.tsx`:
```tsx
"use client"
export function Projects() { return <section id="projects" /> }
```

Create `components/portfolio/sections/process.tsx`:
```tsx
"use client"
export function Process() { return <section id="process" /> }
```

Create `components/portfolio/sections/experience.tsx`:
```tsx
"use client"
export function Experience() { return <section id="logs" /> }
```

Create `components/portfolio/sections/contact.tsx`:
```tsx
"use client"
export function Contact() { return <section id="contact" /> }
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/portfolio/
git commit -m "feat: add Portfolio shell and section stubs"
```

---

## Task 5: Implement hero.tsx

**Files:**
- Modify: `components/portfolio/sections/hero.tsx`

- [ ] **Step 1: Replace the stub with the full implementation**

```tsx
"use client"

import { motion } from "framer-motion"
import { SplineScene } from "@/components/ui/splite"

export function Hero() {
  return (
    <section id="core" className="relative min-h-screen">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-pink-500 opacity-[0.07] blur-[140px]" />
      </div>

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center px-8 py-24 pt-28 md:px-16 gap-7 relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex w-fit items-center gap-2 border border-pink-500/30 bg-pink-500/5 px-3 py-1 font-mono text-xs tracking-widest text-pink-500"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
            </span>
            SYSTEM_ACTIVE // V4.0.2
          </motion.div>

          {/* Name */}
          <div>
            {["SHAFIA", "BAHAR"].map((word, i) => (
              <motion.h1
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.25 + i * 0.12 }}
                className="text-6xl font-black leading-none tracking-wider text-white md:text-7xl"
              >
                {word}
              </motion.h1>
            ))}
          </div>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.52 }}
            className="font-mono text-sm tracking-[0.3em] text-pink-500"
          >
            FORWARD DEPLOYED AI ENGINEER
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.62 }}
            className="max-w-md border-l-2 border-zinc-800 pl-4 leading-relaxed text-zinc-400"
          >
            Building voice-first AI systems and autonomous healthcare workflows
            at the intersection of LLMs and real-world operations.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.72 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <button
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-pink-600 px-6 py-3 text-sm font-semibold tracking-widest text-black shadow-[0_0_18px_rgba(255,0,127,0.35)] transition hover:bg-pink-500"
            >
              VIEW_PROJECTS
            </button>
            <button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="border border-pink-500 px-6 py-3 text-sm font-semibold tracking-widest text-pink-500 transition hover:bg-pink-500/10"
            >
              CONTACT
            </button>
          </motion.div>
        </motion.div>

        {/* Right — Spline 3D */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="relative hidden md:block"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,0,127,0.07),transparent_70%)]" />
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
          <p className="absolute bottom-4 left-4 font-mono text-[10px] text-pink-500/30">
            RENDER_ENGINE: NEURAL_VIZ_4 // COORD: 45.23.001.X9
          </p>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/portfolio/sections/hero.tsx
git commit -m "feat: implement Hero section with SplineScene"
```

---

## Task 6: Implement about.tsx

**Files:**
- Modify: `components/portfolio/sections/about.tsx`

- [ ] **Step 1: Replace the stub**

```tsx
"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const lines: { text: string; highlight?: string }[] = [
  { text: "> INITIALIZING ARCHITECT DATA...", highlight: "cmd" },
  { text: "> Shafia Bahar is a Forward Deployed AI Engineer at Karing.ai," },
  { text: "  specialising in voice AI systems and healthcare automation." },
  { text: "> Core stack: LiveKit · n8n · Athenahealth · Python · LLMs." },
  { text: "  Building AI agents that replace manual clinical workflows —" },
  { text: "  from appointment booking to prescription refills." },
  { text: "> BSCS candidate at IOBM — expected graduation: June 2026." },
  { text: "> Status: Deployed. Iterating. Building in production." },
]

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="about" className="py-28 px-4 md:px-16">
      <div className="mx-auto max-w-4xl">
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

        <div
          ref={ref}
          className="relative overflow-hidden border border-zinc-900 bg-zinc-950/50 p-8 font-mono text-sm leading-relaxed"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,127,0.025),transparent)]" />
          <div className="space-y-2">
            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.13 }}
                className={
                  line.highlight === "cmd"
                    ? "text-pink-500/60"
                    : line.text.startsWith("  ")
                    ? "pl-4 text-zinc-600"
                    : "text-zinc-400"
                }
              >
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: lines.length * 0.13 }}
              className="animate-pulse text-pink-500"
            >
              &gt; █
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/portfolio/sections/about.tsx
git commit -m "feat: implement About section with terminal reveal"
```

---

## Task 7: Implement projects.tsx

**Files:**
- Modify: `components/portfolio/sections/projects.tsx`

- [ ] **Step 1: Replace the stub**

```tsx
"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Phone, Pill, UserCheck, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"

const projects = [
  {
    icon: Phone,
    title: "Healthcare Voice AI Agent",
    description:
      "AI that picks up calls and books appointments autonomously — functioning as a real front desk with zero human intervention.",
    chips: ["LiveKit", "n8n", "Athenahealth"],
  },
  {
    icon: Pill,
    title: "Prescription Refill Agent",
    description:
      "Voice AI that handles prescription refill requests end-to-end, syncing directly with patient records without data loss.",
    chips: ["LiveKit", "Athenahealth", "Python"],
  },
  {
    icon: UserCheck,
    title: "Provider Matching System",
    description:
      "Smart matching logic that pairs patients to the right doctor based on exact insurance coverage — no guessing, no manual lookups.",
    chips: ["n8n", "Athenahealth", "LLMs"],
  },
  {
    icon: Zap,
    title: "Voice + Automation Workflows",
    description:
      "End-to-end pipeline connecting voice conversations to backend systems — every call instantly triggers real clinical actions.",
    chips: ["LiveKit", "n8n", "Webhooks"],
  },
]

export function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="projects" className="py-28 px-4 md:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">NODE_WORKFLOW_V2</h2>
          <span className="font-mono text-xs text-pink-500">PROJECT_ORCHESTRATION</span>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 gap-px bg-zinc-900 md:grid-cols-2">
          {projects.map((project, i) => {
            const Icon = project.icon
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <Card className="group relative h-full overflow-hidden rounded-none border-zinc-900 bg-black transition-all duration-300 hover:border-pink-500/40">
                  <Spotlight
                    className="-left-10 -top-10 md:-left-6 md:-top-6"
                    fill="rgba(255, 0, 127, 0.12)"
                  />
                  <CardContent className="space-y-4 p-8">
                    <div className="flex h-10 w-10 items-center justify-center border border-zinc-800 bg-zinc-900 text-pink-500 transition group-hover:border-pink-500/40 group-hover:shadow-[0_0_10px_rgba(255,0,127,0.25)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-500">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.chips.map((chip) => (
                        <span
                          key={chip}
                          className="border border-zinc-800 bg-zinc-900/50 px-2 py-1 font-mono text-[10px] tracking-wider text-zinc-400"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/portfolio/sections/projects.tsx
git commit -m "feat: implement Projects section with Card and Spotlight"
```

---

## Task 8: Implement process.tsx

**Files:**
- Modify: `components/portfolio/sections/process.tsx`

- [ ] **Step 1: Replace the stub**

```tsx
"use client"

import { motion } from "framer-motion"
import { Users, Layers, Zap, FlaskConical, Rocket } from "lucide-react"
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline"

const processData = [
  {
    id: 1,
    title: "Client Intake",
    date: "Phase 01",
    content:
      "First contact — deep-dive into requirements, pain points, and success criteria before writing a single line of code.",
    category: "Discovery",
    icon: Users,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Architecture",
    date: "Phase 02",
    content:
      "System design, tech selection (LiveKit, n8n, Athenahealth), timeline estimation, and risk mapping.",
    category: "Design",
    icon: Layers,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 88,
  },
  {
    id: 3,
    title: "Build",
    date: "Phase 03",
    content:
      "Rapid implementation with daily check-ins. Voice pipelines, automation workflows, EHR integrations — shipped iteratively.",
    category: "Development",
    icon: Zap,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 72,
  },
  {
    id: 4,
    title: "Test",
    date: "Phase 04",
    content:
      "End-to-end QA on real patient flows. Edge-case handling, load testing, clinical data validation.",
    category: "QA",
    icon: FlaskConical,
    relatedIds: [3, 5],
    status: "in-progress" as const,
    energy: 55,
  },
  {
    id: 5,
    title: "Deploy",
    date: "Phase 05",
    content:
      "Production release with monitoring, rollback plan, and handoff documentation. Zero-downtime deployments.",
    category: "Release",
    icon: Rocket,
    relatedIds: [4],
    status: "pending" as const,
    energy: 35,
  },
]

export function Process() {
  return (
    <section id="process" className="py-8">
      <div className="mx-auto max-w-6xl px-4 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">DEPLOY_PROTOCOL</h2>
          <span className="font-mono text-xs text-pink-500">HOW_I_WORK</span>
        </motion.div>
      </div>
      <RadialOrbitalTimeline timelineData={processData} />
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/portfolio/sections/process.tsx
git commit -m "feat: implement Process section with RadialOrbitalTimeline"
```

---

## Task 9: Implement experience.tsx

**Files:**
- Modify: `components/portfolio/sections/experience.tsx`

- [ ] **Step 1: Replace the stub**

```tsx
"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const entries = [
  {
    period: "JUNE 2025 → PRESENT",
    role: "Forward Deployed Engineer",
    company: "KARING.AI",
    type: "FULL_TIME",
    active: true,
  },
  {
    period: "2024 → 2025",
    role: "AI Automation Engineer",
    company: "FREELANCE",
    type: "FREELANCE",
    active: false,
  },
  {
    period: "2023 → 2024",
    role: "Data Engineer Intern",
    company: "1ARCHIVER",
    type: "INTERNSHIP",
    active: false,
  },
  {
    period: "2022 → JUNE 2026",
    role: "BS Computer Science",
    company: "IOBM",
    type: "EDUCATION",
    active: false,
  },
]

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="logs" className="py-28 px-4 md:px-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">DEPLOY_HISTORY</h2>
          <span className="font-mono text-xs text-pink-500">MISSION_TIMELINE</span>
        </motion.div>

        <div ref={ref} className="ml-3 space-y-10 border-l border-pink-500/20 pl-8">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.company}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Timeline node */}
              <div
                className={`absolute -left-[41px] top-1 h-3 w-3 border ${
                  entry.active
                    ? "border-pink-500 bg-pink-500 shadow-[0_0_10px_rgba(255,0,127,0.8)]"
                    : "border-zinc-700 bg-black"
                }`}
              />
              <p className="mb-1 font-mono text-[10px] tracking-widest text-pink-500">
                {entry.period}
              </p>
              <h3 className="text-base font-bold text-white">{entry.role}</h3>
              <p className="font-mono text-xs tracking-widest text-zinc-500">{entry.company}</p>
              <span className="mt-2 inline-block border border-zinc-800 px-2 py-0.5 font-mono text-[9px] tracking-widest text-zinc-600">
                {entry.type}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/portfolio/sections/experience.tsx
git commit -m "feat: implement Experience timeline section"
```

---

## Task 10: Implement contact.tsx

**Files:**
- Modify: `components/portfolio/sections/contact.tsx`

- [ ] **Step 1: Replace the stub**

```tsx
"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, Globe, Code2 } from "lucide-react"

const terminalLines = [
  "UPLINK_ESTABLISHED",
  "STATUS: ACCEPTING_NEW_MISSIONS",
  "PING: shafia.akbar1@gmail.com",
  "NETWORK: linkedin/shafia-b",
  "REPO: github/shafiaakbar",
]

const links = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "shafia.akbar1@gmail.com",
    href: "mailto:shafia.akbar1@gmail.com",
    external: false,
  },
  {
    icon: Globe,
    label: "LINKEDIN",
    value: "linkedin/shafia-b-05810427a",
    href: "https://www.linkedin.com/in/shafia-b-05810427a/",
    external: true,
  },
  {
    icon: Code2,
    label: "GITHUB",
    value: "github/shafiaakbar",
    href: "https://github.com/shafiaakbar",
    external: true,
  },
]

export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="contact" className="py-28 px-4 md:px-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">UPLINK_TERMINAL</h2>
          <span className="font-mono text-xs text-pink-500">ESTABLISH_CONNECTION</span>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="border border-zinc-900 bg-zinc-950/50 p-7 font-mono text-sm"
          >
            {terminalLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.12 }}
                className="mb-2 text-zinc-500"
              >
                <span className="text-pink-500">&gt; </span>
                {line}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 + terminalLines.length * 0.12 }}
              className="animate-pulse text-pink-500"
            >
              &gt; █
            </motion.p>
          </motion.div>

          {/* Link cards */}
          <div className="flex flex-col gap-3">
            {links.map((link, i) => {
              const Icon = link.icon
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="group flex items-center gap-4 border border-zinc-900 bg-zinc-950/30 px-5 py-4 transition-all duration-300 hover:border-pink-500/30"
                >
                  <Icon className="h-4 w-4 text-pink-500 transition group-hover:drop-shadow-[0_0_5px_rgba(255,0,127,0.7)]" />
                  <div>
                    <p className="mb-0.5 font-mono text-[9px] tracking-widest text-zinc-600">
                      {link.label}
                    </p>
                    <p className="text-sm text-white">{link.value}</p>
                  </div>
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/portfolio/sections/contact.tsx
git commit -m "feat: implement Contact section"
```

---

## Task 11: Wire up page.tsx and update globals.css

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
import { Portfolio } from "@/components/portfolio/portfolio"

export default function Home() {
  return <Portfolio />
}
```

- [ ] **Step 2: Add smooth scroll to globals.css**

Add this at the end of `app/globals.css` (after the existing rules):

```css
html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run a production build to catch any runtime issues**

```bash
npm run build
```

Expected: `Route (app) / ... ✓ Compiled successfully` with no errors. Warnings about `@splinetool/react-spline` dynamic import size are expected and fine.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/globals.css
git commit -m "feat: wire up Portfolio to app/page.tsx"
```

---

## Task 12: Smoke-test in dev server

**Files:** none

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser.

- [ ] **Step 2: Verify each section renders**

Check in order:
- Nav: fixed top bar visible, ENGINEER_PORTFOLIO_V4.0 in pink
- Hero: "SHAFIA BAHAR" text animates in, Spline 3D scene loads on right (may take ~3s)
- About: scroll down — terminal lines reveal one by one
- Projects: 4 cards appear with stagger animation
- Process: orbital timeline renders, nodes rotate, click one to expand
- Experience: 4 timeline entries slide in from left
- Contact: terminal lines + 3 link cards render

- [ ] **Step 3: Verify smooth scroll nav works**

Click each nav link (CORE, PROJECTS, PROCESS, LOGS, CONTACT) — page should scroll smoothly to the correct section.

- [ ] **Step 4: Commit if any fixes were needed during smoke test**

```bash
git add -p
git commit -m "fix: smoke test corrections"
```

(Only run this step if you made fixes. Skip if everything worked first try.)
