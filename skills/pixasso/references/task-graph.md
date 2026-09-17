# Task Graph (Decision Graph + DAG)

The Task Graph turns a validated Design Genome into dependency-aware work. It is both a decision graph (what must be true before what) and an execution DAG (what can run in parallel).

Canonical template: [templates/task-graph.yaml](../templates/task-graph.yaml)
Packet template: [templates/agent-task.md](../templates/agent-task.md)
User-visible map: [templates/design-brain.md](../templates/design-brain.md) ([design-brain.md](design-brain.md))

YAML is machine truth. The Design Brain Mermaid view is what the user inspects. Keep them in sync.

---

## Node Schema

Each task node includes:

| Field | Purpose |
| :--- | :--- |
| `id` | Stable task ID (`research.refs`, `type.system`, `ui.hero`) |
| `title` | Short human label |
| `goal` | One-sentence outcome |
| `inputs` | Genome paths, artifacts, prior task outputs |
| `outputs` | Artifacts or genome mutations produced |
| `depends_on` | List of task IDs that must be `done` |
| `agent_role` | Role from orchestration table |
| `tools` | Approved tool IDs from capability registry |
| `validation` | Checks before marking done |
| `status` | `pending` \| `ready` \| `running` \| `done` \| `blocked` \| `stale` \| `cancelled` |
| `confidence` | 0 to 1 confidence in plan or result |
| `notes` | Blockers, assumptions |

---

## Building the Graph

1. Start from genome readiness and open questions
2. Add research nodes for unknown references or tech docs
3. Add direction nodes (art, type, UX, motion, spatial) as needed
4. Add implementation nodes that consume direction outputs
5. Add integration node for shared tokens/shell
6. Add Design QA → Implementation QA → Final Critique chain
7. Wire `depends_on` so independent direction work can run in parallel
8. Render the DAG into the Design Brain (and decision tree from the genome); surface it to the user before implementation kickoff

### Example skeleton

```text
discovery.complete (done)
  → genome.validate
  → research.refs
  → type.system ──┐
  → art.direction ┼→ integrate.tokens → impl.ui.shell → impl.ui.sections
  → ux.flows ─────┘                         ↓
                                    qa.design → qa.impl → critique.final
```

---

## Readiness

A node becomes `ready` when every dependency is `done` and required inputs exist. If a required genome field is `uncertain` and the node is high-cost, mark `blocked` and return to discovery or contradiction resolution.

---

## Graph-Aware Delegation

- One packet per node
- Include only relevant genome excerpts
- Declare non-goals to prevent scope creep
- On completion, write outputs to the paths listed and update status/confidence

---

## Parallel Execution

Safe to parallelize when:

- No shared mutable artifact without merge strategy
- Dependencies satisfied
- Tools are available and approved

Prefer parallel Art Direction + Typography + UX research after genome lock; serialize token integration.

---

## Status Transitions

```text
pending → ready → running → done
                ↘ blocked
done + genome mutation on inputs → stale → ready (after refresh)
```

---

## Confidence

Use confidence for planning honesty:

- Plan confidence low: add research or validation nodes
- Result confidence low: do not mark release-ready; extend QA

See [agent-orchestration.md](agent-orchestration.md) for role assignment and validation ladder.
