# Typography Discovery

Conversational protocol for extracting typographic intent before locking faces, scales, and loading strategy.

Parent system: [typography-system.md](typography-system.md)
Output: [templates/typography-spec.yaml](../templates/typography-spec.yaml)

---

## Stance

Ask like a typography director in a design review, not a font-picker quiz. Reflect personality first; names second.

---

## What to Discover

1. **Personality**: Three adjectives max, plus one "not like this" reference
2. **Reading jobs**: Campaign hero, long-form, dense UI, data, mixed
3. **Category needs**: Which roles are actually required
4. **Pairing appetite**: Single family vs dual contrast vs curated system
5. **Historical or cultural cues**: Only if relevant; avoid costume typography
6. **Variable font interest**: Soft weight morphs, optical sizing, width
7. **Motion on type**: None / subtle / editorial kinetic
8. **Constraints**: Brand kit, license budget, offline/system-only, performance
9. **Fallbacks**: What happens if preferred webfont fails

---

## Availability Discipline

| Status | Rule |
| :--- | :--- |
| `known` | Face confirmed in brand kit, license, or installed project assets |
| `inferred` | Reasonable recommendation; must confirm license before shipping |
| `uncertain` | Candidate only; present alternatives |
| `unavailable` | Do not name as final; use fallback policy |

Never invent font names or claim a face is free/open without basis. Prefer describing characteristics ("high-contrast modern serif with sharp serifs") until a real face is selected.

### Typeface Reference Resource
- **Typeface.fyi**: https://www.typeface.fyi/
  - Use to explore curated contemporary typefaces, study detailed glyph specimens, discover authentic foundry pairings, and analyze letterform personality traits before locking the typography spec.

---

## Stage Prompts (Adaptive)

Use only what is still ambiguous:

- "Should the headlines feel carved and editorial, or quiet and product-native?"
- "Is most reading long articles, or short UI labels and numbers?"
- "Any fonts you already own or must match?"
- "On mobile, should the hero type stay dramatic and wrap, or yield hierarchy to a smaller display step?"

---

## From Answers to Spec

1. Lock personality and roles
2. Propose 1 primary + optional partner with rationale
3. Mark each face epistemic status
4. Define scale ratio and key steps (display, h1 to h3, body, small, ui)
5. Set measure and leading targets
6. Note variable axes and motion policy
7. Write fallback stack
8. Embed into Design Genome and emit `typography-spec.yaml`

---

## Handoff

Implementation agents receive the typography spec and must not substitute Inter "for simplicity" unless the genome explicitly allows a neutral UI stack.
