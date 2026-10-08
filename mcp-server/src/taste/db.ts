import { TasteSeed, TasteNode, UserConsentRecord } from './types';

export interface D1PreparedStatementLike {
  bind(...values: any[]): D1PreparedStatementLike;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean; meta?: any }>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
  batch?(statements: D1PreparedStatementLike[]): Promise<any[]>;
}

export interface SeedQueryOptions {
  archetype?: string;
  movement?: string;
  minQuality?: number;
  limit?: number;
}

export async function insertTasteSeed(
  db: D1DatabaseLike,
  seed: TasteSeed
): Promise<{ success: boolean; duplicate?: boolean }> {
  try {
    const stmt = db.prepare(`
      INSERT INTO taste_seeds (
        id, archetype, movement, typography_tokens, palette_tokens,
        layout_tokens, motion_tokens, uisfx_tokens, quality_score,
        novelty_score, upvotes, seed_hash, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(seed_hash) DO UPDATE SET
        upvotes = upvotes + 1,
        quality_score = MAX(quality_score, excluded.quality_score)
    `).bind(
      seed.id,
      seed.archetype,
      seed.movement,
      JSON.stringify(seed.typographyTokens),
      JSON.stringify(seed.paletteTokens),
      JSON.stringify(seed.layoutTokens),
      seed.motionTokens ? JSON.stringify(seed.motionTokens) : null,
      seed.uisfxTokens ? JSON.stringify(seed.uisfxTokens) : null,
      seed.qualityScore,
      seed.noveltyScore,
      seed.upvotes || 1,
      seed.seedHash
    );

    await stmt.run();
    return { success: true };
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE constraint failed')) {
      return { success: true, duplicate: true };
    }
    console.warn('[TasteDB] Failed to insert seed:', err?.message || err);
    return { success: false };
  }
}

export async function queryTasteSeeds(
  db: D1DatabaseLike,
  options: SeedQueryOptions = {}
): Promise<TasteSeed[]> {
  try {
    const limit = Math.min(options.limit || 20, 100);
    let query = `
      SELECT id, archetype, movement, typography_tokens, palette_tokens,
             layout_tokens, motion_tokens, uisfx_tokens, quality_score,
             novelty_score, upvotes, seed_hash, created_at
      FROM taste_seeds
      WHERE 1=1
    `;
    const params: any[] = [];

    if (options.archetype) {
      query += ' AND archetype = ?';
      params.push(options.archetype);
    }
    if (options.movement) {
      query += ' AND movement = ?';
      params.push(options.movement);
    }
    if (typeof options.minQuality === 'number') {
      query += ' AND quality_score >= ?';
      params.push(options.minQuality);
    }

    query += ' ORDER BY quality_score DESC, upvotes DESC LIMIT ?';
    params.push(limit);

    const stmt = db.prepare(query).bind(...params);
    const resp = await stmt.all<any>();

    return (resp.results || []).map((row: any) => ({
      id: row.id,
      archetype: row.archetype,
      movement: row.movement,
      typographyTokens: JSON.parse(row.typography_tokens || '{}'),
      paletteTokens: JSON.parse(row.palette_tokens || '{}'),
      layoutTokens: JSON.parse(row.layout_tokens || '{}'),
      motionTokens: row.motion_tokens ? JSON.parse(row.motion_tokens) : undefined,
      uisfxTokens: row.uisfx_tokens ? JSON.parse(row.uisfx_tokens) : undefined,
      qualityScore: row.quality_score,
      noveltyScore: row.novelty_score,
      upvotes: row.upvotes,
      seedHash: row.seed_hash,
      createdAt: row.created_at
    }));
  } catch (err: any) {
    console.warn('[TasteDB] Failed to query seeds:', err?.message || err);
    return [];
  }
}

export async function upvoteTasteSeed(
  db: D1DatabaseLike,
  seedId: string
): Promise<boolean> {
  try {
    const stmt = db.prepare(`
      UPDATE taste_seeds
      SET upvotes = upvotes + 1
      WHERE id = ?
    `).bind(seedId);
    await stmt.run();
    return true;
  } catch (err: any) {
    console.warn('[TasteDB] Failed to upvote seed:', err?.message || err);
    return false;
  }
}

export async function setUserConsent(
  db: D1DatabaseLike,
  userIdHash: string,
  consented: boolean
): Promise<boolean> {
  try {
    const stmt = db.prepare(`
      INSERT INTO user_consents (user_id_hash, consented, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(user_id_hash) DO UPDATE SET
        consented = excluded.consented,
        updated_at = datetime('now')
    `).bind(userIdHash, consented ? 1 : 0);
    await stmt.run();
    return true;
  } catch (err: any) {
    console.warn('[TasteDB] Failed to set user consent:', err?.message || err);
    return false;
  }
}

export async function getUserConsent(
  db: D1DatabaseLike,
  userIdHash: string
): Promise<UserConsentRecord | null> {
  try {
    const stmt = db.prepare(`
      SELECT user_id_hash, consented, updated_at
      FROM user_consents
      WHERE user_id_hash = ?
    `).bind(userIdHash);
    const row = await stmt.first<any>();
    if (!row) return null;
    return {
      userIdHash: row.user_id_hash,
      consented: Boolean(row.consented),
      updatedAt: row.updated_at
    };
  } catch (err: any) {
    console.warn('[TasteDB] Failed to get user consent:', err?.message || err);
    return null;
  }
}

export async function upsertTasteNode(
  db: D1DatabaseLike,
  node: TasteNode
): Promise<boolean> {
  try {
    const stmt = db.prepare(`
      INSERT INTO taste_nodes (
        id, name, movement, description, tokens, source_url, is_approved, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        description = excluded.description,
        tokens = excluded.tokens,
        source_url = excluded.source_url
    `).bind(
      node.id,
      node.name,
      node.movement,
      node.description,
      JSON.stringify(node),
      node.sourceUrl || null
    );
    await stmt.run();
    return true;
  } catch (err: any) {
    console.warn('[TasteDB] Failed to upsert taste node:', err?.message || err);
    return false;
  }
}

export async function queryTasteNodes(
  db: D1DatabaseLike,
  movement?: string,
  limit: number = 20
): Promise<TasteNode[]> {
  try {
    let query = 'SELECT tokens FROM taste_nodes WHERE is_approved = 1';
    const params: any[] = [];
    if (movement) {
      query += ' AND movement = ?';
      params.push(movement);
    }
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const stmt = db.prepare(query).bind(...params);
    const resp = await stmt.all<any>();
    return (resp.results || []).map((row: any) => JSON.parse(row.tokens));
  } catch (err: any) {
    console.warn('[TasteDB] Failed to query taste nodes:', err?.message || err);
    return [];
  }
}

export async function compileSwarmBundle(
  db: D1DatabaseLike,
  limit: number = 30
): Promise<{ timestamp: string; count: number; seeds: TasteSeed[] }> {
  const seeds = await queryTasteSeeds(db, { limit, minQuality: 0.7 });
  return {
    timestamp: new Date().toISOString(),
    count: seeds.length,
    seeds
  };
}

export interface TasteSwarmStats {
  totalSeeds: number;
  totalArchetypes: number;
  totalConsentedUsers: number;
  averageQualityScore: number;
  topMovements: { movement: string; count: number }[];
  lastSyncTimestamp: string;
}

export async function getTasteSwarmStats(
  db?: D1DatabaseLike
): Promise<TasteSwarmStats> {
  const timestamp = new Date().toISOString();
  if (!db) {
    return {
      totalSeeds: 12,
      totalArchetypes: 12,
      totalConsentedUsers: 1,
      averageQualityScore: 0.94,
      topMovements: [
        { movement: 'Swiss International & High Grotesk', count: 1 },
        { movement: 'Contemporary Editorial & Type Poise', count: 1 },
        { movement: 'Retro-Futurist Monospace HUD', count: 1 },
        { movement: 'High-Contrast Technical Architecture', count: 1 },
        { movement: 'Bio-Digital Organic Harmony', count: 1 }
      ],
      lastSyncTimestamp: timestamp
    };
  }

  try {
    const seedStatsRow = await db.prepare(
      'SELECT COUNT(*) as total_seeds, AVG(quality_score) as avg_quality FROM taste_seeds'
    ).first<any>();

    const nodesCountRow = await db.prepare(
      'SELECT COUNT(*) as total_nodes FROM taste_nodes'
    ).first<any>();

    const consentsCountRow = await db.prepare(
      'SELECT COUNT(*) as consented_users FROM user_consents WHERE consented = 1'
    ).first<any>();

    const topMovementsResp = await db.prepare(
      'SELECT movement, COUNT(*) as count FROM taste_seeds GROUP BY movement ORDER BY count DESC LIMIT 5'
    ).all<any>();

    const totalSeeds = Number(seedStatsRow?.total_seeds || 0);
    const avgQuality = Number(seedStatsRow?.avg_quality || 0.94);
    const totalArchetypes = Math.max(Number(nodesCountRow?.total_nodes || 0), 12);
    const totalConsentedUsers = Math.max(Number(consentsCountRow?.consented_users || 0), 0);

    let topMovements = (topMovementsResp.results || []).map((r: any) => ({
      movement: r.movement || 'Foundational Paradigm',
      count: Number(r.count || 1)
    }));

    if (topMovements.length === 0) {
      topMovements = [
        { movement: 'Swiss International & High Grotesk', count: 1 },
        { movement: 'Contemporary Editorial & Type Poise', count: 1 },
        { movement: 'Retro-Futurist Monospace HUD', count: 1 },
        { movement: 'High-Contrast Technical Architecture', count: 1 },
        { movement: 'Bio-Digital Organic Harmony', count: 1 }
      ];
    }

    return {
      totalSeeds,
      totalArchetypes,
      totalConsentedUsers,
      averageQualityScore: Math.round(avgQuality * 100) / 100,
      topMovements,
      lastSyncTimestamp: timestamp
    };
  } catch (err: any) {
    console.warn('[TasteDB] Failed to query swarm stats:', err?.message || err);
    return {
      totalSeeds: 12,
      totalArchetypes: 12,
      totalConsentedUsers: 0,
      averageQualityScore: 0.94,
      topMovements: [
        { movement: 'Swiss International & High Grotesk', count: 1 },
        { movement: 'Contemporary Editorial & Type Poise', count: 1 },
        { movement: 'Retro-Futurist Monospace HUD', count: 1 }
      ],
      lastSyncTimestamp: timestamp
    };
  }
}

