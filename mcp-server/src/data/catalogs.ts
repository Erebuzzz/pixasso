import * as fs from 'fs';
import * as path from 'path';

export interface CatalogItem {
  id: string;
  name: string;
  category: 'reference' | 'template';
  description: string;
  tags: string[];
  filename: string;
}

export const REFERENCE_CATALOGS: CatalogItem[] = [
  {
    id: 'frontend-architecture-pillars',
    name: 'Frontend Architecture Pillars',
    category: 'reference',
    description: 'Complete guide covering the 16 foundational pillars of frontend engineering and design craft.',
    tags: ['frontend', 'architecture', 'react', 'nextjs', 'state', 'zod', 'forms', 'a11y', 'performance'],
    filename: 'frontend-architecture-pillars.md'
  },
  {
    id: 'discovery-framework',
    name: 'Discovery Framework & Adaptive Matrix',
    category: 'reference',
    description: 'Adaptive Intent Discovery protocol and project archetype inquiry matrix.',
    tags: ['discovery', 'intent', 'questions', 'matrix', 'brief'],
    filename: 'discovery-framework.md'
  },
  {
    id: 'design-genome',
    name: 'Design Genome Persistence',
    category: 'reference',
    description: 'Structured persistence of tokens, constraints, and epistemic design states.',
    tags: ['genome', 'tokens', 'persistence', 'colors', 'typography'],
    filename: 'design-genome.md'
  },
  {
    id: 'design-brain',
    name: 'Design Brain Visualization',
    category: 'reference',
    description: 'User-visible Graphify-style Mermaid maps of design decisions and Task DAG state.',
    tags: ['brain', 'graphify', 'mermaid', 'dag', 'decisions'],
    filename: 'design-brain.md'
  },
  {
    id: 'typography-system',
    name: 'Typography System & Mathematics',
    category: 'reference',
    description: 'Typeface.fyi integration, modular scales, line lengths, and optical pairings.',
    tags: ['typography', 'fonts', 'scale', 'typeface-fyi', 'noerd', 'stripe'],
    filename: 'typography-system.md'
  },
  {
    id: 'typography-discovery',
    name: 'Typography Discovery Protocol',
    category: 'reference',
    description: 'Deep inquiry into typographic hierarchy, headline personality, and body readability.',
    tags: ['typography', 'discovery', 'hierarchy', 'readability'],
    filename: 'typography-discovery.md'
  },
  {
    id: 'ui-component-libraries',
    name: 'UI Component Libraries',
    category: 'reference',
    description: 'Aceternity UI, Originkit, Dialkit Agent, RareUI, Libraries.dev, React Bits, and shadcn.',
    tags: ['components', 'aceternity', 'originkit', 'dialkit', 'libraries-dev', 'react-bits'],
    filename: 'ui-component-libraries.md'
  },
  {
    id: 'creative-coding-and-webgl',
    name: 'Creative Coding & WebGL 3D',
    category: 'reference',
    description: 'Spline 3D browser automation, ThreeUI, Glass Samasante optical shaders, Canvas 2D, and WebGPU.',
    tags: ['3d', 'webgl', 'spline', 'threeui', 'shaders', 'glass-samasante', 'canvas'],
    filename: 'creative-coding-and-webgl.md'
  },
  {
    id: 'motion-and-animation',
    name: 'Motion & Animation Systems',
    category: 'reference',
    description: 'Transitions.dev, SceneAI.art prompt recipes, Motion.dev, GSAP, and spring physics.',
    tags: ['motion', 'animation', 'transitions-dev', 'sceneai-art', 'gsap', 'springs'],
    filename: 'motion-and-animation.md'
  },
  {
    id: 'sound-and-sensory-design',
    name: 'Sound & Sensory Design (UISFX)',
    category: 'reference',
    description: 'Web Audio API micro-interactions, subtle feedback cues, and auditory tactile craft.',
    tags: ['sound', 'uisfx', 'audio', 'tactile', 'web-audio'],
    filename: 'sound-and-sensory-design.md'
  },
  {
    id: 'interface-testing-and-qa',
    name: 'Interface Testing & QA Automation',
    category: 'reference',
    description: 'Multi-viewport testing (390px, 768px, 1024px, 1440px), DOM overflow detection, Lighthouse, and a11y.',
    tags: ['testing', 'qa', 'viewports', 'overflow', 'lighthouse', 'chrome-devtools'],
    filename: 'interface-testing-and-qa.md'
  },
  {
    id: 'inspiration-galleries',
    name: 'Inspiration Galleries',
    category: 'reference',
    description: 'Curated.design, Recent.design, VibeUI, DesignPrompts.dev, and portfolio benchmarks.',
    tags: ['inspiration', 'curated-design', 'recent-design', 'vibeui', 'designprompts'],
    filename: 'inspiration-galleries.md'
  },
  {
    id: 'anti-patterns-and-critique',
    name: 'Anti-Patterns & Critique Rubric',
    category: 'reference',
    description: 'Elimination of generic AI design tropes and 5-pillar objective critique framework.',
    tags: ['anti-patterns', 'critique', 'tropes', 'quality'],
    filename: 'anti-patterns-and-critique.md'
  },
  {
    id: 'art-direction-and-dimensions',
    name: 'Art Direction & Spatial Dimensions',
    category: 'reference',
    description: '2D vs 2.5D vs 3D criteria, visual worlds, lighting, and surface materiality.',
    tags: ['art-direction', '2d', '2.5d', '3d', 'composition'],
    filename: 'art-direction-and-dimensions.md'
  },
  {
    id: 'agent-orchestration',
    name: 'Agent Orchestration & Tool Registry',
    category: 'reference',
    description: 'Agent Harnesser architecture, subagent delegation, and MCP tool coordination.',
    tags: ['agent-orchestration', 'tools', 'delegation', 'harnesser'],
    filename: 'agent-orchestration.md'
  },
  {
    id: 'task-graph',
    name: 'Task Graph & Dependency DAG',
    category: 'reference',
    description: 'Dependency-aware DAG management, task packets, and parallel execution pipelines.',
    tags: ['task-graph', 'dag', 'dependencies', 'workflow'],
    filename: 'task-graph.md'
  },
  {
    id: 'tool-registry',
    name: 'Tool Registry & Capability Tags',
    category: 'reference',
    description: 'Catalog of agent tools, MCP servers, and specialized capability mapping.',
    tags: ['tool-registry', 'capabilities', 'mcp'],
    filename: 'tool-registry.md'
  },
  {
    id: 'contradiction-resolution',
    name: 'Contradiction Resolution',
    category: 'reference',
    description: 'Systematic framework for resolving conflicting design goals and technical constraints.',
    tags: ['conflicts', 'tradeoffs', 'resolution'],
    filename: 'contradiction-resolution.md'
  },
  {
    id: 'generative-assets-and-tools',
    name: 'Generative Assets & Tools',
    category: 'reference',
    description: 'Procedural SVGs, visual diffusion art direction prompts, and asset workflows.',
    tags: ['generative', 'svg', 'assets', 'prompts'],
    filename: 'generative-assets-and-tools.md'
  },
  {
    id: 'live-case-studies',
    name: 'Live Case Studies',
    category: 'reference',
    description: 'In-depth architectural deconstructions of industry-leading digital craft benchmarks.',
    tags: ['case-studies', 'deconstruction', 'stripe', 'rge', 'noerd'],
    filename: 'live-case-studies.md'
  }
];

export const TEMPLATE_CATALOGS: CatalogItem[] = [
  {
    id: 'component-implementation-spec',
    name: 'Component Implementation Spec',
    category: 'template',
    description: 'Production component specification including accessibility, props, and states.',
    tags: ['component', 'spec', 'props', 'a11y'],
    filename: 'component-implementation-spec.md'
  },
  {
    id: 'interface-test-plan',
    name: 'Interface Test Plan',
    category: 'template',
    description: 'Multi-viewport testing matrix, DOM overflow checklist, and Lighthouse goals.',
    tags: ['test-plan', 'viewports', 'qa', 'matrix'],
    filename: 'interface-test-plan.md'
  },
  {
    id: 'design-brain',
    name: 'Design Brain Template',
    category: 'template',
    description: 'Mermaid decision map and live Task DAG status template.',
    tags: ['design-brain', 'mermaid', 'decisions'],
    filename: 'design-brain.md'
  },
  {
    id: 'design-brief',
    name: 'Design Brief Scaffold',
    category: 'template',
    description: 'Structured project intake document capturing goals, audience, and constraints.',
    tags: ['brief', 'intake', 'goals'],
    filename: 'design-brief.md'
  },
  {
    id: 'design-critique-rubric',
    name: 'Design Critique Rubric',
    category: 'template',
    description: 'Scorecard evaluating designs across the five objective craft pillars.',
    tags: ['critique', 'rubric', 'scorecard'],
    filename: 'design-critique-rubric.md'
  },
  {
    id: 'design-genome',
    name: 'Design Genome YAML Schema',
    category: 'template',
    description: 'Machine-readable design tokens, epistemic states, and constraints schema.',
    tags: ['genome', 'yaml', 'schema', 'tokens'],
    filename: 'design-genome.yaml'
  },
  {
    id: 'design-mode-spec',
    name: 'Design Mode Specification',
    category: 'template',
    description: 'Aesthetic mode definition binding philosophy to visual tokens.',
    tags: ['mode', 'aesthetic', 'philosophy'],
    filename: 'design-mode-spec.md'
  },
  {
    id: 'project-state',
    name: 'Project State Schema',
    category: 'template',
    description: 'YAML tracking active phase, capability registry, and handoff state.',
    tags: ['project-state', 'yaml', 'tracking'],
    filename: 'project-state.yaml'
  },
  {
    id: 'task-graph',
    name: 'Task Graph YAML Schema',
    category: 'template',
    description: 'Machine-readable DAG definition with agent assignments and dependencies.',
    tags: ['task-graph', 'yaml', 'dag'],
    filename: 'task-graph.yaml'
  },
  {
    id: 'typography-spec',
    name: 'Typography Specification YAML',
    category: 'template',
    description: 'Tokens for mathematical type scales, line heights, and font pairings.',
    tags: ['typography', 'yaml', 'tokens'],
    filename: 'typography-spec.yaml'
  },
  {
    id: 'agent-task',
    name: 'Agent Task Packet',
    category: 'template',
    description: 'Context-isolated assignment packet for specialist subagents.',
    tags: ['agent-task', 'packet', 'subagents'],
    filename: 'agent-task.md'
  }
];

export function resolveCatalogPath(category: 'references' | 'templates', filename: string): string | null {
  const potentialBaseDirs = [
    path.resolve(__dirname, '../../../skills/pixasso', category),
    path.resolve(__dirname, '../../../', category),
    path.resolve(__dirname, '../../', category),
    path.resolve(process.cwd(), 'skills/pixasso', category),
    path.resolve(process.cwd(), category)
  ];

  for (const baseDir of potentialBaseDirs) {
    const candidate = path.join(baseDir, filename);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function readCatalogContent(category: 'references' | 'templates', filename: string): string {
  const fullPath = resolveCatalogPath(category, filename);
  if (fullPath && fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf8');
  }
  return `# ${filename}\n\nContent file not found on disk at runtime.`;
}
