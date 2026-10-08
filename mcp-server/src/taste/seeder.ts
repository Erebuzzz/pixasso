import * as crypto from 'crypto';
import { TasteSeed, TastePalette, TasteTypography } from './types';
import { D1DatabaseLike, insertTasteSeed } from './db';
import { getTasteGraph } from './graph';

export interface IngestSeedInput {
  archetype: string;
  movement: string;
  typographyTokens: TasteTypography;
  paletteTokens: TastePalette;
  layoutTokens: {
    geometryType: string;
    gridColumns?: number;
    bentoLayout?: boolean;
    aspectRatio?: string;
  };
  motionTokens?: {
    physics: string;
    durationMs: number;
    easing: string;
  };
  uisfxTokens?: {
    frequencies: number[];
    oscillator: string;
    gain: number;
    style: string;
  };
}

export function computeSeedHash(input: IngestSeedInput): string {
  const norm = [
    (input.archetype || '').trim().toLowerCase(),
    (input.movement || '').trim().toLowerCase(),
    (input.typographyTokens.displayFont || '').trim().toLowerCase(),
    (input.typographyTokens.bodyFont || '').trim().toLowerCase(),
    (input.paletteTokens.primary || '').trim().toLowerCase(),
    (input.paletteTokens.surface || '').trim().toLowerCase(),
    (input.layoutTokens.geometryType || '').trim().toLowerCase()
  ].join('|');

  return crypto.createHash('sha256').update(norm).digest('hex').substring(0, 32);
}

function parseHexColor(hex: string): [number, number, number] {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  if (c.length !== 6) return [128, 128, 128];
  return [
    parseInt(c.substring(0, 2), 16) || 0,
    parseInt(c.substring(2, 4), 16) || 0,
    parseInt(c.substring(4, 6), 16) || 0
  ];
}

function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function calculateContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(parseHexColor(hex1));
  const lum2 = getRelativeLuminance(parseHexColor(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function evaluateTasteSeedQuality(input: IngestSeedInput): {
  qualityScore: number;
  noveltyScore: number;
} {
  let quality = 0.8;
  let novelty = 0.6;

  // Check contrast between primary text/accent and surface
  const contrast = calculateContrastRatio(input.paletteTokens.primary, input.paletteTokens.surface);
  if (contrast >= 7.0) {
    quality += 0.1;
  } else if (contrast < 4.5) {
    quality -= 0.2;
  }

  // Evaluate typography pairing
  const display = (input.typographyTokens.displayFont || '').toLowerCase();
  const body = (input.typographyTokens.bodyFont || '').toLowerCase();
  if (display === body && display.includes('inter')) {
    novelty -= 0.3; // generic AI trope penalty
  } else if (display !== body && (display.includes('serif') || display.includes('mono') || display.includes('display'))) {
    novelty += 0.2;
  }

  // Evaluate movement and layout richness
  if (input.layoutTokens.bentoLayout) {
    quality += 0.05;
  }
  if (input.motionTokens && input.motionTokens.easing.includes('cubic-bezier')) {
    quality += 0.05;
  }

  quality = Math.max(0.1, Math.min(1.0, Math.round(quality * 100) / 100));
  novelty = Math.max(0.1, Math.min(1.0, Math.round(novelty * 100) / 100));

  return { qualityScore: quality, noveltyScore: novelty };
}

export async function processTasteSeed(
  input: IngestSeedInput,
  db?: D1DatabaseLike
): Promise<{ seed: TasteSeed; savedToD1: boolean; savedToMemory: boolean }> {
  const hash = computeSeedHash(input);
  const { qualityScore, noveltyScore } = evaluateTasteSeedQuality(input);

  const seed: TasteSeed = {
    id: 'seed-' + hash.substring(0, 12),
    archetype: input.archetype,
    movement: input.movement,
    typographyTokens: input.typographyTokens,
    paletteTokens: input.paletteTokens,
    layoutTokens: input.layoutTokens,
    motionTokens: input.motionTokens,
    uisfxTokens: input.uisfxTokens,
    qualityScore,
    noveltyScore,
    upvotes: 1,
    seedHash: hash,
    createdAt: new Date().toISOString()
  };

  let savedToD1 = false;
  if (db) {
    const res = await insertTasteSeed(db, seed);
    savedToD1 = res.success;
  }

  // Update in-memory graph
  const graph = getTasteGraph();
  graph.addSeed(seed);

  return {
    seed,
    savedToD1,
    savedToMemory: true
  };
}
