# Tool and MCP Registry

Tools and MCP servers extend Pixasso's reach. They never dictate design intent. Discover capabilities, explain usefulness, get approval, then register.

Related: [agent-orchestration.md](agent-orchestration.md), project memory in [templates/project-state.yaml](../templates/project-state.yaml)

---

## Principles

1. **Intent first**: Genome and task goals decide whether a tool is useful
2. **Discover, do not assume**: Inspect the live environment for available tools/MCPs
3. **Explain usefulness**: Tell the user what the tool enables for this project
4. **Approve before bind**: Do not bind new powerful tools into the DAG without assent when approval is expected
5. **Least privilege**: Task packets list only tools needed for that node
6. **No aesthetic capture**: A shader toy or component library must not override genome visual language

---

## Discovery Procedure

When starting a non-trivial project (or when the user asks what you can use):

1. Enumerate available skills, MCPs, browser tools, design tools, and CLIs
2. Map each to capability tags (for example `browser.validate`, `figma.read`, `deploy`, `docs.fetch`)
3. Propose a short list relevant to the genome (skip unrelated)
4. Record approved tools in the project capability registry
5. Reference tool IDs from Task DAG nodes

---

## Capability Entry Schema

```yaml
tools:
  - id: browser.validate
    name: Cursor IDE Browser
    capability_tags: [browser, screenshot, a11y-inspect]
    usefulness: "Validate implemented UI across viewports"
    status: approved | proposed | rejected | unavailable
    notes: ""
```

---

## Common Capability Tags

| Tag | Example use |
| :--- | :--- |
| `browser` | Implementation QA, visual verification |
| `design-file` | Figma read/write, tokens |
| `docs` | Official API documentation fetch |
| `asset-gen` | Image/SVG/shader generation |
| `motion-tune` | Dial/timeline feel tools |
| `deploy` | Preview deployments |
| `security` | Dependency or secret scans |
| `research` | Live site deconstruction |

---

## Binding to Tasks

Task nodes may only use `approved` tools (or clearly safe read-only tools already in the agent baseline). If a node needs an unapproved tool, set status `blocked` and request approval.

---

## Rejection and Unavailability

- `rejected`: do not call; find an alternative path
- `unavailable`: document gap; degrade gracefully (for example self-audit if browser tools missing, still required by SKILL QA gates as self-check)

Baseline SKILL gates (browser validation when available, subagent QA, security, responsive) remain mandatory intent even when a specific MCP is missing.
