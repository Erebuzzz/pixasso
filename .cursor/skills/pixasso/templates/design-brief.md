# Pixasso Design Brief (Adaptive Discovery Scaffold)

This is a lightweight scaffold for Intent Discovery, not a mandatory form. Prefer conversational stages from [references/discovery-framework.md](../references/discovery-framework.md). Ask only material ambiguities. Capture durable answers in [design-genome.yaml](design-genome.yaml).

If the user already supplied a clear brief or locked genome, skip blank sections.

---

## How to use

1. Skim the request; mark what is already **known** vs **inferred** vs **uncertain**
2. Talk through stages (Frame → World/Language → Type/Color → Space/Motion → Genome Check)
3. Write confirmed decisions into the Design Genome
4. Run the human-readable Genome Validation gate before heavy implementation

---

## Stage A: Frame

- **What are we building?** (open-ended category; interpret semantically)
- **Primary action** that must win
- **Audience** and context
- **Emotional outcome** after a successful visit or session

## Stage B: World and Language

- **Theme / world / narrative** (meaning for the system, not clutter)
- **Visual language** (formal style; may differ from theme)
- **Conflicts** between theme and style (log and resolve)

## Stage C: Type and Color

- **Typography personality** and reading jobs (see [references/typography-discovery.md](../references/typography-discovery.md))
- **Owned or required fonts** (never invent availability)
- **Color emotion** before hex; then role-based palette

## Stage D: Space and Motion

- **Dimensionality desire** (2D / 2.5D / 3D / hybrid) and why
- **Motion feel** (restrained / polished / kinetic) and reduced-motion expectation
- **Stack, performance, a11y, licensing** constraints

## Stage E: Lock

- Human-readable genome summary
- Inferences to confirm
- Open questions that still block implementation

---

## Optional deep-dive prompts

Only when needed: platform form factors, asset sourcing, explicit anti-pattern blacklist, existing design-system tokens, SEO/content model.

Legacy exhaustive checklists are intentionally omitted. Prefer genome fields over duplicating answers here.
