# Agent Task Packet

Focused work order for one Task DAG node. Prefer genome excerpts over full chat history.

Related: [references/agent-orchestration.md](../references/agent-orchestration.md), [references/task-graph.md](../references/task-graph.md)

---

## Header

- **Task ID**:
- **Title**:
- **Agent role**:
- **Status**: pending | ready | running | done | blocked | stale | cancelled
- **Confidence** (plan): 0.0 to 1.0

## Goal

One sentence: what done looks like.

## Non-goals

What this agent must not expand into.

## Genome excerpts

Paste only relevant paths and values (with epistemic status).

```yaml
# relevant slices from design-genome.yaml
```

## Inputs

- Dependency outputs:
- Artifacts:
- Constraints:

## Tools allowed

Only approved registry IDs:

-

## Procedure

1.
2.
3.

## Output contract

- Files / genome mutations to produce:
- Format requirements:

## Validation checklist

- [ ]
- [ ]

## Return format

```text
status: done | blocked | stale
confidence: 0.0-1.0
outputs: ...
genome_mutations: ...
blockers: ...
notes: ...
```
