# Pixasso v1.2.0: Self-Learning Taste Engine, Decentralized Swarm Intelligence & 9 MCP Tools

Pixasso v1.2.0 introduces the autonomous self-learning taste layer, decentralized community token seeding, and multi-provider zero-cost inference routing.

---

### Highlights & Key Additions

#### 1. Self-Learning Taste Engine & Exploration Layer
- **Autonomous Aesthetic Exploration**: Explores unconventional aesthetics beyond static training data, generating tailored design worlds.
- **Zero-Cost Multi-Provider Inference Router**: Tiered fallback pipeline prioritizing NVIDIA NIM (Nemotron 3 Ultra 550B), OpenRouter free models, Cloudflare Workers AI, and 12 foundational offline design movements. Zero API keys required for end users.

#### 2. Decentralized Taste Swarm Intelligence
- **Community-Seeded Design Tokens**: Allows distributed nodes to contribute anonymized design tokens (typography pairings, palettes, layout geometries, motion curves, Web Audio frequencies).
- **Cloudflare D1 & KV Architecture**: Serverless SQL storage in Cloudflare D1 (`pixasso-taste-db`) paired with edge-cached bundle compilation in Cloudflare KV (`taste:swarm:bundle`).
- **Cryptographic Deduping & Quality Scoring**: Autonomous evaluation heuristics filter noise and rank top aesthetic paradigms.
- **Strict Privacy & Consent Gate**: Explicit opt-in modal (`ask_question`) prevents unauthorized contribution.

#### 3. Two New MCP Tools (9 Total)
- **`pixasso_explore_taste`**: Query and filter curated movements and community seeds by keyword, movement name, or frontend archetype.
- **`pixasso_seed_taste`**: Evaluate and seed high-quality design tokens to the decentralized swarm.

#### 4. Living Memory Showcase
- **Daily Autonomous Harvester**: Cloudflare Cron triggers recompile the top aesthetic clusters daily.
- **README & Website Integration**: Automated daily GitHub Action syncs the live topological Mermaid decision map into README.md and the live site at `https://pixasso.erebuzzz.tech`.

#### 5. Developer Experience & Key Ingestion CLI
- **`npm run keys:ingest`**: Secure interactive terminal CLI with masked keystrokes for ingesting optional NVIDIA NIM and OpenRouter keys into local development (`.dev.vars`) and Cloudflare Worker production secrets.
- **100% Protocol Test Coverage**: Verified all 9 tools across stdio JSON-RPC and Streamable HTTP.
