# pixasso-mcp

Model Context Protocol (MCP) server for Pixasso: the complete end-to-end frontend engineering and design orchestrator for AI agents and developers.

[![npm version](https://img.shields.io/npm/v/pixasso-mcp.svg)](https://www.npmjs.com/package/pixasso-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)

Pixasso bridges visionary art direction with robust frontend architecture across 16 foundational engineering pillars. It gives LLMs, coding assistants, and autonomous agents the ability to dynamically discover user intent, validate design tokens, compile Graphify-style architecture decision graphs, critique layouts against AI tropes, search 31 reference catalogs, and generate automated multi-viewport testing matrices.

Live Showcase & Specifications: [https://pixasso.erebuzzz.tech](https://pixasso.erebuzzz.tech) or [https://pixasso-two.vercel.app](https://pixasso-two.vercel.app)

---

## System Architecture

```mermaid
flowchart TD
    User["Developer / AI Agent Prompt"] --> Client["MCP Client (Claude / Cursor / Antigravity)"]
    Client --> Server["pixasso-mcp Stdio Server"]

    subgraph Tools ["Exposed Tools (JSON-RPC)"]
        T1["pixasso_discover_intent"]
        T2["pixasso_search_references"]
        T3["pixasso_fetch_reference"]
        T4["pixasso_generate_genome"]
        T5["pixasso_generate_brain"]
        T6["pixasso_audit_design"]
        T7["pixasso_generate_test_plan"]
    end

    Server --> Tools

    T1 --> P1["Deterministic Inquiry Picker<br/>(16 Architecture Pillars & Brand Gate)"]
    T2 --> P2["31 Deep Reference Catalogs<br/>(Typography, Shaders, Layouts)"]
    T3 --> P3["Live DOM & Content Extraction<br/>(Linkedom, Readability, SPA Detection)"]
    T4 --> P4["Design Genome Specification<br/>(YAML Tokens, Verified References)"]
    T5 --> P5["Design Brain DAG<br/>(Mermaid Decision Graph)"]
    T6 --> P6["Objective Critique Engine<br/>(5-Pillar Scorecard)"]
    T7 --> P7["Automated Interface QA<br/>(390px, 768px, 1024px, 1440px)"]
```

---

## Deployment & Connection Transports

Pixasso MCP ships with dual transport architectures side by side:
1. **Local Stdio (npm)**: Runs locally on your machine via stdio with zero network latency.
2. **Hosted Remote (Cloudflare Workers)**: Serverless Streamable HTTP endpoint secured via GitHub OAuth, requiring zero local runtime dependencies.

---

## 1. Hosted Remote Endpoint (Streamable HTTP)

Connect any remote-compatible MCP client directly to:

```text
https://mcp.pixasso.erebuzzz.tech/mcp
```

Connecting will open a GitHub OAuth prompt (`read:user`, `user:email`) to authorize your session. Each authenticated GitHub account receives a daily allowance of 500 tool calls.

---

## 2. Local Stdio Quick Start

Run instantly without local installation:

```bash
npx -y pixasso-mcp
```

Or install globally:

```bash
npm install -g pixasso-mcp
```

---

## Client Integration

### 1. Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pixasso-local": {
      "command": "npx",
      "args": ["-y", "pixasso-mcp"]
    },
    "pixasso-remote": {
      "url": "https://mcp.pixasso.erebuzzz.tech/mcp"
    }
  }
}
```

### 2. Cursor
Add to your Cursor MCP settings (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "pixasso-local": {
      "command": "npx",
      "args": ["-y", "pixasso-mcp"]
    },
    "pixasso-remote": {
      "url": "https://mcp.pixasso.erebuzzz.tech/mcp"
    }
  }
}
```

### 3. Claude Code CLI
Register local or remote:

```bash
# Local stdio
claude mcp add pixasso npx -y pixasso-mcp

# Remote HTTP
claude mcp add pixasso-remote --transport http https://mcp.pixasso.erebuzzz.tech/mcp
```

### 4. Google Antigravity & Gemini CLI
Add to `~/.gemini/antigravity/mcp_config.json`:

```json
{
  "mcpServers": {
    "pixasso": {
      "command": "npx",
      "args": ["-y", "pixasso-mcp"]
    },
    "pixasso-remote": {
      "url": "https://mcp.pixasso.erebuzzz.tech/mcp"
    }
  }
}
```

---

## Exposed MCP Tools

| Tool | Purpose | Key Inputs |
| :--- | :--- | :--- |
| `pixasso_discover_intent` | Deterministic template-question picker across 16 pillars and brand genesis. Generates targeted interactive popup questions for host `ask_question`. | `projectArchetype`, `description`, `hasBrandIdentity`, `referenceUrls` |
| `pixasso_search_references` | Search across 31 curated design & architecture catalogs. | `query`, `category`, `tag` |
| `pixasso_fetch_reference` | Fetches live HTML, extracts title/headings/readable text, detects client SPAs, and caches verified fetches. | `url`, `focus` |
| `pixasso_generate_genome` | Compiles tokens, color ramps, typography, and libraries into `design-genome.yaml`. Enforces programmatic hard gate on verified references. | `archetype`, `palette`, `typography`, `references` |
| `pixasso_generate_brain` | Synthesizes a visual Graphify Mermaid decision graph and Task DAG. | `decisions`, `components` |
| `pixasso_audit_design` | Evaluates markup and styling against AI design anti-patterns. | `codeSnippet`, `context` |
| `pixasso_generate_test_plan` | Produces multi-viewport QA plans (390px, 768px, 1024px, 1440px). | `targetUrls`, `checkSensory` |

### Tool Scope & Design Integrity Hard Gates

- **`pixasso_discover_intent` (Deterministic Question Picker)**: This tool is purposefully deterministic. It evaluates the project archetype, brand status, and whether reference URLs were supplied, outputting structured popup questions without relying on non-deterministic LLM prompting within the tool. The returned `compulsoryPopupQuestions` are intended to be presented directly to the user via the host agent interactive modal (`ask_question`).
- **`pixasso_fetch_reference` (Real Content Deconstruction)**: Autonomous models often hallucinate visual traits from domain names alone. `pixasso_fetch_reference` inspects live pages, extracting DOM headings, metadata, visible links, and readable text via Mozilla Readability. If the page is an empty client SPA shell (under 200 characters of text), it flags `renderedContentDetected: false` so agents do not fabricate visual descriptions.
- **Reference Gate on `pixasso_generate_genome`**: Any reference URL supplied to `pixasso_generate_genome` must first be verified through `pixasso_fetch_reference` in the active session. If an unfetched URL is passed, the tool rejects the call with an informative error. Furthermore, unrendered SPA shells cannot claim `epistemicStatus: 'known'` without screenshot verification.

---

## Architecture Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant Agent as Autonomous Agent
    participant MCP as pixasso-mcp
    participant Engine as Design Engine

    Agent->>MCP: pixasso_discover_intent(projectType)
    MCP-->>Agent: 16-Pillar Clarification Matrix & Brand Gate
    Agent->>Agent: Interactive User Alignment (ask_question)
    Agent->>MCP: pixasso_generate_genome(alignedSpecs)
    MCP-->>Agent: Validated design-genome.yaml
    Agent->>MCP: pixasso_generate_brain(decisions)
    MCP-->>Agent: Mermaid Decision Map & Component DAG
    Agent->>Engine: Component Fabrication (Semantic HTML5 / CSS / React)
    Agent->>MCP: pixasso_audit_design(componentMarkup)
    MCP-->>Agent: 5-Pillar Scorecard & Anti-Pattern Check
    Agent->>MCP: pixasso_generate_test_plan(viewports)
    MCP-->>Agent: Multi-Viewport Overflow Matrix (390px to 1440px)
```

---

## The 16 Architecture Pillars

Pixasso orchestrates 16 distinct engineering disciplines:

1. **UI and Visual Design**: Ground tone, contrast geometry, and materiality.
2. **Semantic HTML5 & JSX**: Meaningful DOM hierarchies and ARIA roles.
3. **Modern CSS & Tailwind**: Custom properties, container queries, and subgrid layouts.
4. **TypeScript & JS Logic**: Strict typing, immutable schemas, and runtime contracts.
5. **Framework Architecture**: React, Next.js, Svelte, Vue, and Astro paradigms.
6. **State Management**: Zustand, Redux Toolkit, signals, and context boundaries.
7. **API & WebSockets**: Streaming endpoints, SSE telemetry, and real-time state.
8. **Client Auth UX**: Optimistic sessions, token lifecycle, and secure storage.
9. **Forms & Zod Validation**: Type-safe schema validation and real-time feedback.
10. **Motion & 3D WebGL**: Three.js shaders, CSS hardware transforms, and WebGPU.
11. **Responsive Multi-Device Design**: Viewport sweeps at 390px, 768px, 1024px, and 1440px.
12. **WCAG AA/AAA Accessibility**: Keyboard navigation, focus rings, and screen-reader testing.
13. **Core Web Vitals**: INP, LCP, CLS optimizations, and asset tree-shaking.
14. **Testing Architecture**: Vitest, Playwright, and automated overflow checks.
15. **Tooling & DX**: ESLint, Prettier, Vite, and automated CI pipelines.
16. **Edge Deployment**: Immutable releases on GitHub Pages, Vercel, and Cloudflare.

---

## Resources & Prompts

### Resources (`pixasso://`)
- `pixasso://references/{catalogName}`: Direct read access to all 31 reference catalogs including typography systems, motion choreography, sound design, and shader parameters.
- `pixasso://templates/{templateName}`: Access to production blueprints including `design-genome.yaml`, `interface-test-plan.md`, and `code-review.md`.

### Prompts (`mcp://prompts/`)
- `intent-discovery`: Prompt for launching adaptive user interviews without form fatigue.
- `frontend-architecture`: Scaffold complete 16-pillar architecture blueprints.
- `design-critique`: Run rigorous design audits to identify and eliminate AI visual tropes.
- `typography-direction`: Formulate harmonious display, serif, and monospace pairings.
- `interface-qa`: Execute multi-device viewport tests and sensory verification.

---

## License

MIT (c) Erebuzzz
