# 3D System Viz Section — Design Spec

## Summary

A dedicated full-height scroll section inserted between the Hero and About sections. A Neural Voice Orb (Concept A) transitions into a 3D Pipeline Graph (Concept D) as the user scrolls. The object tells Shafia's story: voice input → AI processing → deployed automation system. Uses only already-installed dependencies (React Three Fiber, @react-three/drei, framer-motion, three).

---

## Placement

- **Location:** Between `<Hero />` and `<About />` in `portfolio.tsx`
- **Section ID:** `system-viz`
- **Height:** `300vh` (scroll container) with a sticky inner canvas that stays centered while scroll progress accumulates
- **Nav:** Not added to nav links — this is a visual interlude, not a named section

---

## Scroll Phases

The section uses a `useScroll` hook scoped to the section ref. Progress 0→1 drives all 3D transforms.

### Phase 1 — System Idle (progress 0–0.20)
- Orb fades in from `opacity 0, scale 0.6` → `opacity 1, scale 1.0`
- Slowly rotates on Y axis (continuous, 5s/revolution)
- Two orbit rings spin in opposite directions
- Waveform bar at equator breathes (scale Y oscillates)
- Mouse movement applies ±8° tilt via `useRef` tracking
- Label: `// NEURAL_NET_V1 · LISTENING`

### Phase 2 — Signal Detected (progress 0.20–0.40)
- Orbit rings detach and radiate outward as expanding pulse waves, fading to 0
- Core orb brightens (emissive intensity increases)
- Waveform bars reach peak height
- Orb scales up slightly: 1.0 → 1.15
- Label cycles: `PROCESSING...` → `UPLINK_ESTABLISHED`

### Phase 3 — System Deploy (progress 0.40–0.60)
- Orb sphere morphs: scale shrinks 1.15 → 0.4 (becomes a "core")
- 6 nodes eject from center, flying to fixed 3D positions
- Each node trails a glowing line (edge) back to center as it moves
- Nodes arrive at their positions and stabilize with a spring bounce
- Color split: 4 pink nodes (inbound agents), 2 cyan nodes (outbound agents)
- Feeling: microservice deploy, one system becoming many

### Phase 4 — Pipeline Active (progress 0.60–0.85)
- Full graph is visible: 6 nodes + 7 edges
- Animated data "pulses" (small glowing spheres) travel along each edge continuously
- Nodes labeled with real project names:
  - Pink: NEW PATIENT INTAKE, APPOINTMENT SCHEDULING, MEDICATION REFILL, IVR AGENTS
  - Cyan: INSURANCE VERIFICATION, REFERRAL VERIFICATION
- **Hover interaction:** hovering a node makes it glow brighter, shows a short label above it
- Camera slowly pans/rotates in 3D (auto-rotate, slow)

### Phase 5 — System Ready (progress 0.85–1.0)
- All nodes fly back toward center (reverse of Phase 3)
- Edges fade out as nodes collapse
- Single glowing pink dot remains at center, pulsing slowly
- Label: `// SYSTEM_READY · AWAITING_INPUT`
- Blinking cursor (`█`) appears below label
- Section cross-fades into the About section

---

## Interaction Details

| Trigger | Effect |
|---|---|
| Mouse move | ±8° tilt on X/Y axes via lerp (smooth, not snap) |
| Hover node (Phase 4) | Node emissive +50%, floating label appears above node |
| Scroll | All phase transitions — no click required |
| Mobile | Mouse parallax disabled; scroll phases still play; simplified geometry (fewer particles) |

---

## Visual Style

- **Background:** Transparent canvas over the page's `#050508` background
- **Orb material:** `MeshStandardMaterial` with `emissive: #ff007f`, metalness 0.3, roughness 0.1
- **Nodes:** Same material, pink = `#ff007f`, cyan = `#00d4ff`
- **Edges:** `Line` component from drei, dashed, 0.5 opacity
- **Pulse dots:** Small `MeshBasicMaterial` spheres, white/pink, no lighting needed
- **Ambient light:** Low (`intensity: 0.3`), one pink point light at camera position
- **Bloom:** `EffectComposer` + `Bloom` from `@react-three/postprocessing` — adds glow without custom shaders

---

## Component Structure

```
components/portfolio/sections/system-viz.tsx   ← section wrapper, scroll logic
components/portfolio/three/viz-canvas.tsx      ← R3F Canvas + scene
components/portfolio/three/orb.tsx             ← Phase 1–2 orb object
components/portfolio/three/pipeline.tsx        ← Phase 3–4 graph nodes + edges
components/portfolio/three/pulse-dot.tsx       ← animated data pulse on edges
```

---

## Tech Stack

| Concern | Library | Already installed |
|---|---|---|
| 3D rendering | `@react-three/fiber` | Yes |
| Helpers (Line, Float, etc.) | `@react-three/drei` | Yes |
| Scroll sync | `framer-motion` useScroll + useTransform | Yes |
| Post-processing / bloom | `@react-three/postprocessing` | **No — needs install** |
| Three.js primitives | `three` | Yes |

One new package needed: `@react-three/postprocessing` (for bloom glow effect). Lightweight, no breaking changes.

---

## Performance

- Canvas wrapped in `Suspense` with a fallback so it never blocks page render
- Geometry complexity: orb = `SphereGeometry(1, 32, 32)` (not high-poly)
- Nodes = 6 × `SphereGeometry(0.12, 16, 16)` — trivial
- Edges = `Line` components (no geometry, just BufferGeometry lines)
- Pulse dots = instanced mesh (single geometry, 7 instances)
- Mobile: reduce orb segments to `(1, 16, 16)`, disable post-processing bloom, disable mouse parallax
- `dpr={[1, 1.5]}` on Canvas (caps pixel ratio on high-DPI screens)

---

## Section Label / Copy

- Top of section: `// SYSTEM_ARCHITECTURE` (small monospace, pink, above the canvas)
- Phase labels (fade in/out per phase, positioned below the 3D object):
  - Phase 1: `NEURAL_NET_V1 · LISTENING`
  - Phase 2: `SIGNAL_DETECTED · PROCESSING`
  - Phase 3: `DEPLOYING_AGENTS...`
  - Phase 4: `06 AGENTS ACTIVE · ALL SYSTEMS NOMINAL`
  - Phase 5: `SYSTEM_READY · AWAITING_INPUT`

---

## What Is NOT in Scope

- Audio reactivity (no microphone input)
- GSAP (framer-motion scroll covers it)
- Custom GLSL shaders (standard materials + bloom achieve the look)
- Replacing the existing Spline robot in the hero (untouched)
