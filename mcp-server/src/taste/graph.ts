import * as fs from 'fs';
import * as path from 'path';
import { TasteNode, TasteSeed } from './types';

export const FOUNDATIONAL_TASTE_NODES: TasteNode[] = [
  {
    id: 'swiss-international',
    name: 'Swiss International Typographic',
    movement: 'International Typographic Style',
    description: 'Mathematical grid discipline, ultra-tight tracking, zero shadows, razor-sharp 1px hairlines.',
    groundTone: '#ffffff stark white with #000000 solid ink',
    palette: {
      primary: '#000000',
      secondary: '#333333',
      surface: '#ffffff',
      accent: '#e11d48',
      muted: '#737373',
      border: '#e5e5e5'
    },
    typography: {
      displayFont: 'Syne',
      bodyFont: 'Inter',
      accentFont: 'Space Mono',
      modularScaleRatio: 1.414,
      tracking: '-0.03em'
    },
    layoutGeometry: 'Rigid 12-column modular grid with asymmetric column spans',
    motionSignature: 'Snappy 150ms linear transitions with instant tactile feedback',
    uisfx: {
      frequencies: [1200],
      oscillator: 'triangle',
      gain: 0.05,
      style: 'mechanical-click'
    },
    tags: ['swiss', 'minimalism', 'grid', 'editorial', 'precision']
  },
  {
    id: 'warm-editorial',
    name: 'Warm Literary Parchment',
    movement: 'Contemporary Editorial & Type Poise',
    description: 'Literary dignity, wide margin proportions, mathematical hairlines, and figure captions.',
    groundTone: '#fbfaf7 ivory paper with warm charcoal ink',
    palette: {
      primary: '#191919',
      secondary: '#575752',
      surface: '#ffffff',
      accent: '#15803d',
      muted: '#8c8c82',
      border: 'rgba(25, 25, 25, 0.12)'
    },
    typography: {
      displayFont: 'Newsreader',
      bodyFont: 'Newsreader',
      accentFont: 'JetBrains Mono',
      modularScaleRatio: 1.333,
      tracking: '-0.01em'
    },
    layoutGeometry: 'Split-screen editorial with wide margins and floating quote callouts',
    motionSignature: 'Graceful ease-out transitions and gentle page-turn opacity fades',
    uisfx: {
      frequencies: [440],
      oscillator: 'sine',
      gain: 0.04,
      style: 'soft-paper'
    },
    tags: ['editorial', 'serif', 'literary', 'warm', 'stripe-press']
  },
  {
    id: 'obsidian-precision',
    name: 'Obsidian Architectural Slate',
    movement: 'Deep Obsidian Precision',
    description: 'Architectural restraint, razor-sharp 1px borders, cold cobalt luminescence, and dense telemetry.',
    groundTone: '#0a0f12 deep basalt slate',
    palette: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      surface: '#111827',
      accent: '#3b82f6',
      muted: '#64748b',
      border: 'rgba(255, 255, 255, 0.1)'
    },
    typography: {
      displayFont: 'Space Grotesk',
      bodyFont: 'Inter',
      accentFont: 'JetBrains Mono',
      modularScaleRatio: 1.25,
      tracking: '-0.02em'
    },
    layoutGeometry: 'Bento modular grid with real-time telemetry panels',
    motionSignature: 'Magnetic cursor tracking with spring physics damping',
    uisfx: {
      frequencies: [880],
      oscillator: 'sine',
      gain: 0.04,
      style: 'clean-chime'
    },
    tags: ['dark-mode', 'bento', 'precision', 'developer-tool', 'fintech']
  },
  {
    id: 'crt-phosphor',
    name: 'Phosphor Telemetry Terminal',
    movement: 'Retro-Futurist Monospace HUD',
    description: 'Cathode-ray dark canvas, emerald raster glow, scanline overlays, telemetry HUDs, bracket hotkeys.',
    groundTone: '#080b09 cathode-ray dark',
    palette: {
      primary: '#33ff66',
      secondary: '#22c55e',
      surface: '#0d130f',
      accent: '#4ade80',
      muted: '#14532d',
      border: 'rgba(51, 255, 102, 0.25)'
    },
    typography: {
      displayFont: 'JetBrains Mono',
      bodyFont: 'JetBrains Mono',
      accentFont: 'Space Mono',
      modularScaleRatio: 1.2,
      tracking: '0.02em'
    },
    layoutGeometry: 'Multi-pane telemetry bento grid with fixed-width data columns',
    motionSignature: 'Instant cursor flicker and scanline drift animations',
    uisfx: {
      frequencies: [880, 15000],
      oscillator: 'sawtooth',
      gain: 0.03,
      style: 'crt-relay'
    },
    tags: ['terminal', 'hud', 'retro', 'cyberpunk', 'phosphor']
  },
  {
    id: 'pitch-amoled',
    name: 'Pure Pitch AMOLED',
    movement: 'Zero-Emission AMOLED Minimalism',
    description: 'Pure black canvas, high-contrast white typographic statements, electric cyan laser points.',
    groundTone: '#000000 true pitch black',
    palette: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      surface: '#09090b',
      accent: '#00f2fe',
      muted: '#52525b',
      border: 'rgba(255, 255, 255, 0.14)'
    },
    typography: {
      displayFont: 'Syne',
      bodyFont: 'Inter',
      accentFont: 'JetBrains Mono',
      modularScaleRatio: 1.333,
      tracking: '-0.025em'
    },
    layoutGeometry: 'Fluid full-bleed viewport with borderless card transitions',
    motionSignature: 'Zero-latency instant state toggle with smooth opacity crossfades',
    uisfx: {
      frequencies: [180],
      oscillator: 'sine',
      gain: 0.06,
      style: 'haptic-pop'
    },
    tags: ['amoled', 'pitch-black', 'minimal', 'high-contrast']
  },
  {
    id: 'solarpunk-organic',
    name: 'Solarpunk Bio-Digital',
    movement: 'Bio-Digital Organic Harmony',
    description: 'Warm earthen stone, lush botanical moss accents, terracotta highlights, fluid contours.',
    groundTone: '#f4f3ef warm bone stone',
    palette: {
      primary: '#1c2d20',
      secondary: '#3f5743',
      surface: '#ffffff',
      accent: '#d97706',
      muted: '#788c7d',
      border: 'rgba(28, 45, 32, 0.15)'
    },
    typography: {
      displayFont: 'Syne',
      bodyFont: 'Plus Jakarta Sans',
      accentFont: 'Space Mono',
      modularScaleRatio: 1.25,
      tracking: '-0.015em'
    },
    layoutGeometry: 'Fluid organic bento layout with asymmetric pill badges',
    motionSignature: 'Organic fluid spring transitions with subtle drift',
    uisfx: {
      frequencies: [720],
      oscillator: 'sine',
      gain: 0.04,
      style: 'resonant-bell'
    },
    tags: ['solarpunk', 'organic', 'nature', 'sustainable', 'earth']
  },
  {
    id: 'industrial-brutalism',
    name: 'Heavy Industrial Brutalism',
    movement: 'Neo-Brutalism & Structural Honesty',
    description: 'Raw concrete tonalities, bold high-gauge borders, stark typography, functional exposed seams.',
    groundTone: '#e5e5e5 raw concrete grey',
    palette: {
      primary: '#000000',
      secondary: '#262626',
      surface: '#f5f5f5',
      accent: '#ea580c',
      muted: '#737373',
      border: '#000000'
    },
    typography: {
      displayFont: 'Space Grotesk',
      bodyFont: 'Inter',
      accentFont: 'Space Mono',
      modularScaleRatio: 1.414,
      tracking: '-0.02em'
    },
    layoutGeometry: 'High-contrast block cards with heavy 2px-3px solid borders',
    motionSignature: 'Instant hard-cut hover states with zero blur drop shadows',
    uisfx: {
      frequencies: [220],
      oscillator: 'square',
      gain: 0.04,
      style: 'heavy-thud'
    },
    tags: ['brutalism', 'industrial', 'bold', 'concrete', 'monochrome']
  },
  {
    id: 'japanese-mono',
    name: 'Tokyo Cyber-Monochrome',
    movement: 'Japanese Micro-Minimalism',
    description: 'Deep midnight obsidian, vertical typographic anchors, subtle silver hairlines, serene negative space.',
    groundTone: '#0d0f12 midnight ink',
    palette: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      surface: '#151921',
      accent: '#f43f5e',
      muted: '#475569',
      border: 'rgba(255, 255, 255, 0.08)'
    },
    typography: {
      displayFont: 'Syne',
      bodyFont: 'Inter',
      accentFont: 'JetBrains Mono',
      modularScaleRatio: 1.333,
      tracking: '-0.02em'
    },
    layoutGeometry: 'Asymmetrical canvas with deep negative space and vertical metadata bands',
    motionSignature: 'Whisper-quiet opacity transitions with subtle float drifts',
    uisfx: {
      frequencies: [1080],
      oscillator: 'sine',
      gain: 0.03,
      style: 'zen-chime'
    },
    tags: ['japanese', 'zen', 'monochrome', 'tokyo', 'minimal']
  },
  {
    id: 'spatial-glass',
    name: 'Spatial Depth Realism',
    movement: 'Spatial Computing & Physical Glass',
    description: 'Deep obsidian ground, physical glass refraction, realistic specular highlights, 2.5D elevation.',
    groundTone: '#07090e deep spatial space',
    palette: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      surface: 'rgba(255, 255, 255, 0.05)',
      accent: '#6366f1',
      muted: '#64748b',
      border: 'rgba(255, 255, 255, 0.15)'
    },
    typography: {
      displayFont: 'Syne',
      bodyFont: 'Inter',
      accentFont: 'Space Mono',
      modularScaleRatio: 1.25,
      tracking: '-0.02em'
    },
    layoutGeometry: 'Perspective-layered card stack with floating glass controls',
    motionSignature: 'Inertial gyroscope and cursor tilt with dynamic specular reflection',
    uisfx: {
      frequencies: [540, 1080],
      oscillator: 'sine',
      gain: 0.04,
      style: 'glass-tap'
    },
    tags: ['spatial', 'glass', 'depth', 'visionos', 'threejs']
  },
  {
    id: 'kinetic-acid',
    name: 'Y2K Kinetic Acid',
    movement: 'Y2K Acid Glitch & Neo-Ravers',
    description: 'Dark carbon base with radioactive neon lime, ultra-wide stretched display headers, marquee tapes.',
    groundTone: '#090a0f dark carbon',
    palette: {
      primary: '#ffffff',
      secondary: '#a3a3a3',
      surface: '#12141c',
      accent: '#ccff00',
      muted: '#525252',
      border: 'rgba(204, 255, 0, 0.25)'
    },
    typography: {
      displayFont: 'Syne',
      bodyFont: 'Space Grotesk',
      accentFont: 'Space Mono',
      modularScaleRatio: 1.5,
      tracking: '-0.03em'
    },
    layoutGeometry: 'Dynamic marquee tape breaks with tilted sticker pill cards',
    motionSignature: 'Kinetic elastic spring bounces with continuous marquee ribbons',
    uisfx: {
      frequencies: [440],
      oscillator: 'sawtooth',
      gain: 0.05,
      style: 'acid-blip'
    },
    tags: ['y2k', 'acid', 'kinetic', 'music', 'neon']
  },
  {
    id: 'hyper-luxury',
    name: 'Haute Horlogerie & Serenity',
    movement: 'High-Fashion Editorial Luxury',
    description: 'Velvet midnight ground, Cormorant Garamond italics, gold foil hairlines, generous breathing room.',
    groundTone: '#0b0b0d velvet midnight',
    palette: {
      primary: '#f5f5f4',
      secondary: '#a8a29e',
      surface: '#141417',
      accent: '#d4af37',
      muted: '#57534e',
      border: 'rgba(212, 175, 55, 0.2)'
    },
    typography: {
      displayFont: 'Newsreader',
      bodyFont: 'Inter',
      accentFont: 'Space Mono',
      modularScaleRatio: 1.414,
      tracking: '0.01em'
    },
    layoutGeometry: 'Monumental centred hero showcase with generous horizontal margins',
    motionSignature: 'Ultra-slow cinematic 600ms ease-in-out reveal transitions',
    uisfx: {
      frequencies: [920],
      oscillator: 'sine',
      gain: 0.03,
      style: 'crystal-chime'
    },
    tags: ['luxury', 'fashion', 'elegance', 'serif', 'gold']
  },
  {
    id: 'generative-math',
    name: 'Algorithmic Waveform Grid',
    movement: 'Computational Generative Art',
    description: 'Coordinate matrix background, harmonic Fourier wave paths, numeric parameter telemetry.',
    groundTone: '#0e1117 algorithmic slate',
    palette: {
      primary: '#e6edf3',
      secondary: '#8b949e',
      surface: '#161b22',
      accent: '#58a6ff',
      muted: '#484f58',
      border: 'rgba(240, 246, 252, 0.12)'
    },
    typography: {
      displayFont: 'JetBrains Mono',
      bodyFont: 'Inter',
      accentFont: 'Space Mono',
      modularScaleRatio: 1.2,
      tracking: '0.01em'
    },
    layoutGeometry: 'Parametric canvas with live mathematical oscillator sliders',
    motionSignature: 'Real-time 60fps canvas wave harmonics and live slider telemetry',
    uisfx: {
      frequencies: [660],
      oscillator: 'triangle',
      gain: 0.04,
      style: 'fourier-tone'
    },
    tags: ['generative', 'math', 'wave', 'canvas', 'creative-code']
  }
];

export function getLocalTasteGraph(): TasteNode[] {
  try {
    const localFile = path.join(__dirname, '..', 'data', 'taste-graph.json');
    if (fs.existsSync(localFile)) {
      const data = JSON.parse(fs.readFileSync(localFile, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fall back to foundational nodes
  }
  return FOUNDATIONAL_TASTE_NODES;
}

export function saveLocalTasteGraph(nodes: TasteNode[]): void {
  try {
    const localFile = path.join(__dirname, '..', 'data', 'taste-graph.json');
    fs.writeFileSync(localFile, JSON.stringify(nodes, null, 2), 'utf8');
  } catch (err: any) {
    console.warn('[TasteGraph] Could not write local taste graph file:', err.message);
  }
}

export class TasteGraph {
  private nodes: Map<string, TasteNode> = new Map();
  private seeds: TasteSeed[] = [];

  constructor() {
    for (const node of FOUNDATIONAL_TASTE_NODES) {
      this.nodes.set(node.id, node);
    }
    const loaded = getLocalTasteGraph();
    for (const node of loaded) {
      this.nodes.set(node.id, node);
    }
  }

  getAllNodes(): TasteNode[] {
    return Array.from(this.nodes.values());
  }

  search(query?: string, movement?: string): TasteNode[] {
    let list = this.getAllNodes();
    if (movement) {
      const m = movement.toLowerCase().trim();
      list = list.filter(n => n.movement.toLowerCase().includes(m) || n.name.toLowerCase().includes(m));
    }
    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(n =>
        n.name.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.movement.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }

  addNode(node: TasteNode): void {
    this.nodes.set(node.id, node);
  }

  addSeed(seed: TasteSeed): void {
    const existingIndex = this.seeds.findIndex(s => s.seedHash === seed.seedHash);
    if (existingIndex >= 0) {
      this.seeds[existingIndex].upvotes = (this.seeds[existingIndex].upvotes || 1) + 1;
    } else {
      this.seeds.push(seed);
    }
  }

  getSeeds(archetype?: string, movement?: string, limit: number = 10): TasteSeed[] {
    let list = [...this.seeds];
    if (archetype) {
      const a = archetype.toLowerCase().trim();
      list = list.filter(s => s.archetype.toLowerCase().includes(a));
    }
    if (movement) {
      const m = movement.toLowerCase().trim();
      list = list.filter(s => s.movement.toLowerCase().includes(m));
    }
    list.sort((a, b) => b.qualityScore - a.qualityScore);
    return list.slice(0, limit);
  }
}

let globalTasteGraph: TasteGraph | null = null;

export function getTasteGraph(): TasteGraph {
  if (!globalTasteGraph) {
    globalTasteGraph = new TasteGraph();
  }
  return globalTasteGraph;
}
