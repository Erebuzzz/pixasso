-- Cloudflare D1 Schema for Pixasso Taste Swarm & Self-Learning Engine

CREATE TABLE IF NOT EXISTS taste_seeds (
  id TEXT PRIMARY KEY,
  archetype TEXT NOT NULL,
  movement TEXT NOT NULL,
  typography_tokens TEXT NOT NULL,
  palette_tokens TEXT NOT NULL,
  layout_tokens TEXT NOT NULL,
  motion_tokens TEXT,
  uisfx_tokens TEXT,
  quality_score REAL DEFAULT 0.8,
  novelty_score REAL DEFAULT 0.5,
  upvotes INTEGER DEFAULT 1,
  seed_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS taste_nodes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  movement TEXT NOT NULL,
  description TEXT NOT NULL,
  tokens TEXT NOT NULL,
  source_url TEXT,
  is_approved BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_consents (
  user_id_hash TEXT PRIMARY KEY,
  consented BOOLEAN NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_taste_seeds_archetype ON taste_seeds(archetype);
CREATE INDEX IF NOT EXISTS idx_taste_seeds_movement ON taste_seeds(movement);
CREATE INDEX IF NOT EXISTS idx_taste_seeds_quality ON taste_seeds(quality_score);
CREATE INDEX IF NOT EXISTS idx_taste_nodes_movement ON taste_nodes(movement);
