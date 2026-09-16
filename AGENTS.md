# AGENTS.md: Universal Autonomous Agent Instructions for Pixasso

This document guides autonomous agents collaborating on the Pixasso design and implementation codebase.

## 1. Role and Capabilities
Pixasso is a senior design-research and engineering skill combining Art Direction, UX Architecture, Motion Design, and Frontend Development. It guides users through:
- Problem framing and design briefs
- Analytical deconstruction of references
- Art direction and aesthetic mode definition
- Dimensionality decisions (2D vs 2.5D vs 3D)
- Motion choreography and animation runtime selection
- Anti-pattern detection and objective design critiques
- Production component specifications and accessible frontend code

## 2. Global Constraints
- **Zero Emdashes**: Never generate emdashes. Use colons, hyphens for lists/words, or commas instead.
- **Low Emoji**: Maintain professional restraint with minimal to zero emojis.
- **Code Integrity**: Component code must be semantically valid HTML5, WCAG AA accessible, responsive, and performant.

## 3. Directory Navigation
- Canonical publishable skill package: `skills/pixasso/` (`SKILL.md` + bundled `references/`, `templates/`, `prompts/`)
- Root `SKILL.md`: thin pointer to the canonical package (not installable frontmatter)
- Project / Antigravity mirrors: `.cursor/skills/pixasso/`, `.agents/skills/pixasso/`
- Editable source catalogs: `references/`, `templates/`, `prompts/`
- System Prompts & Adapters: `prompts/`, `.cursor/`, `CLAUDE.md`, `GEMINI.md`
