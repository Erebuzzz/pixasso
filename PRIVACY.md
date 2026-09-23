# Privacy Policy for Pixasso MCP

Last updated: September 23, 2026

Pixasso is an open-source frontend engineering and design system orchestrator distributed as a local Model Context Protocol (MCP) server, an Antigravity plugin, and a hosted remote MCP worker.

This Privacy Policy explains how Pixasso handles data across all deployment modes: local stdio execution, remote HTTP deployment on Cloudflare Workers, and static documentation hosting.

## Summary of Core Principles

- Zero Data Collection: Pixasso does not collect, record, or monetize user data.
- No Prompt Logging or Telemetry: Prompts, project briefs, design genomes, code snippets, and audit targets are processed purely in-memory and are never logged to external servers or databases.
- Transparent Network Calls: Pixasso makes outbound network requests only when explicitly instructed by the user (such as fetching a reference website via `pixasso_fetch_reference`).
- Minimal Authentication Footprint: For the remote HTTP endpoint, GitHub OAuth is used solely to identify the user for enforcing the daily rate limit of 200 tool calls per user.

---

## 1. Information Handled by Deployment Mode

### A. Local Stdio Mode (`npx pixasso-mcp`)
When run locally via stdio in Claude Desktop, Cursor, Antigravity, or other MCP clients:
- Execution Boundary: All tool execution, parsing, design genome compilation, and anti-pattern auditing happen entirely on your local machine.
- Outbound Network Calls: The only outbound network call occurs if you invoke `pixasso_fetch_reference`, which issues an HTTP request to the exact target URL specified in the tool arguments. Fetched content is cached in volatile memory for the lifetime of that session and is discarded when the server process exits.
- No Phone-Home Telemetry: The local npm package contains zero tracking beacons, analytics scripts, crash reporters, or external telemetry pings.

### B. Remote HTTP Worker Mode (`https://mcp.pixasso.erebuzzz.tech/mcp`)
When accessed via the remote Cloudflare Worker:
- In-Memory Tool Processing: All tool logic runs transiently within an isolated Cloudflare Durable Object (`PixassoMcpAgent`). Inputs and outputs are discarded once the JSON-RPC response is delivered.
- Authentication & Identity: When authenticating via GitHub OAuth, Pixasso receives a scoped authorization token to verify your GitHub user ID. Pixasso does not request access to your private repositories, organizations, or personal emails.
- Rate Limiting Storage: To prevent abuse and guarantee fair access, Pixasso records a daily call count associated with an anonymized hash of your GitHub ID in Cloudflare KV (`pixasso-oauth-kv`). Each counter is automatically purged at midnight UTC.
- Session Cookies: Authentication state is stored in an HTTP-only, Secure cookie encrypted with AES-256 (`COOKIE_ENCRYPTION_KEY`). These cookies contain only session identity and expire after 7 days.

### C. Static Showcase Site (`https://pixasso.erebuzzz.tech`)
- Hosted on Cloudflare Pages and GitHub Pages.
- No tracking cookies, advertising pixels, or third-party marketing trackers are loaded.
- Web fonts and icons are either bundled locally or loaded from standard public CDNs without user-tracking identifiers.

---

## 2. Tool-Specific Data Practices

| Tool Name | Data Processed | Network Activity | Persistence |
| :--- | :--- | :--- | :--- |
| `pixasso_discover_intent` | Project archetype, brief text | None | In-memory only (ephemeral) |
| `pixasso_search_references` | Search query keywords, category | None | In-memory only (ephemeral) |
| `pixasso_fetch_reference` | Target website URL | HTTP GET to target URL | Session cache only |
| `pixasso_generate_genome` | Color tokens, typography, tech stack | None | In-memory only (ephemeral) |
| `pixasso_generate_brain` | Design decisions, task list | None | In-memory only (ephemeral) |
| `pixasso_audit_design` | HTML/JSX/CSS code snippets | None | In-memory only (ephemeral) |
| `pixasso_generate_test_plan` | Project name, viewport widths | None | In-memory only (ephemeral) |

---

## 3. Third-Party Services & Dependencies

Pixasso uses open-source libraries and verified infrastructure:
- Cloudflare Workers & Durable Objects: Runs the remote OAuth and MCP agent endpoints under Cloudflare privacy standards.
- GitHub OAuth: Validates identity for rate-limiting purposes.
- NPM Registry: Distributes the official signed package (`pixasso-mcp`) with Sigstore provenance.

Pixasso does not share, rent, or sell any data to third parties, AI model trainers, or advertising brokers.

---

## 4. User Rights and Data Deletion

Because Pixasso stores no personal profiles or saved project data, there is no persistent user data store to modify or delete. Daily rate-limiting records in Cloudflare KV are transient and expire automatically every 24 hours.

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

---

## 6. Contact and Inquiries

For questions regarding this Privacy Policy, security reports, or open-source compliance:
- Repository: [https://github.com/Erebuzzz/pixasso](https://github.com/Erebuzzz/pixasso)
- Issues & Inquiries: [https://github.com/Erebuzzz/pixasso/issues](https://github.com/Erebuzzz/pixasso/issues)
- Maintainer: Erebuzzz
