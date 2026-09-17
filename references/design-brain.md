# Design Brain (User-Visible Graph)

The Design Brain is the **user-visible, Graphify-style map** of Pixasso's Design Genome, decision graph, and Task DAG. Machine truth stays in YAML sidecars; the brain is the navigable reference humans open and follow.

Fillable artifact: [templates/design-brain.md](../templates/design-brain.md)
Sidecars: [templates/design-genome.yaml](../templates/design-genome.yaml), [templates/task-graph.yaml](../templates/task-graph.yaml), [templates/typography-spec.yaml](../templates/typography-spec.yaml)

---

## Why it exists

Agents already reason with a genome and DAG. Users must see that structure as a **reference artifact**, not a hidden scratchpad and not a second interrogation UI.

The brain answers: What did we decide? What depends on what? What is ready, blocked, or done? What is known vs inferred?

---

## Dual representation

| Layer | Format | Audience |
| :--- | :--- | :--- |
| Machine truth | `design-genome.yaml`, `task-graph.yaml`, `typography-spec.yaml` | Agents, tooling |
| Human map | `design-brain.md` (Mermaid + prose legend) | User and collaborators |

YAML remains authoritative for field values and epistemic states. The brain must stay consistent with YAML; when they diverge, fix YAML first, then refresh the brain.

---

## When to surface

Always present or refresh the Design Brain (in chat and/or as a project file) at these moments:

1. **Genome Validation**: when asking the user to confirm the draft genome
2. **Material genome updates**: after mutations that change direction, type, dimensionality, or primary action
3. **Planning complete**: when the Task DAG is first built or substantially rewired
4. **Before implementation kickoff**: so the user can see dependencies and status before code starts
5. **On request**: whenever the user asks to see the graph, brain, or plan map

Optional lighter refresh after major node status changes (for example several tasks moving to `done`), especially before QA gates.

---

## What the visible graph must show

- **Product intent**: build category, primary action, audience, emotional outcome
- **Art direction branches**: visual language, narrative/theme, color emotion
- **Typography subtree**: personality, roles, pairing, availability markers
- **Spatial / motion**: dimensionality, motion feel, reduced-motion policy
- **Implementation tasks**: shell, sections, assets, integration
- **Dependencies**: edges between decision and task nodes
- **Status**: `ready` / `blocked` / `running` / `done` / `stale` (and pending where useful)
- **Epistemic markers**: known vs inferred (and uncertain/unavailable where it affects trust)

---

## Presentation rules

- Prefer writing `design-brain.md` (or `artifacts/design-brain.md`) in the user project when the workspace allows files
- Also summarize with Mermaid in chat at validation and kickoff so the user does not have to hunt for the file
- Keep prose legends short: node id, meaning, status, known/inferred
- Do not turn the brain into a questionnaire; it is a **map to inspect**
- Use Mermaid `flowchart` or `graph` for the decision tree; a second diagram for the Task DAG is encouraged when the plan is non-trivial

---

## Status and epistemic shorthand in diagrams

Suggested node label pattern:

```text
type.system [inferred]
done
```

Or compact: `type.system · inferred · ready`

Color or shape styling in Mermaid is optional; clarity of labels matters more than fancy styling.

---

## Related

- [design-genome.md](design-genome.md)
- [task-graph.md](task-graph.md)
- [agent-orchestration.md](agent-orchestration.md)
- [discovery-framework.md](discovery-framework.md)
