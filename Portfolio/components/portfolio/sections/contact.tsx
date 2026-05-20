"use client"

import { useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowUpRight, ExternalLink, Send } from "lucide-react"
import Image from "next/image"

// Sign up free at formspree.io → create a form → paste your form ID here
const FORMSPREE_ID = "maqvdobr"

const socials = [
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/shafiaa.ai/",
  },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/shafia-b-05810427a/",
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
        className="animate-float-xslow relative w-64 overflow-hidden border border-pink-500/30"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: hovering
            ? "0 0 40px rgba(255,0,127,0.3), 0 0 80px rgba(255,0,127,0.12)"
            : "0 0 20px rgba(255,0,127,0.1)",
        }}
      >
        <div className="relative h-80 w-full">
          <Image src="/avatar.png" alt="Shafia Bahar" fill sizes="256px" className="object-cover object-top" priority />
        </div>

        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)" }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        <motion.div className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,0,127,0.18) 0%, transparent 65%)`,
            opacity: hovering ? 1 : 0,
          }} />

        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-pink-500 via-pink-400 to-transparent opacity-60" />
        <div className="absolute left-2 top-2 h-3 w-3 border-l border-t border-pink-500/70" />
        <div className="absolute right-2 top-2 h-3 w-3 border-r border-t border-pink-500/70" />
        <div className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-pink-500/70" />
        <div className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-pink-500/70" />
      </motion.div>

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

type Status = "idle" | "sending" | "sent" | "error"

export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, message, _replyto: email }),
      })
      if (res.ok) {
        setStatus("sent")
        setEmail("")
        setMessage("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="py-16 md:py-28 px-4 md:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-baseline gap-4 border-b border-zinc-800 pb-4"
        >
          <h2 className="text-2xl text-white">UPLINK_TERMINAL</h2>
          <span className="font-mono text-xs text-pink-500">ESTABLISH_CONNECTION</span>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-16 md:items-center">

          {/* Left — CTA + form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* Availability */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="font-mono text-[11px] tracking-widest text-zinc-400">OPEN TO NEW PROJECTS</span>
            </div>

            {/* Headline */}
            <h3
              className="text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Let's build<br />
              <span className="text-pink-500">something</span><br />
              real.
            </h3>

            {/* Contact form */}
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-pink-500/30 bg-pink-500/5 px-6 py-8 text-center"
              >
                <p className="font-mono text-sm tracking-widest text-pink-400">MESSAGE_RECEIVED</p>
                <p className="mt-2 font-mono text-xs text-zinc-500">I'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="YOUR_EMAIL"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="border border-zinc-800 bg-zinc-950/60 px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-colors duration-200 focus:border-pink-500/50"
                />
                <textarea
                  placeholder="YOUR_MESSAGE"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="resize-none border border-zinc-800 bg-zinc-950/60 px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-colors duration-200 focus:border-pink-500/50"
                />
                {status === "error" && (
                  <p className="font-mono text-[11px] tracking-widest text-red-400">TRANSMISSION_FAILED — try again</p>
                )}
                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center justify-between border border-pink-500/40 bg-pink-500/5 px-6 py-3.5 transition-all duration-300 hover:border-pink-500/70 hover:bg-pink-500/10 hover:shadow-[0_0_30px_rgba(255,0,127,0.15)] disabled:opacity-50"
                >
                  <span className="font-mono text-sm tracking-widest text-pink-400">
                    {status === "sending" ? "TRANSMITTING..." : "SEND_MESSAGE"}
                  </span>
                  <Send className="h-4 w-4 text-pink-500 transition-transform duration-200 group-hover:translate-x-0.5" />
                </motion.button>
              </form>
            )}

            {/* Social links */}
            <div className="flex gap-3">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-zinc-800 px-4 py-2.5 font-mono text-[11px] tracking-widest text-zinc-400 transition-all duration-300 hover:border-zinc-600 hover:text-white"
                >
                  <ExternalLink className="h-3 w-3" />
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — Avatar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center md:justify-end"
          >
            <AvatarTilt />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
