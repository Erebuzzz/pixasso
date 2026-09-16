# Pixasso Design Mode Specification

A Design Mode is an exhaustive, project-specific blueprint that defines the visual and interaction contract for a product. It binds art direction to concrete engineering tokens so that design consistency remains immutable across all views, components, and collaborators.

---

## Design Mode: [Mode Name, e.g., Obsidian Editorial, Alpine Precision, Monolith Brutal]

### 1. Architectural Thesis
- **Concept Statement**: [One paragraph articulating the core aesthetic philosophy and emotional target.]
- **Dimensionality**: [2D / 2.5D Layered / 3D Spatial / Hybrid]
- **Target Audience Context**: [Professional context and mental model of the primary user.]

---

### 2. Typographic System
- **Display Typeface**: [Font Family Name] (Weights: [e.g., 600, 700])
- **Body Typeface**: [Font Family Name] (Weights: [e.g., 400, 500])
- **Code / Technical Typeface**: [Font Family Name] (Weights: [e.g., 400])
- **Scale Factor**: [e.g., Major Third 1.250 / Augmented Fourth 1.414]
- **Scale Hierarchy**:
  - H1: [e.g., clamp(2.5rem, 5vw, 4.5rem) / Line-height: 1.1 / Tracking: -0.025em]
  - H2: [e.g., clamp(2.0rem, 3.5vw, 3.0rem) / Line-height: 1.15 / Tracking: -0.02em]
  - H3: [e.g., 1.5rem / Line-height: 1.25 / Tracking: -0.01em]
  - Body Large: [e.g., 1.125rem / Line-height: 1.6 / Tracking: 0]
  - Body Default: [e.g., 1.0rem / Line-height: 1.6 / Tracking: 0]
  - Caption / Mono: [e.g., 0.8125rem / Line-height: 1.4 / Tracking: 0.04em]

---

### 3. Spatial and Grid Tokens
- **Base Spatial Unit**: [4px / 8px]
- **Spacing Scale**:
  - 3xs: 2px, 2xs: 4px, xs: 8px, sm: 12px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px, 4xl: 96px
- **Grid Structure**:
  - Desktop (1440px): [12-column, 24px gutter, 64px margins]
  - Tablet (768px): [8-column, 16px gutter, 32px margins]
  - Mobile (390px): [4-column, 12px gutter, 16px margins]

---

### 4. Color and Material Architecture
- **Canvas Base**: [e.g., #0B0D11]
- **Panel Surface**: [e.g., #13161F]
- **Elevated Overlay**: [e.g., #1A1E2B]
- **Border Default**: [e.g., rgba(255, 255, 255, 0.08)]
- **Border Active**: [e.g., rgba(255, 255, 255, 0.22)]
- **Text Primary**: [e.g., #F3F4F6]
- **Text Secondary**: [e.g., #9CA3AF]
- **Accent Primary**: [e.g., #3B82F6]
- **Accent Highlight**: [e.g., #60A5FA]
- **Semantic Warning / Alert**: [e.g., Amber: #F59E0B / Red: #EF4444]
- **Surface Texture**: [Flat matte / 12px Frosted Glass / Subdued film grain / Paper fibers]

---

### 5. Motion and Kinetic Profiles
- **Default Easing Curve**: [e.g., cubic-bezier(0.16, 1, 0.3, 1)]
- **Snappy Micro-duration**: [e.g., 180ms]
- **Standard Transition Duration**: [e.g., 280ms]
- **Narrative Sequence Duration**: [e.g., 550ms]
- **Motion Vocabulary Set**: [e.g., Parallax, Stagger (40ms offset), Press + Spring, Clip Reveal]
- **Reduced Motion Fallback**: [Instant opacity swap (0.01ms), scroll-behavior: auto]

---

### 6. Interactive Element Affordances
- **Button Radius**: [e.g., 4px sharp / 8px modern / 9999px full pill]
- **Hover State Behavior**: [e.g., 1px border highlight + scale(1.01) with 150ms ease]
- **Active / Press State**: [e.g., scale(0.98) with spring release]
- **Focus Ring Specification**: [e.g., 2px solid var(--accent-primary) with 2px offset]

---

### 7. Implementation Stack & Dependencies
- **UI Framework**: [React / Next.js / Svelte / Vanilla]
- **Styling Architecture**: [Tailwind CSS / Vanilla CSS Variables / CSS Modules]
- **Motion Runtime**: [Motion / GSAP / Web Animations API]
- **Asset Engines**: [SVG Vectors / Canvas 2D / Three.js glTF]
