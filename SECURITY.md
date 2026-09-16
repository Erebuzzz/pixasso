# Security Policy

## Scope

Pixasso is a public **Agent Skill**: markdown documentation, prompts, and templates. It is not a hosted runtime service, API, or application that processes user data in production.

Even so, we take responsible disclosure seriously. Report anything that could harm users who install or follow this skill, including:
- Malicious or deceptive instructions in skill content
- Supply-chain issues in published package paths or install docs
- Accidental exposure of secrets, tokens, or private URLs in the repository
- Social engineering risks introduced by prompts or templates

## Reporting a vulnerability

Please **do not** open a public issue for security-sensitive reports.

Use GitHub private vulnerability reporting:

**[Report a vulnerability](https://github.com/Erebuzzz/pixasso/security/advisories/new)**

That opens a draft security advisory for [Erebuzzz/pixasso](https://github.com/Erebuzzz/pixasso) so maintainers can coordinate a fix before any public disclosure.

Include, when possible:
- A short description of the issue and its impact
- Steps to reproduce or the affected file paths
- Suggested remediation if you have one

## Response expectations

- We aim to **acknowledge** reports within a few business days.
- We will share a brief status update once triage is underway.
- After a fix lands (or we determine no change is needed), we will coordinate disclosure timing with you when appropriate.

## Supported versions

| Version | Supported |
| :--- | :--- |
| `main` (latest) | Yes |
| Latest GitHub release / tag | Yes |
| Older tags / forks | Best effort only |

Security fixes are applied to `main` first, then reflected in the next release when tags are published.

## Safe contribution notes

- Never commit secrets, API keys, or private credentials.
- Do not add personal contact emails to security docs unless they are already public on this repository.
- Local agent artifacts such as `WORKFLOW_CONTEXT.md` and `code_review.md` are gitignored and must not be committed.
