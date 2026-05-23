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

    let mx = -100, my = -100
    let dx = -100, dy = -100
    let rx = -100, ry = -100
    let visible = false
    let raf: number

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    function tick() {
      dx = lerp(dx, mx, 0.28)
      dy = lerp(dy, my, 0.28)
      rx = lerp(rx, mx, 0.08)
      ry = lerp(ry, my, 0.08)
      dot!.style.transform  = `translate3d(${dx - 3}px,${dy - 3}px,0)`
      ring!.style.transform = `translate3d(${rx - 16}px,${ry - 16}px,0)`
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity  = "1"
        ring.style.opacity = "1"
      }
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener("mousemove", onMove, { passive: true })
    document.body.style.cursor = "none"

    return () => {
      cancelAnimationFrame(raf)
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
