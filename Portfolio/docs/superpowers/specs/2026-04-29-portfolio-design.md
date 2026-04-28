# Portfolio Website — Design Spec
**Date:** 2026-04-29  
**Owner:** Shafia Bahar  

---

## Overview

A single-page portfolio for Shafia Bahar, Forward Deployed AI Engineer at Karing.ai. Neural/cyberpunk aesthetic — dark background, neon pink accents — with a cinematic, high-end feel achieved through Framer Motion scroll animations, dramatic lighting effects, and generous spacing. The site uses Next.js 16 App Router, Tailwind CSS v4, TypeScript, and shadcn component structure.

---

## Design Principles

- **Cinematic over busy** — wide section padding, slow deliberate animations, film-quality gradients
- **Dark and immersive** — `#000` base, `#FF007F` as the sole accent colour, zinc greys for text
- **Motion with purpose** — every animation reveals or emphasises; nothing decorative for its own sake
- **Monospace identity** — section labels, badges, and data use `font-mono`; headings use bold sans

---

## Architecture

### File structure

```
app/
  page.tsx                          ← renders <Portfolio />
  layout.tsx                        ← existing, keep
  globals.css                       ← extend with cinematic utilities

components/
  portfolio/
    portfolio.tsx                   ← page shell: nav + sections + footer
    sections/
      hero.tsx
      about.tsx
      projects.tsx
      process.tsx
      experience.tsx
      contact.tsx
  ui/
    splite.tsx                      ← exists ✓
    spotlight.tsx                   ← exists ✓
    card.tsx                        ← exists ✓
    button.tsx                      ← exists ✓
    badge.tsx                       ← needs creating
    radial-orbital-timeline.tsx     ← needs creating
```

### Component responsibility

| File | Responsibility |
|------|---------------|
| `portfolio.tsx` | Fixed nav, section scroll refs, footer |
| `hero.tsx` | Split layout — text left, SplineScene right |
| `about.tsx` | Terminal-style bio panel |
| `projects.tsx` | 2×2 project card grid with Spotlight |
| `process.tsx` | RadialOrbitalTimeline — 5-node process |
| `experience.tsx` | Vertical cyberpunk timeline |
| `contact.tsx` | Terminal prompt + link cards |

---

## Sections

### 1. Navigation (fixed, top)

- Black background with `backdrop-blur`, thin pink bottom glow shadow
- Brand: `ENGINEER_PORTFOLIO_V4.0` in pink mono
- Links: CORE · PROJECTS · PROCESS · LOGS · CONTACT (smooth scroll)
- Right: animated ping dot + `ONLINE` indicator
- Mobile: bottom tab bar (existing pattern, keep)

### 2. Hero

**Layout:** 50/50 split. Left column text, right column 3D scene.

**Left column:**
- Animated badge: `■ SYSTEM_ACTIVE // V4.0.2` with pulsing dot
- Name: `SHAFIA BAHAR` — large, bold, white, staggered letter reveal on load
- Title: `FORWARD DEPLOYED AI ENGINEER` — pink, wide tracking
- Bio: "Building voice-first AI systems and autonomous healthcare workflows at the intersection of LLMs and real-world operations." — zinc-400, left border accent
- CTAs: `VIEW_PROJECTS` (pink fill) · `CONTACT` (pink outline)

**Right column:**
- `<SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />`
- Subtle radial pink glow behind the scene
- Render coords overlay in bottom-left (cosmetic `font-mono` label)
- Full height, no border — bleeds into the black background

**Cinematic touch:** Left column content fades + slides up on mount via Framer Motion. Right scene fades in with a 0.4s delay.

### 3. About — `MISSION_LOG`

- Full-width dark panel (`zinc-950/50`), subtle pink radial glow at centre
- Section label: `MISSION_LOG // ARCHITECT_BIO`
- Terminal text block, monospace, line-by-line reveal animation on scroll entry:
  ```
  > INITIALIZING ARCHITECT DATA...
  > Shafia Bahar is a Forward Deployed AI Engineer at Karing.ai,
    specialising in voice AI systems and healthcare automation.
  > Core stack: LiveKit · n8n · Athenahealth · Python · LLMs.
    Building AI agents that replace manual clinical workflows —
    from appointment booking to prescription refills.
  > BSCS candidate at IOBM — expected graduation: June 2026.
  > Status: Deployed. Iterating. Building in production.
  > █  (blinking cursor)
  ```

### 4. Projects — `NODE_WORKFLOW_V2`

**Layout:** 2×2 grid of `<Card>` components. Each card uses the aceternity `<Spotlight>` for the hover glow effect.

| # | Title | Description | Chips |
|---|-------|-------------|-------|
| 1 | Healthcare Voice AI Agent | AI that picks up calls and books appointments autonomously — zero human intervention | LiveKit · n8n · Athenahealth |
| 2 | Prescription Refill Agent | Voice AI that handles refill requests end-to-end, syncing directly with patient records | LiveKit · Athenahealth · Python |
| 3 | Provider Matching System | Smart matching logic pairing patients to the right doctor based on exact insurance coverage | n8n · Athenahealth · LLMs |
| 4 | Voice + Automation Workflows | End-to-end pipeline connecting voice conversations to backend systems — every call triggers real clinical actions | LiveKit · n8n · Webhooks |

Each card: icon (lucide), title, description, tech chips, hover border transitions to pink.

**Cinematic touch:** Cards stagger-fade into view on scroll (0.1s delay between each).

### 5. Process — `DEPLOY_PROTOCOL`

Uses `<RadialOrbitalTimeline>` full-section, dark background.

**5 nodes:**

| id | title | date | content | icon | status | energy | relatedIds |
|----|-------|------|---------|------|--------|--------|------------|
| 1 | Client Intake | Phase 01 | First contact — deep-dive into requirements, pain points, and success criteria before writing a single line of code. | `Users` | completed | 100 | [2] |
| 2 | Architecture | Phase 02 | System design, tech selection (LiveKit, n8n, Athenahealth), timeline estimation, and risk mapping. | `Layers` | completed | 88 | [1, 3] |
| 3 | Build | Phase 03 | Rapid implementation with daily check-ins. Voice pipelines, automation workflows, EHR integrations — shipped iteratively. | `Zap` | in-progress | 72 | [2, 4] |
| 4 | Test | Phase 04 | End-to-end QA on real patient flows. Edge-case handling, load testing, clinical data validation. | `FlaskConical` | in-progress | 55 | [3, 5] |
| 5 | Deploy | Phase 05 | Production release with monitoring, rollback plan, and handoff documentation. Zero-downtime deployments. | `Rocket` | pending | 35 | [4] |

Section label above the orbital: `DEPLOY_PROTOCOL // HOW_I_WORK`

### 6. Experience — `DEPLOY_HISTORY`

Vertical timeline, left pink line, nodes as square markers.

| Period | Role | Company | Type |
|--------|------|---------|------|
| June 2025 → Present | Forward Deployed Engineer | Karing.ai | FULL_TIME (active — glowing dot) |
| 2024 → 2025 | AI Automation Engineer | Freelance | FREELANCE |
| 2023 → 2024 | Data Engineer Intern | 1Archiver | INTERNSHIP |
| 2022 → June 2026 | BS Computer Science | IOBM | EDUCATION |

**Cinematic touch:** Each entry slides in from the left on scroll, staggered by 0.15s.

### 7. Contact — `UPLINK_TERMINAL`

Two-column layout:

**Left — terminal prompt:**
```
> UPLINK_ESTABLISHED
> STATUS: ACCEPTING_NEW_MISSIONS
> PING: shafia.akbar1@gmail.com
> NETWORK: linkedin/shafia-b
> REPO: github/shafiaakbar
> █
```

**Right — link cards (3 rows):**
- ✉ EMAIL — shafia.akbar1@gmail.com → `mailto:` link
- in LINKEDIN — linkedin.com/in/shafia-b-05810427a → external link
- ⬡ GITHUB — github.com/shafiaakbar → external link

### 8. Footer

- `ENGINEER_PORTFOLIO_V4.0 // SYSTEM_STABLE`
- Links: ROOT · SSH · UPLINK (cosmetic, no destination required)

---

## Cinematic Animation Strategy (Framer Motion)

| Element | Animation |
|---------|-----------|
| Hero name | Staggered letter/word reveal, 0.05s per word, on mount |
| Hero left col | `y: 20 → 0`, `opacity: 0 → 1`, duration 0.6s |
| Hero scene | `opacity: 0 → 1`, delay 0.4s |
| Section headings | Slide up + fade on scroll entry (`whileInView`) |
| About terminal lines | Sequential reveal, 0.15s stagger, on scroll entry |
| Project cards | Stagger fade-in, 0.1s between cards |
| Timeline entries | Slide in from left, 0.15s stagger |
| Global scroll | Native smooth scroll via CSS `scroll-behavior: smooth` |

---

## Component Dependencies

| Component | Status | Action |
|-----------|--------|--------|
| `splite.tsx` | ✅ exists | Use as-is |
| `spotlight.tsx` | ✅ exists | Use as-is (aceternity SVG version) |
| `card.tsx` | ✅ exists | Use as-is |
| `button.tsx` | ✅ exists | Use as-is |
| `badge.tsx` | ❌ missing | Create from provided source |
| `radial-orbital-timeline.tsx` | ❌ missing | Create from provided source |
| `framer-motion` | ✅ installed | Use for all animations |
| `lucide-react` | ✅ installed | Icons throughout |
| `@radix-ui/react-slot` | ❌ missing | `npm install @radix-ui/react-slot` — required by badge + button |

---

## Content Reference

- **Name:** Shafia Bahar  
- **Email:** shafia.akbar1@gmail.com  
- **LinkedIn:** https://www.linkedin.com/in/shafia-b-05810427a/  
- **GitHub:** github.com/shafiaakbar  
- **Spline scene:** https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode  

---

## Out of Scope

- Dark/light mode toggle (dark only)
- Blog or writing section
- CMS or dynamic data fetching
- Resume PDF download (not requested)
- Certifications section (not selected)
- Mobile-specific animations (keep existing bottom tab nav, no new mobile-only work)
