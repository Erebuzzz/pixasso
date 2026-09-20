# Typography System

Typography is a first-class architectural subsystem in Pixasso. It is not a late cosmetic choice after layout.

**Ordering rule:** Typography → Content Geometry → Layout → Responsive → Motion

Canonical template: [templates/typography-spec.yaml](../templates/typography-spec.yaml)
Discovery protocol: [typography-discovery.md](typography-discovery.md)
Director prompt: [prompts/typography-director.md](../prompts/typography-director.md)

---

## Why Type Comes First

Type defines:

- How much content fits per line and per viewport
- Optical hierarchy before color or imagery
- Rhythm of sections (measure, leading, spacing multiples)
- Motion affordances (tracking shifts, mask reveals, weight morphs on variable fonts)
- Responsive reflow behavior

Layout that ignores type becomes decorative boxes fighting the text.

---

## System Layers

### 1. Personality
Voice of the product in letterforms: authoritative, intimate, technical, editorial, playful, austere.

### 2. Categories
Roles mapped to faces or families:

| Role | Typical use |
| :--- | :--- |
| display | Hero and campaign moments |
| headline | Section titles |
| subhead | Supporting titles |
| body | Reading copy |
| ui | Labels, buttons, dense chrome |
| mono | Code, data, IDs |
| optional accent | Pull quotes, numerals, special moments |

### 3. Pairing Rules
- Prefer one primary family + one contrasting partner over four random faces
- Contrast on structure (serif/sans, geometric/humanist) more than on novelty
- UI chrome should not fight display drama

### 4. Scale and Hierarchy
Document ratio (for example Major Third 1.250), step names, sizes (rem / clamp), weight, tracking, line-height per step.

Optical guidance (defaults, adjust per face):

- Display / headline line-height: about 1.05 to 1.20
- Body line-height: about 1.50 to 1.65
- Body measure: about 55 to 75 characters

### 5. Variable Fonts
If variable: note axes used (`wght`, `opsz`, `wdth`, `slnt`), default instances, and which axes may animate. Prefer `wght` / opacity / transform for motion; avoid layout-thrashing axis abuse.

### 6. Rhythm
Baseline or spacing multiple derived from body size. Align section padding and stack gaps to that rhythm where practical.

### 7. Theme Mapping
How narrative/theme expresses in type (for example film-lab → condensed technical sans + soft serif captions) without turning the UI into costume.

### 8. Motion
Which type moments move (line mask, stagger words, weight settle). Durations stay in Pixasso budgets. Honor `prefers-reduced-motion`.

### 9. Responsive
Fluid type via `clamp()` or container-driven steps. Recompose hierarchy on small screens; do not only shrink.

### 10. Licensing and Loading
- Distinguish `known` / `inferred` / `uncertain` / `unavailable` for each face
- Never invent a font that is not confirmed available
- Prefer system stacks or clearly licensed webfonts when uncertain
- Document fallback stacks that preserve personality approximately

---

## Anti-Defaults

Avoid reflexive Inter / Roboto / Arial / system-ui as the entire brand voice unless the product explicitly wants invisible UI chrome and the genome says so.

When defaults are correct (dense tools, design-system continuity), say so deliberately in the genome rather than by habit.

### Curated Typeface Benchmarking
- **Typeface.fyi**: https://www.typeface.fyi/ (Explore curated type specimens, foundry pairings, historical notes, and personality mappings).

---

## Decision Tree (Short)

```text
Is there an existing brand type system?
  yes → adopt, document, check license and loading
  no  → discover personality → choose categories → propose pairing
        → verify availability → define scale → map to theme
        → derive content geometry → then layout
```

Conflicts (decorative display vs dense dashboard): see [contradiction-resolution.md](contradiction-resolution.md).

---

## Genome Embedding

Store the typography subsystem inside the Design Genome `typography` section and optionally as a standalone `typography-spec.yaml` artifact for implementation agents.
