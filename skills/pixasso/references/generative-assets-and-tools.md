# Generative Assets and Creative Tools Reference

Creative tools and generative asset pipelines provide raw visual materials. Pixasso treats these tools not as automated shortcuts, but as precision instruments requiring rigorous artistic direction and contextual intent.

---

## 1. Generative Asset Engines

### Haikei
- **URL**: https://haikei.app/
- **Classification**: Procedural SVG and Vector Generator
- **Generators**: Layered waves, blob scenes, stacked peaks, low-poly grids, geometric patterns, circle scatters.
- **When to Use**: Crafting customized vector division lines between page sections, organic background masks, and responsive SVG containers.
- **Guardrail**: Never leave default random seed geometries untouched. Adjust point density, color contrast, and curviness so the SVG feels uniquely integrated into the layout rather than a generic backdrop.

### Vector and Procedural Rules
1. Every generated asset must have a defined compositional function (e.g., establishing a reading boundary, guiding the eye toward a CTA, or anchoring an asymmetrical column).
2. Clean and optimize SVGs with tools like SVGO to strip redundant coordinates, inline metadata, and hidden layers.
3. Bind vector fill and stroke values to semantic CSS custom properties rather than hardcoded hex values to support instant theme switching.

---

## 2. Creative Tool Ecosystem

Pixasso chooses tools based on project velocity, team constraints, and fidelity requirements:

| Tool | Primary Purpose | Best For | Output Deliverable |
| :--- | :--- | :--- | :--- |
| **Figma** | Interface Design & Systems | Multi-screen application flows, design systems, vector icons | Reusable token libraries, auto-layout specs |
| **Framer** | Interactive Web Production | High-fidelity marketing sites with native scroll and motion | Production-ready React/web landing pages |
| **Brik** | Visual Component Assembly | Rapid component prototyping and layout exploration | Clean HTML/CSS component structures |
| **DialKit** | Live Feel Tuning | Shaping spacing, color, springs, and timelines by feel in the running UI | Tuned token values and Motion spring/easing configs |
| **GetLayers** | Agent-Native Layer Library | Prompt-copyable sections, scenes, gradients, and MCP site assembly | Self-contained HTML layers or Next.js-oriented prompts |
| **Code Editor (VS Code / Cursor)** | Production Implementation | Full-stack application UI, custom motion pipelines, WebGL | Production TypeScript, React, CSS codebases |
| **Browser DevTools** | Performance & Audit | Real-time DOM inspection, frame profiling, accessibility tree | Performance profiles, CSS token overrides |

Do not force every project into Figma, Framer, or WebGL. Select the workflow that delivers the highest quality result with minimal translation friction.

### DialKit
- **URL**: https://www.dialkit.dev/
- **Classification**: Design Tool, Live Parameter Editor (feel-first)
- **Core Strengths**: Runtime dials for numbers, colors, springs, easings, pads, folders, and animation timelines so craft decisions are shaped by feel instead of guessing CSS constants.
- **When to Use**: Early visual exploration, motion timing calibration, and layout density tuning while a component is already mounted. Especially useful when the brief is emotional ("tighter", "softer spring") rather than numeric.
- **Guardrail**: Keep the DialRoot editor out of production unless explicitly enabled. Copy finalized values into tokens or Motion configs, then remove temporary bindings. Never treat live dial defaults as a finished design system.

### GetLayers
- **URL**: https://www.getlayers.ai/
- **Classification**: Generator, Agent-Native Template / Layer Library
- **Core Strengths**: Curated motion sections, tunable 3D scenes and gradients, and copyable prompts that reconstruct a self-contained layer in an agent workflow (plus MCP-oriented full-site assembly).
- **When to Use**: Marketing heroes, scroll sections, and atmospheric backgrounds when the team wants a high-craft starting layer rather than inventing motion from a blank canvas.
- **Guardrail**: A layer is a foundation, not a finished brand. Restyle copy, palette, and subject matter. Do not ship free trial layers unchanged for client work. Strip decorative intensity that conflicts with Pixasso anti-patterns (purple dream defaults, stacked glow effects).

---

## 2b. Agent Design Systems (DESIGN.md)

DESIGN.md is an agent-readable design-system format (tokens in YAML front matter plus prose rationale). Prefer verified tokens and rationale over inventing Inter-plus-indigo defaults.

### DesignMD (Extractor)
- **URL**: https://designmd.me/
- **Classification**: Generator, Design System / Documentation
- **Core Strengths**: Turns a live website URL into a structured DESIGN.md (colors, type, spacing, radius, elevation, components, breakpoints) with optional HTML preview and Figma import.
- **When to Use**: Capturing an existing brand or reference site into agent-ready tokens before implementation.
- **Guardrail**: Validate contrast and semantic naming after extraction. Treat crawl output as a draft system; resolve conflicts with product constraints and WCAG AA.

### DesignMD (Catalog + MCP)
- **URL**: https://www.designmd.co/
- **Classification**: Design System / Documentation, Catalog, MCP Tooling
- **Core Strengths**: Brand DESIGN.md catalog, generation from description or URL, MCP tools for search/install of systems and UI blocks, certification against anti-slop distinctiveness.
- **When to Use**: Giving coding agents persistent visual identity context (Claude Code, Cursor, Windsurf, and other MCP clients) instead of guessing fonts and palettes.
- **Guardrail**: Adapt brand systems legally and ethically for the user's product. Do not clone a third-party brand wholesale for commercial shipping without rights. Prefer principles and token structure over literal trademarked identity.

### DesignMD Supply
- **URL**: https://www.designmd.supply/
- **Classification**: Generator, Design System / Documentation
- **Core Strengths**: Supply-side generation of Google-format DESIGN.md files from public websites (screenshots, brand signals, scraped structure) for agent consumption.
- **When to Use**: Bulk or alternate generation pipelines when catalog entries are missing and a public reference URL is available.
- **Guardrail**: Automated browser challenges may block some agent fetches. Prefer cached catalog entries from designmd.co or getdesign.md when live generation is unavailable. Always review tokens for accessibility before shipping.

### getdesign.md
- **URL**: https://getdesign.md/
- **Classification**: Design System / Documentation, Catalog
- **Core Strengths**: Large collection of site analyses as reusable DESIGN.md references aligned with the Google DESIGN.md spec, oriented to Claude Code, Cursor, and Codex.
- **When to Use**: Picking a coherent visual language (or matching a known product aesthetic) and handing a single file to the agent so multi-page builds stay consistent.
- **Guardrail**: Use the file as a brief, not a license to impersonate the analyzed brand. Remap accents, imagery, and voice to the user's product.

---

## 2c. Agent-Facing Site Readiness

### Ora
- **URL**: https://ora.ai/
- **Classification**: Design Tool / Audit Utility (Agent Readiness)
- **Site status (checked)**: Live and usable for agents. Public scans return scores, category leaderboards, and intent walkthroughs. Average web readiness remains low, so treat Ora as a readiness diagnostic rather than a design library.
- **Core Strengths**: Scores how agents find, read, and use a site; surfaces crawl/search/use issues; offers terminal scanning for continuous monitoring.
- **When to Use**: Marketing sites, docs, and product surfaces that must be discoverable and operable by AI agents (pricing lookup, feature extraction, structured content).
- **Guardrail**: High Ora score does not replace WCAG, performance, or visual craft. Pair agent-readiness fixes (clear structure, readable content, stable selectors) with human accessibility and responsive design.

---

## 3. Google Flow: Cinematic Sequences and Visual Ideation

Google Flow enables prompt-driven cinematic video sequences and visual narratives. When leveraging Google Flow, define explicit parameters across fourteen creative dimensions:

```
1. Subject: Exactly what entity or object is the focal point?
2. Environment: What is the architectural, natural, or abstract spatial setting?
3. Visual Style: Is it cinematic 35mm film, architectural rendering, matte painting, or graphic vector?
4. Camera Movement: Dolly-in, tracking shot, slow orbital pan, crane reveal, or static tripod?
5. Camera Lens & Angle: Wide 24mm low-angle, telephoto 85mm portrait, isometric, or macro close-up?
6. Composition: Rule of thirds, golden spiral, central symmetrical, or extreme edge framing?
7. Lighting: Soft morning daylight, harsh directional spotlight, moody neon volumetric fog, or flat overcast?
8. Palette: Dominant tones, secondary accents, saturation levels, and shadow temperature.
9. Movement: What physical or procedural action occurs in the scene?
10. Duration: Precise second count (e.g., 4s loop).
11. Pacing: Gradual acceleration, steady deceleration, or constant kinetic rhythm?
12. Transition Behavior: Cross-dissolve, match cut, whip pan, or seamless loop point?
13. Aspect Ratio: 16:9 widescreen, 9:16 vertical mobile, 4:3 classic, or 1:1 square?
14. Intended Use: Hero background video, interactive modal preview, or ambient brand loop?
```

Never request an arbitrary sequence without establishing the narrative context and user goal.

---

## 4. ChatGPT and Diffusion Image Generation

AI image generation models (ChatGPT DALL-E, Midjourney, Stable Diffusion) should be used for concept moodboards, bespoke illustrations, textures, and UI asset exploration.

### Crafting High-Craft Prompts
When formulating an image generation prompt, avoid vague buzzwords such as "hyperrealistic, 4k, trending on artstation". Instead, specify concrete technical art-direction parameters:

```text
[Subject & Action]: High-precision mechanical watch tourbillon movement, disassembling into floating exploded layers.
[Art Direction / Medium]: Macro studio product photography, clean architectural aesthetic, matte industrial finish.
[Lighting]: Dramatic dual-rim studio lighting with soft diffused key light from upper-left, subtle deep shadows.
[Palette]: Monochromatic bead-blasted titanium, brushed steel, deep obsidian slate, with subtle copper gear accents.
[Perspective & Lens]: 45-degree isometric perspective, 90mm tilt-shift lens with shallow depth of field on background elements.
[Composition]: Centered modular layout, generous negative space surrounding the assembly, clean isolated background.
[Exclusions / Negative Prompts]: No glowing sci-fi laser beams, no purple neon lights, no lens flares, no glossy reflections.
```

### Animation Concept Prompting
When prompting or designing an animation concept, specify:
1. **What Moves**: The specific target elements and sub-elements.
2. **How It Moves**: The mathematical translation, scale, rotation, or distortion.
3. **What Triggers It**: Scroll progress, hover enter, tap, viewport intersection, or timer.
4. **Duration & Easing**: Exact milliseconds and curve shape (e.g., 280ms cubic-bezier(0.2, 0, 0, 1)).
5. **Camera Behavior**: Does the spatial viewport move with the object or remain fixed?
6. **Interaction State**: How the animation behaves when the user interrupts the movement mid-flight.
