# Figma MCP and Agentic Design Ecosystem Reference

A technical guide to integrating Figma via Model Context Protocol (MCP), generating machine-readable DESIGN.md files, executing 348-rule UI audits, and coordinating modern agent design engineering tools.

---

## 1. Figma Through MCP (Model Context Protocol)

The Figma Model Context Protocol server connects autonomous coding agents (Gemini, Claude, Antigravity) directly to live Figma design canvases, design systems, and variables.

### Architecture and Data Flow
```
+-------------------+       MCP JSON-RPC        +----------------------+
|  Coding Agent     | <=======================> |  Figma MCP Server    |
|  (Antigravity)    |                           |  (Official Gateway)  |
+-------------------+                           +----------------------+
                                                           ||
                                                    Figma REST & Plugin API
                                                           \/
                                                +----------------------+
                                                |     Figma Canvas     |
                                                | Nodes, Variables, DS |
                                                +----------------------+
```

### Core Figma MCP Capabilities
1. **Node Tree Inspection**:
   - `get_node_info(file_key, node_id)`: Fetches precise bounding box geometry, layout modes (Auto Layout flex direction, gap, padding), corner radii, and fill/stroke properties.
   - Preserves semantic component structure rather than flattening frames into static images.
2. **Design Variables and Token Extraction**:
   - `get_local_variables(file_key)`: Reads color modes (light/dark), spacing tokens, typography variables, and radii directly from Figma Variable Collections.
   - Automatically maps Figma variables into semantic CSS custom properties or Tailwind v4 `@theme` configuration blocks.
3. **Code Connect Integration**:
   - Translates Figma component instances into production React/Tailwind component invocations using Code Connect mappings (`@figma/code-connect`).
4. **Canvas Feedback and Annotation**:
   - Allows agents to post design review comments, status badges, or code snippet links back to specific Figma canvas coordinates for design-engineering alignment.

### Best Practices for Agents Consuming Figma Nodes
- **Always read Auto Layout properties first**: Auto Layout properties (`layoutMode: 'HORIZONTAL' | 'VERTICAL'`, `itemSpacing`, `paddingLeft`, etc.) map 1:1 to CSS Flexbox or Grid. Never use absolute positioning unless the parent node explicitly disables Auto Layout.
- **Extract typography metadata completely**: Record `fontFamily`, `fontWeight`, `fontSize`, `lineHeightPx`, and `letterSpacing` to prevent font rendering mismatches.
- **Normalize color values**: Convert Figma RGBA values (which range from 0.0 to 1.0) to standard 8-bit hex codes or `oklch()` CSS tokens.

---

## 2. The DESIGN.md Specification for Coding Agents

`DESIGN.md` is an emerging industry standard (championed by Neuform and DESIGN.md Supply) for feeding concise, structured design system contracts to AI coding agents.

### Purpose of DESIGN.md
When building interfaces, coding agents frequently hallucinate random padding values, mismatched colors, or arbitrary font choices. A `DESIGN.md` file placed at the project root provides an authoritative contract of design constraints:

### Standard DESIGN.md Schema
```markdown
# DESIGN SYSTEM SPECIFICATION

## 1. Visual World & Ground
- Ground Mode: Dark (#09090B) / Light (#FBFBFE)
- Primary Brand Tint: #2F27CE
- Accent High-Contrast: #433BFF
- Border Style: 1px solid rgba(255, 255, 255, 0.08)
- Surface Elevation:
  - Surface Low: #121215
  - Surface Mid: #18181D
  - Surface High: #22222A

## 2. Typography Token Scale
- Display Font: "Cal Sans", sans-serif (tracking: -0.02em)
- Body Font: "Inter", sans-serif (tracking: 0)
- Code Font: "JetBrains Mono", monospace
- Scale:
  - display: clamp(2.5rem, 5vw, 4.5rem) / line-height: 1.1 / font-weight: 700
  - h1: 2.25rem (36px) / line-height: 1.2 / font-weight: 600
  - h2: 1.75rem (28px) / line-height: 1.25 / font-weight: 600
  - h3: 1.25rem (20px) / line-height: 1.3 / font-weight: 600
  - body-lg: 1.125rem (18px) / line-height: 1.5
  - body-base: 1rem (16px) / line-height: 1.5
  - caption: 0.875rem (14px) / line-height: 1.4

## 3. Spatial System (8px Grid)
- Micro: 4px, 8px, 12px
- Component: 16px, 24px
- Layout: 32px, 48px, 64px, 96px

## 4. Radius Architecture
- Button / Input: 8px (rounded-lg)
- Card / Panel: 16px (rounded-2xl)
- Floating Island / Pill: 9999px (rounded-full)

## 5. Interaction & Motion Rules
- Transition Duration: 150ms ease-out for hover, 250ms cubic-bezier(0.16, 1, 0.3, 1) for modals.
- Tap Target Minimum: 44px by 44px.
```

---

## 3. The Rams 348-Rule UI Audit Framework

Inspired by Dieter Rams's 10 Principles of Good Design, the Rams scoring framework evaluates agent-generated interfaces on a 0 to 100 quality scale across 348 objective design engineering rules:

### Core Evaluation Categories
1. **Typography Discipline (65 Rules)**:
   - Line length strictly maintained between 45 and 75 characters for prose.
   - Letter-spacing (tracking) negative for headings, neutral or positive for micro-caps.
   - No orphan single words on the final line of multi-line titles (`text-wrap: balance`).
   - Line-height scales inversely with font size (large headings 1.1 to 1.2; body text 1.5 to 1.6).

2. **Contrast and Color Science (55 Rules)**:
   - Body copy meets WCAG AAA 7:1 or AA 4.5:1 minimum contrast against its immediate ground.
   - Interactive buttons have at least 3:1 contrast against adjacent surface planes.
   - Focus rings visible against both light and dark backgrounds (`outline-offset: 2px`).
   - Saturated pure blue text avoided on pure black backgrounds to eliminate optical chromatic aberration.

3. **Layout and Spacing Geometry (70 Rules)**:
   - All padding, margins, and gaps adhere strictly to the 4px / 8px scale.
   - Sibling cards in the same grid match height and internal padding.
   - Asymmetric bento grids collapse gracefully across 390px, 768px, 1024px, and 1440px without text collision or horizontal overflow.

4. **Component State Completeness (58 Rules)**:
   - Every interactive control declares default, hover, focus-visible, active, disabled, and loading states.
   - Loading skeletons preserve identical dimensions of the final content to prevent cumulative layout shift (CLS = 0).
   - Form inputs display inline error messages with `aria-describedby` linkage.

5. **Motion and Cognitive Ergonomics (50 Rules)**:
   - All CSS animations wrapped in `@media (prefers-reduced-motion: reduce)`.
   - Transitions do not animate expensive layout properties (`top`, `left`, `width`, `height`), using `transform` and `opacity` exclusively.
   - UI feedback occurs within 100ms of user input (Doherty Threshold).

6. **Micro-Copy and Usability (50 Rules)**:
   - Button labels start with strong action verbs.
   - Error messages explain both the failure cause and the recovery step.
   - No placeholder-only inputs; inputs always have visible semantic labels.

---

## 4. UI UX Pro Max and Impeccable Integration

UI UX Pro Max and Impeccable are specialized agent skill packs that enforce visual taste and systematic design critique:

### Integration with Pixasso
- **Impeccable**: Supplies the comprehensive anti-pattern taxonomy (the AI Slop Catalog) and enforces ruthless elimination of generic template tropes.
- **UI UX Pro Max**: Provides rapid component review matrices, cross-referencing industry design benchmarks and ergonomic heuristics.
- **Coordination Workflow**:
  1. Pixasso formulates design intent and generates the Design Genome.
  2. Components are drafted adhering to the genome tokens and spatial grid.
  3. Rams heuristics and Impeccable slop checks run automatically via `pixasso_audit_design` to ensure zero quality degradation before user presentation.

---

## 5. Curated Agent Tools and Design Utilities

### Haikei.app
- Generates procedural SVG vector shapes: layered waves, smooth organic blobs, low-poly geometries, and radial gradients.
- Excellent for creating lightweight, responsive decorative background accents without heavy image payloads.

### RealtimeColors.com
- Interactive palette testing tool for previewing complete color systems in real time.
- Tests ground backgrounds, surface layers, primary brand colors, and high-contrast accents across full landing page prototypes before locking them into tokens.

### Notify.domains
- Domain monitoring utility for tracking dropping or expiring brand names for new product launches.

### Libraries.dev Shader Effects
- Collection of high-performance React shader effects:
  - **Beam**: Glowing animated laser paths along container borders.
  - **Orb**: Interactive 3D ambient sphere reacting to pointer movement.
  - **Gooey**: Fluid SVG filter merge animations for tabs and notification counters.
  - **Metal**: Metallic sheen and iridescent reflection surfaces for luxury badges.
  - **Image Distortion**: WebGL fragment shader ripples for editorial photography.

### userinterface.wiki
- A living encyclopedia of UX laws, typographic math, and motion curves maintained by senior design engineers.
