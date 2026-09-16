# Pixasso

Pixasso is a public **Agent Skill** for multidisciplinary design research and implementation. It helps agents (and humans) discover, critique, prototype, and ship digital experiences with intentional art direction instead of generic AI UI defaults.

Inspired by Picasso's exploratory breadth, Pixasso synthesizes:
- **Art Director**: Visual language, composition, surface, emotional tone
- **UX Architect**: Hierarchy, flows, accessibility, cognitive load
- **UI Designer**: Components, responsive layout, typographic systems
- **Motion Designer**: Communicative animation, scroll, springs, scene transitions
- **Design Researcher**: Benchmark deconstruction and principle extraction
- **Creative Technologist**: WebGL, WebGPU, canvas, shaders, generative assets
- **Frontend Architect**: Semantic, WCAG AA, production-ready web code

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

    subgraph References ["Knowledge catalogs"]
        UI_REF["UI and component libraries"]
        MOTION_REF["Motion and animation"]
        GALLERY_REF["Inspiration galleries"]
        CASES_REF["Live case studies"]
        CREATIVE_REF["Creative coding and WebGL"]
        ART_REF["Art direction and dimensions"]
        ANTIPATTERN_REF["Anti-patterns and critique"]
        GEN_REF["Generative assets and tools"]
    end

    subgraph Templates ["Operational templates"]
        BRIEF["Design brief"]
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

    SKILL --> References
    SKILL --> Templates
    Adapters --> SKILL
```

## Design pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Pixasso as Pixasso Agent
    participant Research as Reference Catalog
    participant Spec as Specification Engine
    participant Code as Frontend Delivery

    User->>Pixasso: Design request
    Pixasso->>User: Targeted brief questions
    User-->>Pixasso: Clarifications
    Pixasso->>Research: Deconstruct references
    Research-->>Pixasso: Principles and tokens
    Pixasso->>Spec: Dimensional and motion strategy
    Spec->>Pixasso: Validated design mode
    Pixasso->>Code: Implement accessible components
    Pixasso->>User: Code, rationale, tradeoffs
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

## Anti-pattern stance

Pixasso rejects generic AI clichés (indigo/purple defaults, gradient hero type without structure, blanket glassmorphism, three identical icon cards, Lucide flooding, cursor beams, universal scroll-fades, muddy dark mode). When they appear, it says **This looks generic**, explains why, and proposes an authentic alternative.

## License

MIT. See [LICENSE](LICENSE).

## Security

To report a vulnerability privately, see [SECURITY.md](SECURITY.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to propose changes, sync skill mirrors, and open pull requests.

Keep the canonical package at `skills/pixasso/` self-contained with relative links only. After editing root `references/`, `templates/`, or `prompts/`, sync into `skills/pixasso/` and the Cursor / Antigravity mirrors before publishing.
