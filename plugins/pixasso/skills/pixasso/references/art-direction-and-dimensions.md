# Art Direction and Dimensionality Reference

Art direction is the deliberate synthesis of visual language, composition, surface texture, typography, and spatial dimensionality. Pixasso rejects one-size-fits-all presets in favor of bespoke visual systems constructed to match the specific purpose, audience, and constraints of each project.

---

## 1. Dimensionality Strategy

The decision between 2D, 2.5D, and 3D must be an explicit, conscious choice grounded in user goals and device realities.

### 2D (Planar Precision)
- **Primary Use Cases**: SaaS applications, administrative dashboards, developer tools, content-dense editorial publications, transaction-focused e-commerce, banking and healthcare portals.
- **Why It Excels**: Maximum rendering speed, zero GPU overhead, perfect accessibility compliance, crystal-clear typography, predictable responsive scaling across all viewports.
- **Key Levers**: Hierarchy, typographic scale, baseline rhythm, spatial density, color contrast, and micro-interactions.

### 2.5D (Layered Depth and Parallax)
- **Primary Use Cases**: High-impact marketing pages, product reveal landings, agency portfolios, interactive editorial storytelling, educational explainer guides.
- **Why It Excels**: Provides tactile spatial depth, physical layering, and visual delight without the performance cost, bundle size, or accessibility barriers of full 3D environments.
- **Techniques**:
  - Multi-plane scroll parallax with differential scroll velocities.
  - CSS 3D perspective transforms (`perspective: 1000px`, `transform: rotateX(...) rotateY(...)`).
  - Layered SVG vector illustrations with depth masking.
  - Ambient rim lighting and directional elevation shadows.
  - Sticky pin-and-dock component cards.

### 3D (True Spatial Environments)
- **Primary Use Cases**: Physical product configurators, architectural visualization, spatial games, interactive science simulations, immersive brand installations, digital twin dashboards.
- **Why It Excels**: Enables genuine spatial inspection, 360-degree rotation, variable camera perspectives, and immersive tactile exploration impossible in flat planes.
- **Prerequisites**: Verified GPU availability, mobile optimization budget, graceful non-3D fallback state, and clear user benefit beyond decorative novelty.

---

## 2. Art Direction Dimensions

Pixasso constructs visual directions by combining elements across three primary axes:

### Axis 1: Compositional Structure
- **Asymmetric**: Creates dynamic visual tension and energy. Ideal for editorial layouts, boutique agencies, and high-fashion branding.
- **Centered**: Delivers iconic, focused authority. Best for singular hero announcements, minimalist landing pages, and luxury goods.
- **Editorial**: Emulates high-end print publishing with multi-column text flows, large initial drop caps, marginalia, and asymmetrical photo placements.
- **Modular (Bento)**: Organizes disparate features and metrics into clearly bounded containers. Perfect for product feature summaries, developer consoles, and analytical tools.
- **Radial**: Arranges elements around a central hub. Suited for network visualizers, audio mixers, and experimental navigation interfaces.
- **Dense**: High information-to-screen ratio with compact padding, tight typography, and tabular rows. Ideal for financial trading, code editors, and telemetry monitors.
- **Sparse**: Expansive whitespace, low element counts, and high breathing room. Ideal for contemplative portfolios, art galleries, and premium luxury brands.

### Axis 2: Surface and Materiality
- **Flat**: Crisp, border-focused, vector geometry with zero artificial lighting or drop shadows. Prioritizes pure graphic clarity.
- **Paper**: Subtle warm paper fibers, grain overlays, matte finishes, and authentic print-style ink spreads.
- **Glass**: Frosted glass panels, optical refraction, soft backdrop blurs (`backdrop-filter: blur(12px)`), and delicate 1px translucent borders.
- **Metallic**: Brushed aluminum, anodized titanium, subtle specular highlights, and industrial bevels.
- **Textured / Organic**: Natural clay, linen, grain, stippling, and hand-drawn imperfections that humanize digital interfaces.
- **Digital / Terminal**: Monospace typefaces, neon phosphor accents, sharp 90-degree corners, scanlines, and high-contrast dark backdrops.

### Axis 3: Visual Personality
- **Technical**: Precision-engineered, telemetry-inspired, calibrated, and rational.
- **Brutalist**: Raw HTML conventions, stark monospaced typography, bold solid borders, saturated primary colors, and zero ornamental polish.
- **Editorial**: Cultured, literary, typographically rich, and rhythmically paced like an architectural monograph.
- **Playful**: Soft rounded forms, bouncy spring physics, vibrant contrasting accents, and friendly micro-interactions.
- **Luxurious**: Subdued palettes, generous margins, delicate serif headlines, understated micro-transitions, and impeccable craft.
- **Scientific**: Data-rich, objective, diagrammatic, transparent, and structured around empirical charts.

---

## 3. Typography Architecture

Typography is structural architecture, not cosmetic decoration. Pixasso evaluates every typographic choice through five criteria:

### 1. Distinctive Personality
Do not default to Inter, Roboto, or generic system fonts for every project. Select typefaces whose historical origins and formal characteristics mirror the project's soul:
- Technical / Engineering: JetBrains Mono, Iosevka, Space Grotesk, Syne.
- Editorial / Cultural: Newsreader, Fraunces, Playfair, Cormorant Garamond.
- Modern Utility: Plus Jakarta Sans, Geist, Satoshi, General Sans.
- Brutalist / High-Impact: Clash Display, Cabinet Grotesk, PP Neue Montreal.

### 2. Typographic Scale Ratios
Adopt a mathematical ratio suited to the screen density:
- **Major Second (1.125)**: Best for data-dense dashboards, tables, and compact mobile tools.
- **Minor Third (1.200)**: Standard balanced ratio for web applications and blogs.
- **Major Third (1.250)**: Energetic hierarchy for marketing pages and product announcements.
- **Augmented Fourth (1.414)**: High-contrast drama for editorial heroes and creative portfolios.

### 3. Vertical Rhythm and Leading
- Headlines: Tight line heights between 1.05 and 1.20 times the font size to prevent loose floating text blocks.
- Body Copy: Generous line heights between 1.50 and 1.65 times the font size with line lengths strictly constrained to 55 to 75 characters for optimal optical tracking.
- Captions and Metadata: Crisp tracking with slightly wider letter-spacing (0.02em to 0.05em) to preserve legibility at small point sizes.

---

## 4. Color and Lighting Architecture

### Semantic Token Structure
Never hardcode hexadecimal values directly into components. Structure palettes into three distinct operational layers:

```
[Layer 1: Primitive Palette]
gray-900: #0a0a0c, gray-500: #71717a, blue-600: #2563eb, amber-500: #f59e0b

                              |
                              v

[Layer 2: Semantic Tokens]
surface-canvas: gray-900, surface-panel: gray-800, text-primary: gray-50
text-secondary: gray-400, border-subtle: gray-700/50, accent-primary: blue-600

                              |
                              v

[Layer 3: Component Bindings]
card-background: var(--surface-panel), button-primary: var(--accent-primary)
```

### Contrast and Accessibility Rules
- Body text must achieve at least 4.5:1 contrast against its background container (WCAG AA).
- Large display text (18pt bold or 24pt regular) must achieve at least 3:1 contrast.
- UI boundaries, interactive form borders, and status icons must maintain 3:1 contrast against adjacent background colors.
- Dark mode must avoid pure `#000000` pitch black against `#FFFFFF` pure white to eliminate optical halation and reader eye fatigue. Use deep slate or tinted charcoal grounds (such as `#0B0D11` or `#12141A`).
