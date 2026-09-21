import { z } from 'zod';

export const discoverIntentSchema = z.object({
  projectArchetype: z.enum([
    'full_web_app',
    'editorial_landing_page',
    'creative_3d_canvas',
    'design_system',
    'general'
  ]).describe('The primary archetype of the frontend project to tailor the discovery questions.'),
  description: z.string().describe('Initial brief or description provided by the user.'),
  targetAudience: z.string().optional().describe('Target audience or user persona if known.')
});

export type DiscoverIntentInput = z.infer<typeof discoverIntentSchema>;

export function handleDiscoverIntent(input: DiscoverIntentInput) {
  const { projectArchetype, description } = input;

  const personas = [
    {
      name: 'Obsidian Precision',
      groundTone: 'Dark slate (#0a0f12)',
      typography: 'Space Grotesk + JetBrains Mono',
      vibe: 'High-contrast technical restraint, razor-sharp 1px borders, architectural precision.'
    },
    {
      name: 'Warm Editorial (Noerd & Stripe inspired)',
      groundTone: 'Ivory Paper (#fbfaf7)',
      typography: 'Syne / Dinamo Gravity style display + Newsreader serif body + JetBrains Mono accents',
      vibe: 'Literary poise, warm ink tones, mathematical hairlines, and figure captions.'
    },
    {
      name: 'CRT-mono Phosphor Terminal',
      groundTone: 'Cathode-ray dark (#0a0f0d)',
      typography: 'JetBrains Mono / Space Mono',
      vibe: 'Retro emerald glow (#33ff66), scanline overlays, telemetry HUDs, bracket hotkeys.'
    },
    {
      name: 'Pitch Black AMOLED',
      groundTone: 'Pure #000000 black',
      typography: 'Syne / Inter + JetBrains Mono',
      vibe: 'True pitch black, high-contrast white headers, cobalt electric blue (#0000ff) accents.'
    }
  ];

  let questions: Array<{
    question: string;
    options: string[];
    is_multi_select: boolean;
  }> = [];

  if (projectArchetype === 'full_web_app') {
    questions = [
      {
        question: 'Which framework and state management architecture best fits this application?',
        options: [
          '(Recommended) Next.js 15 (App Router) + TypeScript + Zustand + TanStack Query',
          'React 19 + Vite + TypeScript + Zustand + React Hook Form with Zod',
          'SvelteKit + TypeScript + Svelte Runes + Superforms'
        ],
        is_multi_select: false
      },
      {
        question: 'How should form validation and client auth UX be configured?',
        options: [
          '(Recommended) React Hook Form + Zod schema validation with persistent draft autosaving and session recovery',
          'Native HTML5 validation with lightweight schema validation and HTTP-only cookie auth',
          'Step-by-step wizard forms with instant field-blur error banners'
        ],
        is_multi_select: false
      },
      {
        question: 'Which visual theme and ground tone should anchor the dashboard experience?',
        options: [
          '(Recommended) Pitch Black AMOLED (#000000) with cobalt accents and sharp structural cards',
          'Warm Ivory Paper (#fbfaf7) with archival editorial clarity',
          'Multi-theme switchable system supporting Paper, CRT-mono, and AMOLED'
        ],
        is_multi_select: false
      }
    ];
  } else if (projectArchetype === 'editorial_landing_page') {
    questions = [
      {
        question: 'Which typography architecture best reflects the narrative voice of this site?',
        options: [
          '(Recommended) Noerd-style wide display sans (Syne / Dinamo Gravity inspired) paired with Newsreader serif body and JetBrains Mono metadata',
          'Classic Archival Serif: Playfair Display / Newsreader headlines with crisp grotesque body',
          'Technical Monospace: JetBrains Mono headlines and tabular data'
        ],
        is_multi_select: false
      },
      {
        question: 'Which visual ground tone and atmospheric theme should lead the brand world?',
        options: [
          '(Recommended) Paper Ivory (#fbfaf7) with dark ink typography and hairline dividers',
          'Pitch Black AMOLED (#000000) with electric cobalt highlights',
          'Switchable multi-mode: Paper (Light) and CRT-mono / AMOLED (Dark)'
        ],
        is_multi_select: false
      },
      {
        question: 'What central interactive proof element should anchor the hero section?',
        options: [
          '(Recommended) Interactive Mathematical Canvas (stripe.dev style wave/dial engine with real-time controls)',
          'High-craft metric pill cards and architectural grid showcase (rge-partner.de style)',
          'Interactive component demo with tabbed install commands'
        ],
        is_multi_select: false
      }
    ];
  } else if (projectArchetype === 'creative_3d_canvas') {
    questions = [
      {
        question: 'Which canvas runtime and dimensionality approach should be implemented?',
        options: [
          '(Recommended) Interactive Canvas 2D / WebGL mathematical wave and oscillator engine (zero heavy asset overhead)',
          'Spline 3D embedded spatial scene reacting to cursor tilt and lighting',
          'Three.js procedural wireframe geometry with optical refraction shaders'
        ],
        is_multi_select: false
      },
      {
        question: 'How should Web Audio API sensory design (UISFX) be incorporated?',
        options: [
          '(Recommended) Subtle tactile clicks on hotkeys, phosphor hum on theme switch, affirmative chime on copy (with toggle)',
          'Retro CRT cathode audio: authentic terminal keyclicks and sweep hums',
          'Strictly silent by default: visual feedback only'
        ],
        is_multi_select: false
      }
    ];
  } else {
    questions = [
      {
        question: 'Which aesthetic persona best matches your intent?',
        options: [
          '(Recommended) Warm Editorial: Ivory ground (#fbfaf7), Noerd-style wide display, literary serif body',
          'Pitch Black AMOLED: True #000000 black, cobalt blue accents, razor-sharp structural cards',
          'CRT-mono: Cathode dark ground (#0a0f0d), emerald phosphor glow, scanlines, terminal brackets'
        ],
        is_multi_select: false
      },
      {
        question: 'What is the primary technical deliverable?',
        options: [
          '(Recommended) Complete responsive web application with accessible components and theme switching',
          'High-craft marketing landing page with interactive canvas and install widgets',
          'Reusable design system and component specification'
        ],
        is_multi_select: false
      }
    ];
  }

  return {
    status: 'discovery_initiated',
    projectArchetype,
    briefSummary: description,
    recommendedPersonas: personas,
    compulsoryPopupQuestions: questions,
    instruction: 'Call the host ask_question tool with compulsoryPopupQuestions before drafting implementation_plan.md.'
  };
}
