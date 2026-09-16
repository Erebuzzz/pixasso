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
| **Code Editor (VS Code / Cursor)** | Production Implementation | Full-stack application UI, custom motion pipelines, WebGL | Production TypeScript, React, CSS codebases |
| **Browser DevTools** | Performance & Audit | Real-time DOM inspection, frame profiling, accessibility tree | Performance profiles, CSS token overrides |

Do not force every project into Figma, Framer, or WebGL. Select the workflow that delivers the highest quality result with minimal translation friction.

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
