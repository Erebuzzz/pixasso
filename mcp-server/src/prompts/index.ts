export interface MCPPromptArgument {
  name: string;
  description: string;
  required: boolean;
}

export interface MCPPrompt {
  name: string;
  description: string;
  arguments?: MCPPromptArgument[];
}

export const PIXASSO_PROMPTS: MCPPrompt[] = [
  {
    name: 'intent-discovery',
    description: 'Initiate adaptive intent discovery using the Adaptive Discovery Matrix before generating code.',
    arguments: [
      {
        name: 'projectType',
        description: 'Archetype of the project: full_web_app, editorial_landing_page, creative_3d_canvas, or design_system',
        required: true
      },
      {
        name: 'brief',
        description: 'Brief description of the intended product or interface',
        required: true
      }
    ]
  },
  {
    name: 'frontend-architecture',
    description: 'Scaffold an end-to-end frontend engineering architecture across all 16 foundational pillars.',
    arguments: [
      {
        name: 'applicationName',
        description: 'Name of the web application or service',
        required: true
      },
      {
        name: 'stackPreference',
        description: 'Preferred frontend stack (e.g. Next.js 15, React 19, Vite, SvelteKit)',
        required: false
      }
    ]
  },
  {
    name: 'design-critique',
    description: 'Conduct a rigorous 5-pillar design and code quality audit to detect generic AI tropes and a11y flaws.',
    arguments: [
      {
        name: 'markupOrUrl',
        description: 'Component HTML/JSX markup, CSS, or live URL to critique',
        required: true
      }
    ]
  },
  {
    name: 'typography-direction',
    description: 'Define an intentional typography system (display, serif, monospace) using modular math scales.',
    arguments: [
      {
        name: 'narrativeTone',
        description: 'Narrative voice and atmosphere (e.g. Noerd editorial, Stripe paper, technical monospace)',
        required: true
      }
    ]
  },
  {
    name: 'interface-qa',
    description: 'Generate an automated multi-viewport testing matrix (390px, 768px, 1024px, 1440px) and overflow checks.',
    arguments: [
      {
        name: 'pageUrl',
        description: 'Target URL or local dev server address to verify',
        required: false
      }
    ]
  }
];

export function renderPrompt(name: string, args: Record<string, string>): { description: string; messages: Array<{ role: 'user'; content: { type: 'text'; text: string } }> } | null {
  if (name === 'intent-discovery') {
    return {
      description: 'Pixasso Intent Discovery Prompt',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `You are Pixasso. Execute the Adaptive Discovery Matrix for this project (${args.projectType || 'general'}).\nBrief: ${args.brief || 'No description provided'}.\n\nRemember the MUST RULE: Always call the interactive popup tool (ask_question) before drafting an implementation plan or generating code. Inquire across theme/vibe, typography architecture (headline personality, serif vs sans vs mono), color mood, ground tone, dimensionality (2D vs 2.5D vs 3D), and motion feel.`
          }
        }
      ]
    };
  }

  if (name === 'frontend-architecture') {
    return {
      description: 'Pixasso Frontend Architecture Scaffold',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `You are Pixasso, senior frontend architect. Plan and implement the complete frontend architecture for ${args.applicationName || 'Application'} across all 16 pillars (Visual Design, HTML Semantics, CSS/Tailwind, TypeScript, Frameworks, State Management, API & WebSockets, Auth UX, Forms & Zod, Motion, Responsive Design, WCAG AA/AAA Accessibility, Core Web Vitals, Testing, Tooling, and Deployment). Stack preference: ${args.stackPreference || 'Next.js 15 + React 19 + TypeScript + Zustand + Tailwind CSS'}.`
          }
        }
      ]
    };
  }

  if (name === 'design-critique') {
    return {
      description: 'Pixasso 5-Pillar Design Critique',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Audit the following design/code against generic AI tropes (purple gradients, unmotivated glassmorphism, Lucide icon flooding, universal scroll-fades) and evaluate across the 5 pillars: UX & Architecture, Visual Craft, Interaction & Affordances, Motion Choreography, and Technical Feasibility:\n\n${args.markupOrUrl}`
          }
        }
      ]
    };
  }

  if (name === 'typography-direction') {
    return {
      description: 'Pixasso Typography Architecture',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Establish a high-craft typography architecture for tone "${args.narrativeTone}". Select an intentional display typeface (such as Noerd-style wide grotesque Dinamo Gravity / Syne inspired), editorial serif (Newsreader), and monospace (JetBrains Mono). Define the modular scale, calibrated line heights, and character bounds.`
          }
        }
      ]
    };
  }

  if (name === 'interface-qa') {
    return {
      description: 'Pixasso Interface QA Matrix',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Generate a rigorous interface testing plan for ${args.pageUrl || 'http://localhost:3000'}. Inspect 390px, 768px, 1024px, and 1440px viewports, run DOM overflow detection (scrollWidth > innerWidth), verify keyboard traversal, and establish Lighthouse 90+ targets.`
          }
        }
      ]
    };
  }

  return null;
}
