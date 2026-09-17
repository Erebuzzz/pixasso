# Design Genome

The Design Genome is the machine-readable persistent source of truth for a Pixasso project. After Intent Discovery, agents reference the genome, not the original user prompt. Every meaningful design update mutates the genome.

Canonical template: [templates/design-genome.yaml](../templates/design-genome.yaml)
User-visible map: [templates/design-brain.md](../templates/design-brain.md) ([design-brain.md](design-brain.md))

---

## Purpose

- Freeze intent into structured, auditable decisions
- Prevent re-interpretation drift across agents and turns
- Enable Genome Validation before expensive implementation
- Feed the Task DAG with known inputs and confidence levels
- Power the user-visible Design Brain (Graphify-style reference), not only internal agent state

---

## Lifecycle

```text
Intent Discovery → Draft Genome → Human Validation Gate → Locked Genome
                                      ↓
                              Mutations on revise
                                      ↓
                         Task DAG + Agent packets
```

1. **Draft**: Populate from discovery. Mark every field as `known`, `inferred`, `uncertain`, or `unavailable`.
2. **Validate**: Present a human-readable interpretation. User corrects before research-heavy or implementation work.
3. **Lock**: Treat validated fields as authoritative unless the user revises them.
4. **Mutate**: Updates patch the genome with a short rationale and confidence change. Do not silently overwrite without noting the change.

---

## Epistemic States

| State | Meaning | Agent behavior |
| :--- | :--- | :--- |
| `known` | User stated or confirmed | Use freely |
| `inferred` | Safe inference from context | Use, surface in validation summary |
| `uncertain` | Guess or weak signal | Ask or propose options before committing |
| `unavailable` | Not knowable yet or blocked | Do not invent; leave open or use fallback policy |

Never invent unavailable fonts, APIs, assets, or brand facts. Prefer `unavailable` over hallucinated specificity.

---

## Core Sections

### identity
Product name, build category (open-ended semantic label, not a closed enum), one-line purpose, primary action.

### audience
Who it is for, literacy, context (enterprise / consumer / creative / mixed), emotional outcome.

### narrative
Theme, world, story, metaphor. This feeds the design system as coherent meaning, not decorative clutter.

### visual_language
Distinct from theme. Style axes, materiality, composition bias, what to avoid. Resolve conflicts with theme via [contradiction-resolution.md](contradiction-resolution.md).

### color
Emotion → palette system: roles (bg, surface, text, accent, border, state), contrast targets, dark/light policy.

### typography
First-class subsystem. Full schema in [typography-system.md](typography-system.md) and [templates/typography-spec.yaml](../templates/typography-spec.yaml). Rule: Typography → Content Geometry → Layout → Responsive → Motion.

### dimensionality
`2d` | `2_5d` | `3d` | `hybrid`, rationale, spatial desire signals, fallback if GPU fails.

### motion
Feel (restrained / polished / kinetic), vocabulary subset, duration budget, reduced-motion policy.

### constraints
Stack, performance budget, accessibility bar, existing design system, licensing limits.

### confidence
Per-section confidence 0 to 1 plus overall readiness for implementation.

### open_questions
Only material ambiguities still blocking progress.

---

## Human-Readable Validation Gate

Before Task DAG execution beyond research-only tasks, summarize the genome in plain language **and surface the Design Brain**:

1. What we are building and for whom
2. Emotional and narrative intent
3. Visual and typographic direction (named fonts only if known or confirmed)
4. Dimensionality and motion posture
5. Inferences the user should confirm or reject
6. Open conflicts and proposed resolutions
7. Mermaid decision map (and Task DAG once planned) via [design-brain.md](design-brain.md)

Ask for correction. Do not proceed to heavy implementation on unvalidated inferred-critical fields. Refresh the brain after material mutations.

---

## Mutation Protocol

When the user changes direction mid-project:

```yaml
mutation:
  at: ISO-8601
  fields: [path.to.field]
  from: previous value
  to: new value
  reason: short rationale
  confidence_delta: +0.1 | -0.2
```

Append mutations to project memory ([templates/project-state.yaml](../templates/project-state.yaml)). Downstream tasks with stale inputs must be marked `stale` in the Task DAG.

---

## Agent Contract

- Read genome before designing or coding
- Prefer genome fields over chat history paraphrases
- On conflict between chat and genome, ask which wins, then mutate genome
- Pass genome excerpt (not full chat dump) into focused agent task packets

See also: [discovery-framework.md](discovery-framework.md), [agent-orchestration.md](agent-orchestration.md), [task-graph.md](task-graph.md)
