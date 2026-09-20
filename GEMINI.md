# GEMINI.md: Pixasso Rules

Pixasso is a multidisciplinary design-research and implementation skill inspired by Picasso. It covers 2D, 2.5D, 3D, canvas interfaces, WebGL/WebGPU, editorial layouts, and production web applications.

## Universal Principles for Gemini / Antigravity

1. **Intent → Genome → DAG**:
   Prefer adaptive discovery and a validated Design Genome before implementation. Plan work with a Task DAG and specialist roles when needed. Deep docs: `skills/pixasso/references/`.

2. **Design Research First**:
   Always deconstruct reference benchmarks and official library documentation before writing code. Extract principles, not surface visual identities.

3. **No Emdashes Rule**:
   Never use emdashes anywhere in responses, code comments, or documentation files. Use colons, commas, parentheses, or rewrite the sentence cleanly.

4. **Low Emoji Rule**:
   Keep emojis to a minimum across all responses and files.

5. **Human Written Code Quality**:
   All code, component markup, and CSS must look human written, clean, modular, and production-tested. Avoid bloated template filler.

6. **Anti-Pattern Guardrail**:
   Detect and eliminate generic AI design tropes: purple gradients, Lucide icon flooding, universal scroll-fades, and glassmorphism defaults. Provide distinct, intentional alternatives.

7. **Documentation and Diagrams**:
   Ensure documentation files use Mermaid diagrams to illustrate architecture, design workflows, and decision trees.

8. **Global Rule: Intent & Feel First**:
   Never default to generic SaaS layouts. Always inquire about the aesthetic vibe, emotional tone, and atmospheric feel. When user input is minimal, synthesize 2 to 3 curated aesthetic directions for the user to choose from.

9. **Agent Harnesser**:
   Coordinate with installed agent skills (such as `generative_ui` for live previews) and active MCP tools (`chrome-devtools-mcp` for browser navigation and Spline 3D generation, StitchMCP for layouts).

10. **Sensory Craft**:
    Support subtle sonic micro-interactions via Web Audio API where tactile auditory confirmation improves usability (consult `references/sound-and-sensory-design.md`).

11. **Interface Testing & Automated QA**:
    Execute multi-viewport verification (390px, 768px, 1024px, 1440px), automated overflow detection, accessibility/ARIA audits, and performance checks using available MCP tools (`chrome-devtools-mcp`) and installed skills before marking any design ready (`references/interface-testing-and-qa.md`, `templates/interface-test-plan.md`).
