# PIXASSO

This file is a repository pointer only. It is intentionally **not** an installable Agent Skill entry (no YAML frontmatter), so the skills CLI discovers the canonical package under `skills/pixasso/`.

## Canonical package

**[skills/pixasso/SKILL.md](skills/pixasso/SKILL.md)**

That directory is self-contained and bundles:
- `SKILL.md` (full progressive-disclosure entry)
- `references/` (design research catalogs)
- `templates/` (briefs, critique, mode, component specs)
- `prompts/` (ChatGPT, Grok, universal system prompts)

## Install

```bash
npx skills add Erebuzzz/pixasso@pixasso
```

Or install the only skill in the repo:

```bash
npx skills add Erebuzzz/pixasso
```

| Target | Path |
| :--- | :--- |
| Cursor personal (global) | `~/.cursor/skills/pixasso/` |
| Cursor project | `.cursor/skills/pixasso/` |
| Antigravity / Gemini agents | `.agents/skills/pixasso/` |

Repo-root `references/`, `templates/`, and `prompts/` remain editable sources of truth and are synced into the package directories above.

For adapters and IDE rules, see `README.md`, `.cursorrules`, `.cursor/rules/pixasso.mdc`, `CLAUDE.md`, `GEMINI.md`, and `AGENTS.md`.
