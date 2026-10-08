export interface TasteTypography {
  displayFont: string;
  bodyFont: string;
  accentFont?: string;
  modularScaleRatio: number;
  tracking: string;
}

export interface TastePalette {
  primary: string;
  secondary: string;
  surface: string;
  accent: string;
  muted: string;
  border: string;
}

export interface TasteUisfx {
  frequencies: number[];
  oscillator: string;
  gain: number;
  style: string;
}

export interface TasteNode {
  id: string;
  name: string;
  movement: string;
  description: string;
  groundTone: string;
  palette: TastePalette;
  typography: TasteTypography;
  layoutGeometry: string;
  motionSignature: string;
  uisfx: TasteUisfx;
  tags: string[];
  sourceUrl?: string;
  qualityScore?: number;
}

export interface TasteSeed {
  id: string;
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
  uisfxTokens?: TasteUisfx;
  qualityScore: number;
  noveltyScore: number;
  upvotes: number;
  seedHash: string;
  createdAt: string;
}

export interface AestheticWorld {
  name: string;
  movement: string;
  groundTone: string;
  typography: string;
  vibe: string;
  modularScaleRatio: number;
  layoutGeometry: string;
  motionSignature: string;
  uisfx: string;
  palettePreview: string[];
}

export interface TasteDiscoveryResult {
  archetype: string;
  brief: string;
  aestheticWorlds: AestheticWorld[];
  questions: Array<{
    question: string;
    options: string[];
    is_multi_select: boolean;
  }>;
  source: 'dynamic-nemotron' | 'swarm-d1' | 'curated-graph';
}

export interface UserConsentRecord {
  userIdHash: string;
  consented: boolean;
  updatedAt: string;
}
