# Pixasso

Pixasso is a public **Agent Skill** for multidisciplinary design research, intent discovery, planning, and implementation. It helps agents (and humans) discover design intent, lock a Design Genome, orchestrate specialist work via a Task DAG, then critique and ship digital experiences with intentional art direction instead of generic AI UI defaults.

Inspired by Picasso's exploratory breadth, Pixasso synthesizes:
- **Art Director**: Visual language, composition, surface, emotional tone
- **UX Architect**: Hierarchy, flows, accessibility, cognitive load
- **UI Designer**: Components, responsive layout, typographic systems
- **Typography Director**: First-class type systems before layout lock
- **Motion Designer**: Communicative animation, scroll, springs, scene transitions
- **Design Researcher**: Benchmark deconstruction and principle extraction
- **Creative Technologist**: WebGL, WebGPU, canvas, shaders, generative assets
- **Frontend Architect**: Semantic, WCAG AA, production-ready web code
- **Orchestrator**: Genome-backed task graphs and capability-aware agent assignment

## When to use it

Use Pixasso when you need help with:
- Landing pages, marketing sites, portfolios, and editorial layouts
- Product UI, dashboards, design systems, and component specs
- Motion systems, scroll choreography, and dimensionality choices (2D / 2.5D / 3D)
- Design critiques that reject purple-gradient / Lucide-flood / glassmorphism clichés
- Creative coding, WebGL scenes, and hybrid canvas + DOM interfaces

## Install

Canonical package path: `skills/pixasso/` (self-contained `SKILL.md` + `references/` + `templates/` + `prompts/`).

### skills.sh / npx (recommended)

```bash
npx skills add Erebuzzz/pixasso@pixasso
```

Because this repo contains a single discoverable skill under `skills/pixasso/`, you can also run:

```bash
npx skills add Erebuzzz/pixasso
```

Global install example:

```bash
npx skills add Erebuzzz/pixasso@pixasso -g
```

### Cursor personal skill

Copy or symlink the package into your Cursor skills directory:

```bash
# macOS / Linux
cp -R skills/pixasso ~/.cursor/skills/pixasso
# or: ln -s /path/to/pixasso/skills/pixasso ~/.cursor/skills/pixasso
```

```powershell
# Windows (PowerShell)
robocopy ".\skills\pixasso" "$env:USERPROFILE\.cursor\skills\pixasso" /MIR
```

Restart Cursor or open a new agent chat so skill discovery refreshes.

### Cursor project skill

This repository already mirrors the package at `.cursor/skills/pixasso/` for project-scoped use after clone.

### Other agents

- **Claude Code**: root `CLAUDE.md` plus the package under `skills/pixasso/`
- **Gemini / Antigravity**: `GEMINI.md` and `.agents/skills/pixasso/`
- **ChatGPT / Grok / local LLMs**: prompts under `skills/pixasso/prompts/`

## Package layout

```text
pixasso/
├── SKILL.md                    # Repo pointer only (not installable frontmatter)
├── README.md
├── LICENSE                     # MIT
├── AGENTS.md / CLAUDE.md / GEMINI.md
├── .cursorrules
├── .cursor/
│   ├── rules/pixasso.mdc
│   └── skills/pixasso/         # Project mirror of the canonical package
├── .agents/skills/pixasso/     # Antigravity mirror
├── skills/pixasso/             # CANONICAL publishable skill
│   ├── SKILL.md
│   ├── references/
│   ├── templates/
│   └── prompts/
├── references/                 # Editable source catalogs (sync into package)
├── templates/
└── prompts/
```

## Architecture

```mermaid
flowchart TB
    subgraph Core ["Pixasso Core"]
        SKILL["skills/pixasso/SKILL.md"]
    end

    subgraph Intent ["Intent and genome"]
        DISC["Discovery framework"]
        GENOME["Design Genome"]
        BRAIN["Design Brain map"]
        TYPE["Typography system"]
        MEM["Project state memory"]
    end

    subgraph Plan ["Planning and agents"]
        DAG["Task DAG"]
        ORCH["Agent orchestration"]
        TOOLS["Tool / MCP registry"]
        CONTR["Contradiction resolution"]
    end

    subgraph References ["Knowledge catalogs"]
        UI_REF["UI and component libraries<br/>(Aceternity, Originkit, Dialkit, RareUI, etc.)"]
        MOTION_REF["Motion and animation<br/>(Transitions.dev, SceneAI.art, Motion, GSAP)"]
        GALLERY_REF["Inspiration galleries<br/>(Curated.design, Recent.design, VibeUI, Framer)"]
        CASES_REF["Live case studies"]
        CREATIVE_REF["Creative coding, Spline 3D & WebGL<br/>(Spline, ThreeUI, Glass Samasante)"]
        SOUND_REF["Sound and sensory design<br/>(UISFX, Web Audio API)"]
        QA_REF["Interface testing & QA<br/>(chrome-devtools-mcp, Lighthouse, Overflow)"]
        ART_REF["Art direction and dimensions"]
        ANTIPATTERN_REF["Anti-patterns and critique"]
        GEN_REF["Generative assets and tools"]
    end

    subgraph Templates ["Operational templates"]
        BRIEF["Adaptive design brief"]
        GYAML["design-genome.yaml"]
        BRAINMD["design-brain.md"]
        TYAML["typography-spec.yaml"]
        TG["task-graph.yaml"]
        TEST_PLAN["interface-test-plan.md"]
        CRITIQUE["Critique rubric"]
        MODE["Design mode spec"]
        COMP["Component implementation spec"]
    end

    subgraph Adapters ["Platform adapters"]
        CURSOR["Cursor rules and project skill"]
        CLAUDE["CLAUDE.md"]
        GEMINI["GEMINI.md and .agents/skills"]
        AGENTS["AGENTS.md"]
        PROMPTS["prompts/"]
    end

    SKILL --> Intent
    SKILL --> Plan
    SKILL --> References
    SKILL --> Templates
    Adapters --> SKILL
    Intent --> Plan
```

## Global Rule: Intent & Feel First

Pixasso strictly avoids assuming generic styling defaults. It enforces an upfront inquiry into the emotional atmosphere, aesthetic vibe, and tactile feel before planning layouts or components.

```mermaid
flowchart TD
    Req["Initial User Request"] --> AskFeel["Inquire on Vibe & Emotional Temperature<br/>(calm, austere, playful, technical, editorial, luxurious)"]
    AskFeel --> UserResponse{"User response clarity?"}

    UserResponse -->|"Clear, descriptive vision"| LockGenome["Incorporate into Design Genome"]
    UserResponse -->|"Minimal input or 'make it look good'"| Fallback["Agent Intelligence Fallback Protocol"]

    Fallback --> OptionA["Persona A: Obsidian Precision<br/>(Dark slate, crisp mono type, technical restraint)"]
    Fallback --> OptionB["Persona B: Warm Editorial<br/>(Ivory ground, commanding serifs, literary poise)"]
    Fallback --> OptionC["Persona C: Tactile Minimalist<br/>(Bone and charcoal, physical micro-interactions)"]

    OptionA --> UserSelect["User selects or refines persona"]
    OptionB --> UserSelect
    OptionC --> UserSelect
    UserSelect --> LockGenome
```

## Agent Harnesser: Installed Skills & MCP Coordination

Pixasso functions as an orchestrator across your active development environment, delegating tasks to installed skills and coordinating with MCP tools:

```mermaid
flowchart LR
    PixassoCore["Pixasso Core Orchestrator"] --> InstalledSkills["Installed Agent Skills"]
    PixassoCore --> MCPTools["Active MCP Servers"]

    InstalledSkills --> GenUI["generative_ui<br/>(Interactive HTML/React previews)"]
    InstalledSkills --> GeminiDev["gemini-api-dev<br/>(Multimodal asset processing)"]

    MCPTools --> BrowserMCP["chrome-devtools-mcp / browser-use<br/>(Reference deconstruction, responsive testing)"]
    MCPTools --> SplineWorkflow["Spline 3D Automation<br/>(Prompt generation & scene embeds)"]
    MCPTools --> DesignMCP["StitchMCP / Figma / Framer<br/>(Screen generation & token sync)"]
```

## Design pipeline

Operating principle: **Intent → Design Genome → Decision Graph → Capability Graph → Task DAG → Agents → Validation**

The Design Genome and Task DAG are also surfaced to users as a Graphify-style **Design Brain** (`templates/design-brain.md`): Mermaid decision tree + DAG with status and known/inferred markers, paired with YAML sidecars for machine truth.

```mermaid
flowchart LR
    A[Intent Discovery] --> B[Design Genome]
    B --> C[Genome Validation]
    C --> Brain[Design Brain map]
    Brain --> D[Reference Research]
    D --> E[Task DAG]
    E --> Brain
    E --> F[Tool Discovery]
    F --> G[Agent Assignment]
    G --> H[Parallel Execution]
    H --> I[Integration]
    I --> J[Design QA]
    J --> K[Implementation QA]
    K --> L[Final Critique]
```

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Pixasso as Pixasso Agent
    participant Genome as Design Genome
    participant DAG as Task DAG
    participant Agents as Specialist Agents
    participant Code as Frontend Delivery

    User->>Pixasso: Design request
    Pixasso->>User: Adaptive discovery stages
    User-->>Pixasso: Clarifications
    Pixasso->>Genome: Draft with epistemic states
    Pixasso->>User: Human-readable genome validation
    User-->>Genome: Corrections / lock
    Pixasso->>DAG: Plan dependencies and roles
    DAG->>Agents: Focused task packets
    Agents-->>Pixasso: Direction + implementation outputs
    Pixasso->>Code: Integrate tokens and ship UI
    Pixasso->>User: QA gates, critique, tradeoffs
```

## Dimensionality

```mermaid
graph TD
    Start["New interface"] --> TaskCheck{"Primary task?"}

    TaskCheck -->|"Dashboards, SaaS, dense tools"| Planar["2D planar"]
    TaskCheck -->|"Brand storytelling, explainers"| DepthCheck{"Need true spatial rotation?"}
    TaskCheck -->|"Configurator, digital twin, immersive"| Spatial["3D WebGL / WebGPU"]

    DepthCheck -->|"Layered depth is enough"| Layered["2.5D parallax"]
    DepthCheck -->|"360-degree inspection required"| Spatial
```

## Motion engines

Motion is communicative, not decorative. Prefer `transform` and `opacity`, durations about 150ms to 350ms for UI, and always honor `prefers-reduced-motion`.

| Need | Typical runtime |
| :--- | :--- |
| Gestures, layout morphs, UI states | Motion (motion.dev) |
| Scrubbed timelines | GSAP + ScrollTrigger |
| Physics sheets | React Spring |
| Smooth page scroll | Lenis |
| 3D scenes | React Three Fiber |
| Ambient shaders | Custom GLSL / shader tools |

## Interface Testing and Automated Design QA

Testing in Pixasso is an integral design discipline rather than an afterthought. Pixasso coordinates installed environment tools (such as `chrome-devtools-mcp`, browser automation, and `generative_ui`) to execute comprehensive multi-viewport verification across visual stability, accessibility, motion performance, and sensory cues before completing implementation.

```mermaid
flowchart TD
    Build["Generated UI / Component Implementation"] --> Preview["Visual Isolation Preview<br/>(generative_ui / dev server)"]
    Preview --> ViewportSuite["Multi-Viewport Sweep<br/>(chrome-devtools-mcp: resize_page)"]

    subgraph Viewports ["Responsive Verification Matrix"]
        Mobile["Mobile: 390px<br/>(Single column, >= 44px touch targets)"]
        Tablet["Tablet: 768px<br/>(Adaptive grid, medium density)"]
        Laptop["Laptop: 1024px<br/>(Multi-column, hover activation)"]
        Desktop["Desktop: 1440px+<br/>(Max container constraints, no stretch)"]
    end

    ViewportSuite --> Viewports
    Viewports --> DOMAudit["DOM Layout & Overflow Inspection<br/>(evaluate_script: scrollWidth vs innerWidth)"]

    subgraph HealthGates ["Automated Health & Quality Gates"]
        A11y["Accessibility & Keyboard Traversal<br/>(Tab navigation, visible focus rings, ARIA)"]
        Perf["Performance & Kinetic Trace<br/>(Lighthouse score >= 90, 60fps frame stability)"]
        Console["Console & Asset Integrity<br/>(Zero unhandled exceptions, zero 404s)"]
        Sensory["Sensory & Audio Validation<br/>(Web Audio latency < 10ms, global mute verified)"]
    end

    DOMAudit --> HealthGates
    HealthGates --> Report["Operational Test Plan Sign-Off<br/>(templates/interface-test-plan.md)"]
```

See [references/interface-testing-and-qa.md](references/interface-testing-and-qa.md) for automated evaluation scripts, keyboard accessibility assertions, and Lighthouse target thresholds. Document operational test cycles with [templates/interface-test-plan.md](templates/interface-test-plan.md).

## Anti-pattern stance

Pixasso rejects generic AI clichés (indigo/purple defaults, gradient hero type without structure, blanket glassmorphism, three identical icon cards, Lucide flooding, cursor beams, universal scroll-fades, muddy dark mode). When they appear, it says **This looks generic**, explains why, and proposes an authentic alternative.

## License

MIT. See [LICENSE](LICENSE).

## Security

To report a vulnerability privately, see [SECURITY.md](SECURITY.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to propose changes, sync skill mirrors, and open pull requests.

Keep the canonical package at `skills/pixasso/` self-contained with relative links only. After editing root `references/`, `templates/`, or `prompts/`, sync into `skills/pixasso/` and the Cursor / Antigravity mirrors before publishing.
