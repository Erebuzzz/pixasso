# Contradiction Resolution

Detect and resolve conflicts between genome fields, performance reality, and product jobs. Do not silently pick a side.

Anti-pattern corpus remains authoritative: [anti-patterns-and-critique.md](anti-patterns-and-critique.md)

---

## Epistemic Honesty

Every contested claim should carry a state:

| State | Meaning |
| :--- | :--- |
| `known` | Confirmed |
| `inferred` | Probable; show in validation |
| `uncertain` | Needs a decision |
| `unavailable` | Cannot be known yet; do not invent |

Hallucination pattern to reject: naming specific fonts, APIs, packages, or brand rules that were never confirmed.

---

## Common Contradiction Classes

### Aesthetic vs performance
Cinematic WebGL background on a dense daily dashboard.
**Resolve**: Prefer 2D/CSS atmosphere for the tool shell; reserve 3D for a marketing moment or optional delight layer with DPR clamp and static fallback.

### Decorative type vs dense UI
Display serif at 72px in a data table product.
**Resolve**: Dual register: expressive type on marketing/empty states; neutral UI face for chrome. Document both in typography genome.

### Theme costume vs visual language
"Ocean exploration" theme becoming wave GIFs and clipart on a serious analytics surface.
**Resolve**: Theme informs metaphor, palette, and motion metaphors; visual language stays product-grade. Narrative ≠ stickers.

### Motion brand vs vestibular safety / reduced motion
Heavy parallax scrub as identity.
**Resolve**: Ship kinetic mode as progressive enhancement; `prefers-reduced-motion` gets instant state, opacity-only, or static art direction.

### Luxury stillness vs conversion urgency
Sparse contemplative layout with three competing CTAs.
**Resolve**: One primary action; stillness supports trust, not confusion. Revisit UX architecture.

### Component library defaults vs genome
shadcn/Inter/purple tokens shipped untouched.
**Resolve**: Treat library as structure; restyle to genome tokens. Say "This looks generic" if defaults leak.

### Inferred audience vs stated audience
Inferred "developers" vs user said "executive buyers".
**Resolve**: Stated wins; mutate genome; mark dependent tasks stale.

---

## Resolution Protocol

1. **Name the conflict** in one sentence
2. **Cite the fields** (genome paths or requirements)
3. **Propose 2 options** with tradeoffs (craft, UX, perf, a11y, engineering)
4. **Recommend one** with rationale
5. **Ask** when the wrong choice is expensive to reverse
6. **Mutate genome** once decided; update Task DAG statuses

---

## Output Shape

```text
Conflict: Kinetic full-page scroll storytelling vs WCAG-focused docs portal.
Fields: motion.feel=kinetic, audience.literacy=mixed, constraints.a11y=AA
Options:
  A) Restrained docs chrome + kinetic landing only
  B) Global kinetic with reduced-motion static twin
Recommendation: A (lower maintenance, clearer IA)
```

---

## When to Pause the DAG

Pause implementation nodes when:

- Typography availability is `unavailable` but faces were treated as final
- Dimensionality is `3d` without a fallback plan on a mobile-critical product
- Primary action conflicts with hero composition rules the user cares about
- Security or a11y constraints conflict with a proposed interaction pattern

Return to Discovery or Genome Validation; do not paper over the conflict in code.
