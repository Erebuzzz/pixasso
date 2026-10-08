import { z } from 'zod';
import { TasteInferenceRouter } from '../taste/inference';
import { getConsentDiscoveryQuestion } from '../taste/consent';

export const discoverIntentSchema = z.object({
  projectArchetype: z.enum([
    'full_web_app',
    'editorial_landing_page',
    'creative_3d_canvas',
    'design_system',
    'general'
  ]).describe('The primary archetype of the frontend project to tailor the discovery questions.'),
  description: z.string().describe('Initial brief or description provided by the user.'),
  targetAudience: z.string().optional().describe('Target audience or user persona if known.'),
  hasBrandIdentity: z.boolean().optional().describe('Whether an existing brand identity exists or needs to be synthesized from scratch.'),
  referenceUrls: z.array(z.string().url()).optional().describe('Optional list of reference URLs capturing the desired feel.')
});

export type DiscoverIntentInput = z.infer<typeof discoverIntentSchema>;

let defaultRouter: TasteInferenceRouter | null = null;

function getRouter(routerOrEnv?: TasteInferenceRouter | { NVIDIA_API_KEY?: string; OPENROUTER_API_KEY?: string; AI?: any }): TasteInferenceRouter {
  if (routerOrEnv instanceof TasteInferenceRouter) {
    return routerOrEnv;
  }
  if (routerOrEnv) {
    return new TasteInferenceRouter(routerOrEnv);
  }
  if (!defaultRouter) {
    defaultRouter = new TasteInferenceRouter();
  }
  return defaultRouter;
}

export async function handleDiscoverIntent(
  input: DiscoverIntentInput,
  routerOrEnv?: TasteInferenceRouter | { NVIDIA_API_KEY?: string; OPENROUTER_API_KEY?: string; AI?: any }
) {
  try {
    const validated = discoverIntentSchema.parse(input);
    const { projectArchetype, description, targetAudience, hasBrandIdentity, referenceUrls } = validated;

    const router = getRouter(routerOrEnv);
    const synthesis = await router.synthesizeAestheticWorlds(description, projectArchetype, targetAudience);

    const questions: Array<{
      question: string;
      options: string[];
      is_multi_select: boolean;
    }> = [];

    // 1. Bespoke Aesthetic Worlds Question (Synthesized by Exploration Brain)
    if (synthesis.worlds && synthesis.worlds.length >= 2) {
      questions.push({
        question: 'Which bespoke aesthetic direction best captures the tone and spirit of this project?',
        options: synthesis.worlds.map((world, idx) => {
          const prefix = idx === 0 ? '(Recommended) ' : '';
          return `${prefix}${world.name} [${world.movement}]: Ground tone ${world.groundTone}; Type ${world.typography}; Vibe: ${world.vibe}`;
        }),
        is_multi_select: false
      });
    }

    // 2. Optional Reference Inquiry (Non-blocking)
    if (!referenceUrls || referenceUrls.length === 0) {
      questions.push({
        question: 'Do you have any reference sites or apps that capture the feel you are going for? (Optional, skip if you want Pixasso to formulate the aesthetic from scratch)',
        options: [
          '(Recommended) Synthesize from scratch: Formulate the design language, palette, and typography system without external reference sites',
          'I will provide reference URLs to deconstruct: Analyze visual hierarchy, layout geometry, and typographic rhythm from specific sites'
        ],
        is_multi_select: false
      });
    }

    // 3. Mandatory Brand Identity Gate
    if (hasBrandIdentity === undefined) {
      questions.push({
        question: 'Does this project have an established brand identity, or should Pixasso synthesize one from scratch?',
        options: [
          '(Recommended) Synthesize from scratch: Formulate custom logo/wordmark, dynamic SVG favicon, landing hero architecture, and preview section',
          'Existing brand guidelines: Extract colors, typography, logos, and tokens directly from provided brand assets'
        ],
        is_multi_select: false
      });
    }

    if (hasBrandIdentity === false || hasBrandIdentity === undefined) {
      questions.push({
        question: 'Which brand artifacts and presentation sections should be formulated?',
        options: [
          '(Recommended) Geometric Monogram and SVG Favicon: Adaptive vector mark that shifts colors across Light/Dark/AMOLED themes',
          '(Recommended) Interactive Multi-Device Sandbox: Live responsive frame preview (390px, 768px, 1440px) for product proofs',
          '(Recommended) Landing Hero Architecture: Split layout pairing bold wide typography with an interactive canvas centerpiece',
          'Feature Bento Grid: High-contrast modular cards with live interactive micro-previews'
        ],
        is_multi_select: true
      });
    }

    // 4. Domain & Archetype Architectural Decisions
    if (projectArchetype === 'full_web_app') {
      questions.push(
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
        }
      );
    } else if (projectArchetype === 'editorial_landing_page') {
      questions.push(
        {
          question: 'Which typography architecture best reflects the narrative voice of this site?',
          options: [
            '(Recommended) Wide display sans paired with literary serif body and JetBrains Mono metadata',
            'Classic Archival Serif: Playfair Display / Newsreader headlines with crisp grotesque body',
            'Technical Monospace: JetBrains Mono headlines and tabular data'
          ],
          is_multi_select: false
        },
        {
          question: 'What central interactive proof element should anchor the hero section?',
          options: [
            '(Recommended) Interactive Mathematical Canvas (wave/dial engine with real-time controls)',
            'High-craft metric pill cards and architectural grid showcase',
            'Interactive component demo with tabbed install commands'
          ],
          is_multi_select: false
        }
      );
    } else if (projectArchetype === 'creative_3d_canvas') {
      questions.push(
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
      );
    }

    // 5. Any dynamic questions generated by the LLM
    if (synthesis.questions && synthesis.questions.length > 0) {
      for (const q of synthesis.questions) {
        if (q.question && Array.isArray(q.options) && q.options.length >= 2) {
          questions.push({
            question: q.question,
            options: q.options,
            is_multi_select: Boolean(q.is_multi_select)
          });
        }
      }
    }

    // 6. Decentralized Swarm Taste Seeding Consent Gate
    questions.push(getConsentDiscoveryQuestion());

    return {
      status: 'discovery_initiated',
      projectArchetype,
      briefSummary: description,
      recommendedPersonas: synthesis.worlds,
      compulsoryPopupQuestions: questions,
      instruction: 'Call the host ask_question tool with compulsoryPopupQuestions before drafting implementation_plan.md.'
    };
  } catch (error: any) {
    throw new Error('Failed to formulate intent discovery: ' + error.message);
  }
}
