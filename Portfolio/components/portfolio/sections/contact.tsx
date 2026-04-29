"use client"

import { useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Mail, Globe, Code2 } from "lucide-react"
import Image from "next/image"

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

function AvatarTilt() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(springY, [-0.5, 0.5], [14, -14])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14])

  const shineX = useTransform(springX, [-0.5, 0.5], [0, 100])
  const shineY = useTransform(springY, [-0.5, 0.5], [0, 100])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    setHovering(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 900 }}
      className="cursor-pointer select-none"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }}
        className="relative w-52 overflow-hidden border border-pink-500/30"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: hovering
            ? "0 0 30px rgba(255,0,127,0.25), 0 0 60px rgba(255,0,127,0.1)"
            : "0 0 15px rgba(255,0,127,0.1)",
        }}
      >
        {/* Image */}
        <div className="relative h-72 w-full">
          <Image
            src="/avatar.png"
            alt="Shafia Bahar"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Scan lines */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
          }}
        />

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        {/* Mouse shine */}
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,0,127,0.18) 0%, transparent 65%)`,
            opacity: hovering ? 1 : 0,
          }}
        />

        {/* Top accent bar */}
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-pink-500 via-pink-400 to-transparent opacity-60" />

        {/* Corner brackets */}
        <div className="absolute left-2 top-2 h-3 w-3 border-l border-t border-pink-500/70" />
        <div className="absolute right-2 top-2 h-3 w-3 border-r border-t border-pink-500/70" />
        <div className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-pink-500/70" />
        <div className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-pink-500/70" />
      </motion.div>

      {/* Label row */}
      <div className="mt-3 flex items-center justify-between font-mono text-[9px] tracking-widest">
        <span className="text-zinc-600">IDENTITY_CONFIRMED</span>
        <span className="flex items-center gap-1 text-pink-500">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-pink-500" />
          ONLINE
        </span>
      </div>
    </div>
  )
}

export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="contact" className="py-28 px-4 md:px-16">
      <div className="mx-auto max-w-5xl">
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

        <div ref={ref} className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-start"
          >
            <AvatarTilt />
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-zinc-900 bg-zinc-950/50 p-7 font-mono text-sm"
          >
            {terminalLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="mb-2 text-zinc-500"
              >
                <span className="text-pink-500">&gt; </span>
                {line}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 + terminalLines.length * 0.12 }}
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
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
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
