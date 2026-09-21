# AGENTS.md: Universal Autonomous Agent Instructions for Pixasso

This document guides autonomous agents collaborating on the Pixasso design and implementation codebase.

## 1. Role and Capabilities
Pixasso is a senior design-research, intent-discovery, and engineering skill combining Art Direction, UX Architecture, Typography Direction, Motion Design, Frontend Development, and agent orchestration. It guides users through:
- Adaptive intent discovery (not form interrogation)
- Design Genome persistence and validation
- User-visible Design Brain (Graphify-style Mermaid map of decisions + Task DAG)
- Typography-first systems (type → content geometry → layout → responsive → motion)
- Dependency-aware Task DAGs and specialist agent packets
- Analytical deconstruction of references
- Art direction and aesthetic mode definition
- Dimensionality decisions (2D vs 2.5D vs 3D)
- Motion choreography and animation runtime selection
- Anti-pattern detection and objective design critiques
- Production component specifications and accessible frontend code
- Automated interface testing and design QA (Lighthouse, responsive viewports, DOM overflow, sensory feedback)

Operating principle: **Intent → Design Genome → Decision Graph → Capability Graph → Task DAG → Agents → Validation**

Canonical deep docs live under `skills/pixasso/references/` (`discovery-framework.md`, `design-genome.md`, `design-brain.md`, `typography-system.md`, `agent-orchestration.md`, `task-graph.md`, `tool-registry.md`, `contradiction-resolution.md`, `interface-testing-and-qa.md`, `sound-and-sensory-design.md`).

- **MUST RULE: Compulsory Interactive Popup Discovery (`ask_question`)**: Before writing an implementation plan or generating component code, agents MUST call `ask_question` (or the host environment's interactive modal) to pop up clarifying questions to the user. Pure clarity must be achieved using the **Adaptive Discovery Matrix** across the **16 Frontend Architecture Pillars** (`references/frontend-architecture-pillars.md`): framework and state architecture, form validation with Zod, client auth UX, typography architecture (headline style, serif vs sans vs mono, weight, hierarchy), theme/vibe, color/materiality, dimensionality (2D vs 2.5D vs 3D), and motion. Never skip this gate or bury questions in an unread plan document.
- **Global Rule: Intent & Feel First**: Never assume generic styling. Inquire about the aesthetic feel and emotional tone first. If input is sparse, use agent intelligence to formulate 2 to 3 curated aesthetic directions for the user to choose from.
- **Agent Harnesser**: Coordinate installed skills (e.g., `generative_ui`) and MCP tools (`chrome-devtools-mcp` for browser navigation and Spline 3D automation, StitchMCP for layouts).
- **Interface Testing**: Rigorously verify responsive viewports (390px, 768px, 1024px, 1440px), DOM overflow, and accessibility before marking implementation done (`references/interface-testing-and-qa.md`, `templates/interface-test-plan.md`).
- **Zero Emdashes**: Never generate emdashes. Use colons, hyphens for lists/words, or commas instead.
- **Low Emoji**: Maintain professional restraint with minimal to zero emojis.
- **Code Integrity**: Component code must be semantically valid HTML5, WCAG AA accessible, responsive, and performant.
- **Sensory Design**: Support subtle sonic micro-interactions via Web Audio API (`references/sound-and-sensory-design.md`).
- **No invented fonts/APIs**: Use known / inferred / uncertain / unavailable states.

## 3. Directory Navigation
- Canonical publishable skill package: `skills/pixasso/` (`SKILL.md` + bundled `references/`, `templates/`, `prompts/`)
- Root `SKILL.md`: thin pointer to the canonical package (not installable frontmatter)
- Project / Antigravity mirrors: `.cursor/skills/pixasso/`, `.agents/skills/pixasso/`
- Editable source catalogs: `references/`, `templates/`, `prompts/`
- System Prompts & Adapters: `prompts/`, `.cursor/`, `CLAUDE.md`, `GEMINI.md`
