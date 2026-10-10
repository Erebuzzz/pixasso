# Pixasso v1.2.1: Security Patch, Living Memory Cron Resilience & Zero Vulnerabilities

Pixasso v1.2.1 patches runtime and development dependencies to achieve zero known vulnerabilities, hardens the daily memory synchronization pipeline, and reaffirms the zero-key policy for end consumers.

---

### Key Improvements & Fixes

#### 1. Security Patches & Zero Vulnerability Audit (Clean Audit: 0 Vulnerabilities)
- **Resolved GHSA-6qxp-vccf-f47h**: Upgraded `@modelcontextprotocol/sdk` to `^1.32.1`, fixing the high-severity OAuth authorization server vulnerability.
- **Transitive Dependency Overrides**: Added strict package overrides in `mcp-server/package.json` for `@modelcontextprotocol/sdk`, `sharp` (>=0.35.5), and `undici` (>=7.30.0).
- **Zero Runtime & Build Vulnerabilities**: Verified that `npm audit` reports 0 vulnerabilities for both production packages installed at runtime and development builds.

#### 2. Living Memory Synchronization Workflow Resilience
- **Fixed Daily Cron Failure (GH Run #38027763888)**: Resolved detached HEAD checkout state in `.github/workflows/sync-taste-brain.yml` by pinning `ref: main` in `actions/checkout@v4`.
- **Branch Protection Fallback**: Added `pull-requests: write` permissions and an automated fallback: if branch protection blocks direct pushes to `main`, the workflow automatically pushes a dedicated sync branch and opens a PR via GitHub CLI (`gh pr create`) instead of failing.
- **Daily Memory Timestamp**: Refreshed living taste brain status and statistics in README.md.

#### 3. Reaffirmed Zero-Key Policy for Consumers
- End users consuming the Pixasso MCP server, skill, or plugin are never asked for API keys.
- If `NVIDIA_API_KEY` or `OPENROUTER_API_KEY` exist in the host runtime `process.env`, they are seamlessly utilized in the background. If absent, the router silently cascades to Cloudflare Workers AI and the offline 12 foundational movements graph.

#### 4. Architecture & 9 MCP Tools Summary
- **9 Registered Tools**: `pixasso_discover_intent`, `pixasso_search_references`, `pixasso_fetch_reference`, `pixasso_generate_genome`, `pixasso_generate_brain`, `pixasso_audit_design`, `pixasso_generate_test_plan`, `pixasso_explore_taste`, `pixasso_seed_taste`.
- **Decentralized Swarm Intelligence**: Cloudflare D1 (`pixasso-taste-db`) + KV edge caching (`taste:swarm:bundle`).
- **Living Memory Showcase**: Live on [pixasso.erebuzzz.tech](https://pixasso.erebuzzz.tech) and root README.md.
