# Agent Orchestration

Pixasso orchestrates specialized agent roles from a capability-aware Task DAG. Spawn roles only when the graph needs them. Design intent and the Design Genome lead; tools and agents follow.

Deep prompts: [prompts/orchestrator.md](../prompts/orchestrator.md), [prompts/planner.md](../prompts/planner.md)
Task packet template: [templates/agent-task.md](../templates/agent-task.md)
Graph model: [task-graph.md](task-graph.md)

---

## Pipeline

```text
Intent Discovery
  → Design Genome
  → Genome Validation
  → Reference Research
  → Task / Dependency Graph (DAG)
  → Tool Discovery (approval)
  → Agent Assignment
  → Parallel Execution
  → Integration
  → Design QA
  → Implementation QA
  → Final Critique
```

Key principle:

**Intent → Design Genome → Decision Graph → Capability Graph → Task DAG → Agents → Validation**

### User-visible Design Brain

The genome, decision graph, and Task DAG are not internal-only. Maintain a Graphify-style [Design Brain](design-brain.md) ([templates/design-brain.md](../templates/design-brain.md)) the user can open: Mermaid decision tree + Task DAG, node legend, status, known/inferred markers.

**Always surface** the current brain (chat Mermaid and/or project file) at genome validation, after material genome/graph updates, and before implementation kickoff. YAML sidecars remain machine truth; the brain is the human map. Do not turn it into a second questionnaire.

---

## Agent Roles

Spawn only when a task requires the specialty.

| Role | Responsibility | Typical outputs |
| :--- | :--- | :--- |
| Discovery | Adaptive intent extraction | Draft genome fields, open questions |
| Art Director | Visual language, composition, color, narrative coherence | Direction memo, token proposals |
| Typography Director | Type system, pairing, scale, licensing | `typography-spec.yaml` |
| UX Architect | IA, flows, hierarchy, empty/error states | Flow outline, content priority |
| Motion Director | Motion vocabulary, timelines, reduced-motion | Motion spec |
| Spatial / 3D | WebGL/WebGPU scenes, fallbacks, DPR budgets | Scene plan, perf constraints |
| Design Research | Reference deconstruction, principle extraction | Research notes (principles, not clones) |
| Implementation Architect | Stack choices, component boundaries, a11y structure | Architecture notes |
| Asset | Imagery, icons, generative assets, 3D models | Asset list + prompts/sources |
| UI Implementation | Production UI code | Components, styles |
| QA / Critique | Design QA, implementation QA, anti-pattern audit | Critique against rubric |

A single operator may wear multiple roles when the graph is small. Parallelize only independent DAG nodes.

---

## Graph-Aware Delegation

For each task node:

1. Build a focused packet from [templates/agent-task.md](../templates/agent-task.md)
2. Include: task ID, goal, genome excerpts, inputs, dependencies' outputs, tools allowed, validation criteria, non-goals
3. Isolate context: do not dump full chat history
4. Return structured outputs that satisfy the node's output contract
5. Mark status and confidence on the DAG
6. After material status or dependency changes, refresh `design-brain.md` so the user-visible map stays honest

---

## Parallelism Rules

- Run nodes concurrently only when all dependencies are `done`
- Do not parallelize conflicting writers to the same genome section without a merge plan
- Integration node serializes shared surfaces (tokens, layout shell, routing)
- QA nodes depend on integration (or on the specific artifact they audit)

---

## Tool / MCP Policy

Discover tools, explain usefulness, get user approval, register capabilities. Tools never dictate aesthetic direction. See [tool-registry.md](tool-registry.md).

---

## Agent Harnesser: Installed Skills and MCP Coordination

Pixasso acts as an intelligent harnesser across already installed skills and active MCP servers:

1. **Installed Skills Collaboration**:
   - Inspect environment skills (such as `generative_ui` for interactive HTML component previews, `gemini-api-dev` for multimodal asset processing, or mobile CLI skills).
   - Delegate specialized sub-tasks to matching skills rather than re-implementing existing procedures.

2. **Browser Automation (`chrome-devtools-mcp` / browser-use)**:
   - Navigate live references to inspect DOM structures, computed styles, and layout transitions.
   - Automate 3D workflows: navigate to Spline 3D (https://spline.design/), submit generative 3D prompts (with user authorization or active session), and extract embeddable scene URLs or React component wrappers.
   - Perform automated viewport screenshot audits, evaluate responsive breakpoints, and verify focus indicator states.

3. **Design MCP Integrations (StitchMCP, Figma, Framer)**:
   - Use StitchMCP for screen generation, layout variants, and design system synchronization.
   - Connect to Figma or Framer when MCP tools are mounted to read vector nodes, styles, and token definitions.

---

## Validation Ladder

1. **Genome validation** (human) before expensive build
2. **Design QA**: craft, hierarchy, anti-patterns, type, motion intent
3. **Implementation QA**: browser validation, responsive, a11y, security checklist
4. **Final critique**: five-pillar rubric ([templates/design-critique-rubric.md](../templates/design-critique-rubric.md))

Existing SKILL rules for browser validation, subagents, security, responsive, motion, and anti-patterns remain authoritative.

---

## Failure and Stale State

- If genome mutates, mark dependent tasks `stale` and re-plan
- If an agent invents unavailable fonts/APIs, reject output and re-run with availability constraints
- If contradictions appear, pause for [contradiction-resolution.md](contradiction-resolution.md)
