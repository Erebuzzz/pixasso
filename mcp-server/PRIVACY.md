# Privacy Policy for Pixasso MCP

Last updated: October 8, 2026

Pixasso is an open-source frontend engineering and design system orchestrator distributed as a local Model Context Protocol (MCP) server, an Antigravity plugin, and a hosted remote MCP worker.

This Privacy Policy explains how Pixasso handles data across all deployment modes: local stdio execution, remote HTTP deployment on Cloudflare Workers, static documentation hosting, and the Self-Learning Taste Exploration & Swarm Intelligence layer.

## Summary of Core Principles

- Zero User Cost Guaranteed: All exploration features use free AI tiers (NVIDIA NIM Nemotron 3 Ultra, OpenRouter free models, Cloudflare Workers AI) and deterministic offline fallbacks.
- Strict Opt-In Swarm Intelligence: Community taste seeding is strictly opt-in. By default, zero design tokens or metadata leave your local environment.
- No Sensitive Data Collection: Swarm seeds contain only sanitized visual design tokens (font pairings, color values, layout geometry ratios). Proprietary project source code, file contents, credentials, API keys, and personal identifiers are strictly excluded.
- Transparent Network Calls: Pixasso makes outbound network requests only when explicitly instructed by the user or when authorized for swarm seeding.
- Cryptographic Anonymization: User identifiers are irreversibly hashed using salted SHA-256 before any swarm interaction.
- In-Memory Ephemeral Processing: By default, tool execution and genome formulation run purely in volatile memory.

---

## 1. Information Handled by Deployment Mode

### A. Local Stdio Mode (`npx pixasso-mcp`)
When run locally via stdio in Claude Desktop, Cursor, Antigravity, or other MCP clients:
- Execution Boundary: All tool execution, parsing, design genome compilation, and anti-pattern auditing happen entirely on your local machine.
- Local Storage: Configuration settings and local consent preferences are stored in `.pixassorc.json` within your working directory.
- Outbound Network Calls: Outbound calls only occur when:
  1. Invoking `pixasso_fetch_reference`, which issues an HTTP request to the exact target URL specified in the tool arguments. Fetched content is cached in volatile memory for the session duration.
  2. Invoking `pixasso_seed_taste` when explicit opt-in consent is granted.
- No Phone-Home Telemetry: The local npm package contains zero tracking beacons, analytics scripts, crash reporters, or background telemetry pings.

### B. Remote HTTP Worker Mode (`https://mcp.pixasso.erebuzzz.tech/mcp`)
When accessed via the remote Cloudflare Worker:
- In-Memory Tool Processing: All tool logic runs transiently within an isolated Cloudflare Durable Object (`PixassoMcpAgent`). Inputs and outputs are discarded once the JSON-RPC response is delivered.
- Authentication & Identity: When authenticating via GitHub OAuth, Pixasso receives a scoped authorization token to verify your GitHub user ID. Pixasso does not request access to your private repositories, organizations, or personal emails.
- Rate Limiting Storage: To prevent abuse and guarantee fair access, Pixasso records a daily call count associated with an anonymized hash of your GitHub ID in Cloudflare KV (`pixasso-oauth-kv`). Each counter is automatically purged at midnight UTC.
- Session Cookies: Authentication state is stored in an HTTP-only, Secure cookie encrypted with AES-256 (`COOKIE_ENCRYPTION_KEY`). These cookies contain only session identity and expire after 7 days.

### C. Self-Learning Taste Exploration & Swarm Intelligence Layer
Pixasso includes a decentralized self-learning exploration layer powered by zero-cost LLM inference and a federated taste swarm modeled after peer-to-peer distribution:
- Mandatory Opt-In Gate: Swarm seeding is strictly disabled by default. During intent discovery (`pixasso_discover_intent`), users are prompted with an interactive question to choose between keeping design tokens strictly private or contributing anonymized tokens to the global design brain.
- Token Sanitization: Only non-proprietary visual design parameters are eligible for swarm ingestion:
  - Typography pairings (display and body font names, modular scale ratios, tracking values)
  - Color palette tokens (primary, surface, accent, muted hex codes)
  - Layout geometry types (grid columns, bento structure, aspect ratio)
  - Motion parameters (physics curves, duration in milliseconds, cubic-bezier easing)
  - Sensory audio parameters (oscillator frequency, wave type, gain)
- Excluded Data: Project code, repository paths, variable names, text copy, user emails, IP addresses, and authentication tokens are strictly stripped and never transmitted.
- Cloudflare D1 Relational Storage (`pixasso-taste-db`): Anonymized seeds are deduplicated via cryptographic SHA-256 token hashes, scored for aesthetic quality and contrast, and stored in serverless Cloudflare D1 database tables (`taste_seeds`, `taste_nodes`, `user_consents`).
- Cloudflare KV Caching: Compiled taste bundles (`taste:swarm:bundle`) are edge-cached for high-speed retrieval across global nodes.
- Local Consent Override: You can configure or revoke consent at any time by editing `.pixassorc.json` with `{"swarmOptIn": false}` or setting the environment variable `PIXASSO_SWARM_OPT_IN=false`.

### D. Static Showcase Site (`https://pixasso.erebuzzz.tech`)
- Hosted on Cloudflare Pages and GitHub Pages.
- No tracking cookies, advertising pixels, or third-party marketing trackers are loaded.
- Web fonts and icons are either bundled locally or loaded from standard public CDNs without user-tracking identifiers.

---

## 2. Tool-Specific Data Practices

| Tool Name | Data Processed | Network Activity | Persistence |
| :--- | :--- | :--- | :--- |
| `pixasso_discover_intent` | Project archetype, brief text | LLM inference router (NVIDIA NIM / Workers AI / offline fallback) | In-memory only (ephemeral) |
| `pixasso_search_references` | Search query keywords, category | None | In-memory only (ephemeral) |
| `pixasso_fetch_reference` | Target website URL | HTTP GET to target URL | Session cache only |
| `pixasso_generate_genome` | Color tokens, typography, tech stack | None | In-memory only (ephemeral) |
| `pixasso_generate_brain` | Design decisions, task list | None | In-memory only (ephemeral) |
| `pixasso_audit_design` | HTML/JSX/CSS code snippets | None | In-memory only (ephemeral) |
| `pixasso_generate_test_plan` | Project name, viewport widths | None | In-memory only (ephemeral) |
| `pixasso_explore_taste` | Aesthetic queries, movement filters | D1 database / KV cache query | In-memory only (ephemeral) |
| `pixasso_seed_taste` | Sanitized visual design tokens | D1 database insertion (opt-in only) | Cloudflare D1 & KV (if consented) |

---

## 3. Third-Party Services & Dependencies

Pixasso uses open-source libraries and verified infrastructure:
- Cloudflare Workers, Durable Objects, KV, and D1: Executes remote MCP tools, enforces rate limits, and persists anonymized taste graph seeds.
- NVIDIA NIM & OpenRouter Free Tier: Provides zero-cost LLM inference for creative aesthetic world synthesis.
- GitHub OAuth: Validates identity for daily rate-limiting purposes.
- NPM Registry: Distributes the official signed package (`pixasso-mcp`) with Sigstore provenance.

Pixasso does not share, rent, or sell any data to third parties, data brokers, or advertising networks.

---

## 4. User Rights and Data Deletion

Because Pixasso stores no personal profiles or proprietary project code, there is no personal data store to modify or delete. Daily rate-limiting records in Cloudflare KV expire automatically every 24 hours.

If you have previously consented to taste swarm seeding and wish to reset your local preferences:
1. Delete or update the `.pixassorc.json` file in your project directory.
2. Set `PIXASSO_SWARM_OPT_IN=false` in your environment.

If you wish to revoke GitHub OAuth authorization at any time:
1. Navigate to your GitHub account Settings.
2. Select Applications > Authorized OAuth Apps.
3. Locate Pixasso and click Revoke.

---

## 5. Security Practices

- Cryptographic Provenance: All npm package releases are published using cryptographic Sigstore keyless signatures.
- Cookie Encryption: Session cookies in the remote worker are sealed with AES-256 encryption.
- Dependency Hardening: Production dependencies are audited and kept to minimal vetted packages.
- Memory Isolation: Every session runs within isolated sandbox memory boundaries.
- Cryptographic Token Hashes: Design seeds are deduplicated and indexed using SHA-256 token digests.

---

## 6. Contact and Inquiries

For questions regarding this Privacy Policy, security reports, or open-source compliance:
- Repository: [https://github.com/Erebuzzz/pixasso](https://github.com/Erebuzzz/pixasso)
- Issues & Inquiries: [https://github.com/Erebuzzz/pixasso/issues](https://github.com/Erebuzzz/pixasso/issues)
- Maintainer: Erebuzzz
