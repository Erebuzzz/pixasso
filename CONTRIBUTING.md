# Contributing to Pixasso

Thanks for helping improve Pixasso. This repository is a public Agent Skill (docs, prompts, and templates), not an application runtime. Contributions should keep the skill installable, accurate, and intentional.

## How to propose changes

1. **Search existing issues** before opening a new one.
2. **Open an issue** for bugs, unclear guidance, or feature ideas when the change needs discussion.
3. **Open a pull request** for concrete edits. Prefer small, focused PRs over large mixed changes.
4. Use the PR template. Describe *what* changed and *why*.

## Skill package layout

Canonical publishable skill:

```text
skills/pixasso/
├── SKILL.md
├── references/
├── templates/
└── prompts/
```

Source catalogs at the repo root (`references/`, `templates/`, `prompts/`) are editable working copies. After you change them, sync into `skills/pixasso/` before opening a PR.

### Keep mirrors in sync

If you change skill content under `skills/pixasso/`, also update these mirrors so project-scoped agents stay consistent:

- `.cursor/skills/pixasso/`
- `.agents/skills/pixasso/`

Root adapters (`SKILL.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/`) should stay aligned with the canonical package intent, but they are not a substitute for updating `skills/pixasso/`.

## Documentation style

- **No emdashes.** Use colons, commas, or hyphens instead.
- Prefer clear, professional prose. Keep emoji use minimal.
- Inside the skill package, use **relative links only** (no absolute `file://` or machine-specific paths).
- `skills/pixasso/SKILL.md` description must stay **third-person WHAT + WHEN** (what the skill does, when to use it).

## What not to commit

These files are gitignored and must not be added:

- `WORKFLOW_CONTEXT.md`
- `code_review.md`

Also do not commit secrets, `.env` files, or personal credentials.

## Pull request expectations

- Clear title and description of intent
- Relative links only within `skills/pixasso/`
- Canonical package updated (and mirrors synced when skill content changes)
- `SKILL.md` description remains third-person WHAT + WHEN
- No emdashes in contributed docs
- No ignored local workflow artifacts

## License

By contributing, you agree that your contributions are licensed under the same [MIT License](LICENSE) as the project.

## Security

To report a vulnerability, see [SECURITY.md](SECURITY.md). Do not open a public issue for security-sensitive reports.
