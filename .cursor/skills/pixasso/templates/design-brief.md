# Pixasso Design Brief Template

Use this brief to extract critical requirements before designing any substantial digital experience. Ask only the questions necessary to remove ambiguity. If certain requirements are already obvious from the user's prompt or existing codebase, skip those sections.

---

## 1. Product Context
- **Product Name & Type**: What are we building (SaaS tool, mobile app, marketing landing, portfolio, dashboard, editorial publication)?
- **Primary Goal**: What is the single most important action a user should take on this interface?
- **Key Information**: What data or messaging must be understood within the first 5 seconds?
- **Desired Perception**: What emotional response should the interface evoke (authoritative, effortless, playful, technical, tranquil, inspiring)?

---

## 2. Audience Profile
- **Target User**: Who will use this tool daily (engineers, executives, creatives, consumers, students)?
- **Design & Tech Literacy**: Are they accustomed to keyboard shortcuts, density, and technical jargon, or do they expect guided simplicity?
- **Usage Environment**: Will this be viewed on widescreen monitors, mobile devices on the go, or low-light terminal displays?

---

## 3. Platform and Form Factor
- **Primary Target**: Web, Mobile Responsive, Native iOS/Android, Desktop App (Electron/Tauri), Embedded, Presentation.
- **Form Factors**: Mobile (390px), Tablet (768px), Laptop (1280px), Desktop (1440px+).

---

## 4. Visual Direction and Aesthetics
- **Aesthetic Tone**: Minimalist, editorial, brutalist, technical, playful, luxury, tactile/skeuomorphic, industrial, retro-futuristic.
- **Reference Benchmarks**: Specific sites, products, or artists whose craft you admire.
- **Explicit Anti-Patterns**: Visual tropes, styles, or patterns you want to avoid completely.

---

## 5. Dimensionality
- **Target Strategy**: 2D (planar), 2.5D (layered parallax and depth), 3D (spatial WebGL scene), or Hybrid.
- **Rationale**: Why does this dimensionality choice serve the user's core task?

---

## 6. Motion Budget and Behavior
- **Intensity Level**:
  - *Restrained*: Purely communicative state transitions (under 250ms).
  - *Polished*: Layered scroll reveals, smooth component docking, tactile press physics.
  - *Kinetic*: Immersive narrative storytelling, choreographed sequences, interactive canvas physics.
- **Scroll Role**: Is scroll linear reading, or does scroll drive step-by-step canvas transformations?

---

## 7. Technical and Engineering Constraints
- **Stack & Framework**: React, Next.js, Svelte, Vue, Astro, HTML/Tailwind, WebGL/Three.js.
- **Animation Engine**: Motion, GSAP, React Spring, CSS transitions, Web Animations API.
- **Performance Budget**: Target maximum bundle size, first contentful paint (FCP), target devices.
- **Accessibility Requirements**: WCAG 2.1 AA or AAA compliance, keyboard tab order, screen reader support.

---

## 8. Asset Requirements
- **Asset Types Needed**: Custom SVG icons, generative backgrounds, photography, 3D glTF models, custom typography.
- **Asset Sourcing**: User-supplied, procedural generation (Haikei, Canvas), or AI generated concept imagery.
