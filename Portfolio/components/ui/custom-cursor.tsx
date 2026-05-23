"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch/mobile — pointer is never shown
    if (window.matchMedia("(pointer: coarse)").matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let visible = false

    // Ring gets a CSS transition — compositor-driven, unaffected by JS jank
    ring.style.transition = "transform 0.18s ease-out"

    const onMove = (e: MouseEvent) => {
      // Dot snaps exactly to pointer — no lerp, no RAF delay
      dot.style.transform  = `translate3d(${e.clientX - 3}px,${e.clientY - 3}px,0)`
      // Ring follows via CSS transition on the compositor thread
      ring.style.transform = `translate3d(${e.clientX - 16}px,${e.clientY - 16}px,0)`
      if (!visible) {
        visible = true
        dot.style.opacity  = "1"
        ring.style.opacity = "1"
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    document.body.style.cursor = "none"

    return () => {
      window.removeEventListener("mousemove", onMove)
      document.body.style.cursor = ""
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border border-pink-500/50"
        style={{ opacity: 0, willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-pink-500"
        style={{ opacity: 0, willChange: "transform" }}
      />
    </>
  )
}
