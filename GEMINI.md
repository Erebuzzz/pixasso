# GEMINI.md: Pixasso Rules

Pixasso is a multidisciplinary design-research and implementation skill inspired by Picasso. It covers 2D, 2.5D, 3D, canvas interfaces, WebGL/WebGPU, editorial layouts, and production web applications.

## Universal Principles for Gemini / Antigravity

1. **MUST RULE: Compulsory Popup Questions (`ask_question`) Before Planning**:
   Whenever designing, prototyping, or implementing an interface or component, you MUST ALWAYS call the `ask_question` tool to present interactive popup questions to the user BEFORE writing an implementation plan or generating code. Never assume design intent and never bury questions inside implementation_plan.md. You must obtain complete clarity on:
   - Theme, narrative world, and aesthetic vibe (with curated directions + user write-in)
   - Typography architecture (mandatory: headline personality, serif vs sans vs mono, weight, hierarchy)
   - Color mood, ground tone, and materiality
   - Dimensionality (2D planar vs 2.5D parallax vs 3D WebGL)
   - Motion and sensory feedback (UISFX audio cues)
   - Primary action and conversion goal
   Block planning until the user answers the popup questions.

2. **Intent → Genome → DAG**:
   Prefer adaptive discovery and a validated Design Genome before implementation. Plan work with a Task DAG and specialist roles when needed. Deep docs: `skills/pixasso/references/`.

3. **Design Research First**:
   Always deconstruct reference benchmarks and official library documentation before writing code. Extract principles, not surface visual identities.

4. **No Emdashes Rule**:
   Never use emdashes anywhere in responses, code comments, or documentation files. Use colons, commas, parentheses, or rewrite the sentence cleanly.

5. **Low Emoji Rule**:
   Keep emojis to a minimum across all responses and files.

6. **Human Written Code Quality**:
   All code, component markup, and CSS must look human written, clean, modular, and production-tested. Avoid bloated template filler.

7. **Anti-Pattern Guardrail**:
   Detect and eliminate generic AI design tropes: purple gradients, Lucide icon flooding, universal scroll-fades, and glassmorphism defaults. Provide distinct, intentional alternatives.

8. **Documentation and Diagrams**:
   Ensure documentation files use Mermaid diagrams to illustrate architecture, design workflows, and decision trees.

9. **Global Rule: Intent & Feel First**:
   Never default to generic SaaS layouts. Always inquire about the aesthetic vibe, emotional tone, and atmospheric feel. When user input is minimal, synthesize 2 to 3 curated aesthetic directions for the user to choose from.

10. **Agent Harnesser**:
    Coordinate with installed agent skills (such as `generative_ui` for live previews) and active MCP tools (`chrome-devtools-mcp` for browser navigation and Spline 3D generation, StitchMCP for layouts).

11. **Sensory Craft**:
    Support subtle sonic micro-interactions via Web Audio API where tactile auditory confirmation improves usability (consult `references/sound-and-sensory-design.md`).

12. **Interface Testing & Automated QA**:
    Execute multi-viewport verification (390px, 768px, 1024px, 1440px), automated overflow detection, accessibility/ARIA audits, and performance checks using available MCP tools (`chrome-devtools-mcp`) and installed skills before marking any design ready (`references/interface-testing-and-qa.md`, `templates/interface-test-plan.md`).
