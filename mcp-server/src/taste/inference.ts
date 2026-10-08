import * as crypto from 'crypto';
import { AestheticWorld } from './types';

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const MEMORY_CACHE = new Map<string, { response: string; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function hashPrompt(prompt: string): string {
  return crypto.createHash('sha256').update(prompt).digest('hex');
}

export class TasteInferenceRouter {
  private nvidiaApiKey?: string;
  private openrouterApiKey?: string;
  private cloudflareAi?: any;

  constructor(env?: {
    NVIDIA_API_KEY?: string;
    OPENROUTER_API_KEY?: string;
    AI?: any;
  }) {
    this.nvidiaApiKey = env?.NVIDIA_API_KEY || (typeof process !== 'undefined' ? process.env?.NVIDIA_API_KEY : undefined);
    this.openrouterApiKey = env?.OPENROUTER_API_KEY || (typeof process !== 'undefined' ? process.env?.OPENROUTER_API_KEY : undefined);
    this.cloudflareAi = env?.AI;
  }

  async callLLM(messages: LLMMessage[], systemPrompt?: string): Promise<string | null> {
    const fullPrompt = (systemPrompt || '') + '\n' + messages.map(m => m.content).join('\n');
    const cacheKey = hashPrompt(fullPrompt);

    const cached = MEMORY_CACHE.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.response;
    }

    const payloadMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    // 1. Try NVIDIA NIM (Nemotron 3 Ultra)
    if (this.nvidiaApiKey) {
      try {
        const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.nvidiaApiKey}`
          },
          body: JSON.stringify({
            model: 'nvidia/nemotron-3-ultra-550b-a55b',
            messages: payloadMessages,
            temperature: 0.7,
            max_tokens: 1500
          }),
          signal: AbortSignal.timeout(10000)
        });
        if (res.ok) {
          const data: any = await res.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            MEMORY_CACHE.set(cacheKey, { response: content, expiresAt: Date.now() + CACHE_TTL_MS });
            return content;
          }
        }
      } catch (err: any) {
        console.warn('[TasteRouter] NVIDIA NIM unavailable:', err.message);
      }
    }

    // 2. Try OpenRouter Free Tier (Nemotron / Llama 3.3 70B / Gemini 2.0 Flash)
    if (this.openrouterApiKey) {
      const freeModels = [
        'nvidia/nemotron-3-ultra-550b-a55b:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'google/gemini-2.0-flash-exp:free'
      ];

      for (const model of freeModels) {
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.openrouterApiKey}`,
              'HTTP-Referer': 'https://pixasso.erebuzzz.tech',
              'X-Title': 'Pixasso Taste Engine'
            },
            body: JSON.stringify({
              model,
              messages: payloadMessages,
              temperature: 0.7,
              max_tokens: 1500
            }),
            signal: AbortSignal.timeout(8000)
          });
          if (res.ok) {
            const data: any = await res.json();
            const content = data.choices?.[0]?.message?.content?.trim();
            if (content) {
              MEMORY_CACHE.set(cacheKey, { response: content, expiresAt: Date.now() + CACHE_TTL_MS });
              return content;
            }
          }
        } catch {
          // Continue to next free model
        }
      }
    }

    // 3. Try Cloudflare Workers AI
    if (this.cloudflareAi) {
      try {
        const response = await this.cloudflareAi.run('@cf/meta/llama-3.3-70b-instruct', {
          messages: payloadMessages,
          max_tokens: 1500
        });
        if (response?.response) {
          MEMORY_CACHE.set(cacheKey, { response: response.response, expiresAt: Date.now() + CACHE_TTL_MS });
          return response.response;
        }
      } catch (err: any) {
        console.warn('[TasteRouter] Cloudflare Workers AI unavailable:', err.message);
      }
    }

    return null;
  }

  async synthesizeAestheticWorlds(
    brief: string,
    archetype: string,
    audience?: string
  ): Promise<{ worlds: AestheticWorld[]; questions: any[] }> {
    const systemPrompt = `You are Pixasso's Art Director and Senior Typography Architect.
Given a user's project brief, synthesize exactly 3 radically distinct, awe-striking aesthetic worlds.
Avoid generic AI SaaS tropes (no purple gradients, no Lucide flooding, no generic Inter/Roboto).
Return valid JSON adhering to this exact format:
{
  "worlds": [
    {
      "name": "World Title",
      "movement": "Design Movement (e.g. Swiss Modernism, Dark Telemetry CRT, Solarpunk Organic)",
      "groundTone": "Background color and material texture (e.g. Ivory Paper #fbfaf7, Deep Slate #0b0f12)",
      "typography": "Headline font + Body font + Accent font (e.g. Syne + Newsreader + JetBrains Mono)",
      "vibe": "Concise evocative aesthetic description of layout, hairlines, and contrast",
      "modularScaleRatio": 1.25,
      "layoutGeometry": "Layout structure (e.g. Asymmetric bento grid, 12-column rigid grid, spatial canvas)",
      "motionSignature": "Physics and interaction curves (e.g. Inertial spring reveal, magnetic cursor, drift)",
      "uisfx": "Subtle tactile audio cues (e.g. 880Hz sine chime, 120Hz thud)",
      "palettePreview": ["#191919", "#fbfaf7", "#15803d"]
    }
  ],
  "questions": [
    {
      "question": "Provocative architectural question regarding visual tension or layout?",
      "options": ["(Recommended) Option 1", "Option 2"],
      "is_multi_select": false
    }
  ]
}`;

    const userPrompt = `Project Brief: ${brief}\nArchetype: ${archetype}\nTarget Audience: ${audience || 'Modern digital users'}`;

    const rawResponse = await this.callLLM([
      { role: 'user', content: userPrompt }
    ], systemPrompt);

    if (rawResponse) {
      try {
        const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed.worlds) && parsed.worlds.length >= 3) {
          return {
            worlds: parsed.worlds.slice(0, 3),
            questions: Array.isArray(parsed.questions) ? parsed.questions.slice(0, 3) : []
          };
        }
      } catch {
        // Fall back to deterministic engine
      }
    }

    return this.deterministicFallback(brief, archetype);
  }

  deterministicFallback(brief: string, archetype: string): { worlds: AestheticWorld[]; questions: any[] } {
    const isDark = /dark|crypto|terminal|code|hacker|black/i.test(brief);
    const isEditorial = /editorial|journal|magazine|book|words|write|essay/i.test(brief);

    if (isEditorial) {
      return {
        worlds: [
          {
            name: 'Warm Literary Parchment',
            movement: 'Contemporary Editorial & Type Poise',
            groundTone: 'Ivory Bone (#fbfaf7) with textured ink',
            typography: 'Newsreader serif display + Newsreader body + JetBrains Mono accents',
            vibe: 'Literary dignity, wide margin proportions, mathematical hairlines, and figure captions.',
            modularScaleRatio: 1.333,
            layoutGeometry: 'Split-screen editorial with wide margins and floating quote callouts',
            motionSignature: 'Subtle page-turn fade with gentle ease-out micro-scrolls',
            uisfx: 'Soft paper flutter at 440Hz sine wave',
            palettePreview: ['#191919', '#fbfaf7', '#8c8c82']
          },
          {
            name: 'Swiss Monolith Grotesk',
            movement: 'International Typographic Style',
            groundTone: 'Cold stark white (#ffffff) with black ink (#000000)',
            typography: 'Syne heavy display + Inter body + Space Mono metadata',
            vibe: 'Mathematical grid discipline, ultra-tight tracking, zero shadows, pure hairlines.',
            modularScaleRatio: 1.414,
            layoutGeometry: 'Rigid 12-column modular grid with asymmetric column spans',
            motionSignature: 'Snappy 150ms linear transitions with instant tactile feedback',
            uisfx: 'Crisp mechanical click at 1200Hz triangle wave',
            palettePreview: ['#000000', '#ffffff', '#e0e0e0']
          },
          {
            name: 'Deep Obsidian Review',
            movement: 'Dark Mode High-Contrast Monospace',
            groundTone: 'Pure basalt (#0d0e12) with subtle zinc borders',
            typography: 'Space Grotesk + JetBrains Mono + Courier Prime',
            vibe: 'Midnight reading room, high-contrast typography, subdued amber accents.',
            modularScaleRatio: 1.25,
            layoutGeometry: 'Centred reader column with floating footnote telemetry panels',
            motionSignature: 'Smooth 300ms cubic-bezier drift on section reveal',
            uisfx: 'Muffled low-pass tap at 220Hz sine wave',
            palettePreview: ['#0d0e12', '#f3f4f6', '#f59e0b']
          }
        ],
        questions: [
          {
            question: 'How should long-form content and imagery relate in this editorial layout?',
            options: [
              '(Recommended) Asymmetric Column Split: Narrative prose on the left with sticky figure captions on the right',
              'Single-Column Immersive: Centred reading column with full-bleed hero breaks'
            ],
            is_multi_select: false
          }
        ]
      };
    }

    if (isDark) {
      return {
        worlds: [
          {
            name: 'Phosphor Telemetry Terminal',
            movement: 'Retro-Futurist Monospace HUD',
            groundTone: 'Cathode-ray black (#080b09) with emerald raster glow',
            typography: 'JetBrains Mono heavy + Space Mono + VT323 numeric accents',
            vibe: 'Telemetry HUD, bracket hotkeys, 1px emerald hairlines, and scanline texture.',
            modularScaleRatio: 1.2,
            layoutGeometry: 'Multi-pane telemetry bento grid with fixed-width data columns',
            motionSignature: 'Instant cursor flicker and scanline drift animations',
            uisfx: 'CRT phosphor hum at 15kHz with 880Hz relay click',
            palettePreview: ['#080b09', '#33ff66', '#0f381e']
          },
          {
            name: 'Basalt Glass Monolith',
            movement: 'Deep Obsidian Precision',
            groundTone: 'Deep slate basalt (#0a0f12) with subtle ice glass cards',
            typography: 'Syne wide display + Inter body + JetBrains Mono indicators',
            vibe: 'Architectural restraint, razor-sharp 1px borders, cold cobalt luminescence.',
            modularScaleRatio: 1.25,
            layoutGeometry: 'Layered 2.5D card stack with perspective parallax on hover',
            motionSignature: 'Magnetic cursor tracking with spring physics dampers',
            uisfx: 'Subtle water-drop chime at 960Hz sine wave',
            palettePreview: ['#0a0f12', '#ffffff', '#2563eb']
          },
          {
            name: 'Pure Pitch AMOLED',
            movement: 'Zero-Emission AMOLED Minimalism',
            groundTone: 'Pure #000000 black with zero ambient light',
            typography: 'Space Grotesk + JetBrains Mono',
            vibe: 'Pure black canvas, high-contrast white typographic statements, electric cyan laser points.',
            modularScaleRatio: 1.333,
            layoutGeometry: 'Fluid full-bleed viewport with borderless card transitions',
            motionSignature: 'Zero-latency instant state toggle with smooth opacity crossfades',
            uisfx: 'Haptic-style tactile pop at 180Hz sine wave',
            palettePreview: ['#000000', '#ffffff', '#00f2fe']
          }
        ],
        questions: [
          {
            question: 'What level of visual density and telemetry should the dashboard exhibit?',
            options: [
              '(Recommended) High-Density Telemetry: Tightly spaced 1px grid cards with real-time live data widgets',
              'Zen Minimalist Focus: Spacious hero cards with deep negative space'
            ],
            is_multi_select: false
          }
        ]
      };
    }

    // Default general archetype
    return {
      worlds: [
        {
          name: 'Obsidian Precision',
          movement: 'High-Contrast Technical Architecture',
          groundTone: 'Deep charcoal (#0f1117) with razor 1px borders',
          typography: 'Space Grotesk + JetBrains Mono',
          vibe: 'Razor-sharp borders, architectural geometry, electric blue accents.',
          modularScaleRatio: 1.25,
          layoutGeometry: 'Bento modular grid with interactive micro-previews',
          motionSignature: 'Snappy spring damping with subtle hover elevation',
          uisfx: 'Mechanical click at 600Hz triangle wave',
          palettePreview: ['#0f1117', '#ffffff', '#3b82f6']
        },
        {
          name: 'Warm Editorial Poise',
          movement: 'Literary Craft & Human Warmth',
          groundTone: 'Ivory Paper (#fbfaf7) with warm charcoal text',
          typography: 'Syne display + Newsreader serif body + JetBrains Mono accents',
          vibe: 'Warm paper texture, literary elegance, mathematical hairlines.',
          modularScaleRatio: 1.333,
          layoutGeometry: 'Split-column editorial with balanced typographic rhythm',
          motionSignature: 'Graceful ease-out transitions and gentle reveals',
          uisfx: 'Soft acoustic tap at 480Hz sine wave',
          palettePreview: ['#191919', '#fbfaf7', '#15803d']
        },
        {
          name: 'Solarpunk Kinetic',
          movement: 'Bio-Digital Organic Harmony',
          groundTone: 'Warm stone (#f4f3ef) with rich moss and terracotta accents',
          typography: 'Syne + Plus Jakarta Sans + Space Mono',
          vibe: 'Organic rounded contours, warm earthen tones, kinetic hover transitions.',
          modularScaleRatio: 1.25,
          layoutGeometry: 'Fluid organic bento layout with asymmetric pill badges',
          motionSignature: 'Organic fluid spring transitions with subtle drift',
          uisfx: 'Resonant bell tone at 720Hz sine wave',
          palettePreview: ['#223825', '#f4f3ef', '#d97706']
        }
      ],
      questions: [
        {
          question: 'Which visual rhythm and layout geometry best represents this project?',
          options: [
            '(Recommended) Modular Bento Grid: High-contrast responsive cards with live micro-interactions',
            'Split-Screen Editorial: Bold display typography on the left paired with interactive artifacts on the right'
          ],
          is_multi_select: false
        }
      ]
    };
  }
}
