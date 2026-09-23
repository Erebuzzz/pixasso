import { z } from 'zod';
import { verifiedFetchCache, normalizeUrlKey } from './referenceCache';

export const generateGenomeSchema = z.object({
  projectName: z.string().describe('Name of the design project or application.'),
  themeMode: z.enum(['paper', 'crt_mono', 'amoled_black', 'custom']).describe('Aesthetic theme mode.'),
  groundTone: z.string().describe('Hex ground tone or background color (e.g. #fbfaf7, #0a0f0d, #000000).'),
  typography: z.object({
    displayFont: z.string().describe('Display headline font (e.g. Syne, Space Grotesk, Playfair Display).'),
    bodyFont: z.string().describe('Body reading font (e.g. Newsreader, Inter, Plus Jakarta Sans).'),
    monoFont: z.string().describe('Monospace font for data/code (e.g. JetBrains Mono, Space Mono).'),
    scaleRatio: z.string().optional().default('1.250 (Major Third)')
  }),
  colorTokens: z.object({
    primary: z.string().describe('Primary ink or accent color.'),
    accent: z.string().describe('Highlight or interactive accent color (e.g. #0000ff, #33ff66).'),
    border: z.string().describe('Border or divider color.')
  }),
  dimensionality: z.enum(['2d_planar', '2.5d_parallax', '3d_webgl']).default('2d_planar'),
  motionFeel: z.string().optional().default('Subtle spring physics with 200ms micro-interactions and reduced-motion fallbacks'),
  technicalStack: z.object({
    framework: z.string().default('React 19 / Next.js 15'),
    stateManager: z.string().default('Zustand'),
    formValidation: z.string().default('React Hook Form + Zod'),
    styling: z.string().default('Tailwind CSS + CSS Custom Properties')
  }).optional(),
  references: z.array(z.object({
    url: z.string().url(),
    fetchedAt: z.string(),
    renderedContentDetected: z.boolean(),
    extractedPrinciples: z.array(z.string()).describe('Principles extracted, not visual descriptions to copy verbatim'),
    epistemicStatus: z.enum(['known', 'inferred', 'uncertain', 'unavailable'])
  })).optional().describe('Audited reference sites analyzed via pixasso_fetch_reference.')
});

export type GenerateGenomeInput = z.input<typeof generateGenomeSchema>;

export function handleGenerateGenome(rawInput: GenerateGenomeInput) {
  try {
    const input = generateGenomeSchema.parse(rawInput);
    // AUDIT-02: Hard gate enforcement against unverified or hallucinated references
  if (input.references && input.references.length > 0) {
    for (const ref of input.references) {
      const entry = verifiedFetchCache.get(ref.url) || verifiedFetchCache.get(normalizeUrlKey(ref.url));
      if (!entry) {
        throw new Error(
          `Reference URL "${ref.url}" has not been fetched via pixasso_fetch_reference in this session. ` +
          `You must call pixasso_fetch_reference on each reference before producing deconstruction claims or compiling it into the Design Genome.`
        );
      }
      if (entry.renderedContentDetected === false && ref.epistemicStatus === 'known') {
        throw new Error(
          `Reference URL "${ref.url}" was detected as an empty client-rendered SPA shell (renderedContentDetected: false). ` +
          `Its epistemicStatus cannot be "known" without rendered visual inspection. Mark as "unavailable" or "uncertain", or ask the user for a screenshot.`
        );
      }
    }
  }

  const stack = input.technicalStack || {
    framework: 'React 19 / Next.js 15',
    stateManager: 'Zustand',
    formValidation: 'React Hook Form + Zod',
    styling: 'Tailwind CSS + CSS Custom Properties'
  };

  let referencesYaml = 'references: []\n';
  if (input.references && input.references.length > 0) {
    referencesYaml = 'references:\n' + input.references.map(ref => {
      const principles = ref.extractedPrinciples.length > 0
        ? '\n    extracted_principles:\n' + ref.extractedPrinciples.map(p => `      - "${p.replace(/"/g, '\\"')}"`).join('\n')
        : '\n    extracted_principles: []';
      return `  - url: "${ref.url}"
    fetched_at: "${ref.fetchedAt}"
    rendered_content_detected: ${ref.renderedContentDetected}
    epistemic_status: "${ref.epistemicStatus}"${principles}`;
    }).join('\n') + '\n';
  }

  const yaml = `schema_version: "2.0.0"
project: "${input.projectName}"
created_at: "${new Date().toISOString()}"

intent:
  theme_mode: "${input.themeMode}"
  ground_tone: "${input.groundTone}"
  dimensionality: "${input.dimensionality}"
  sensory_feedback:
    web_audio_uisfx: true
    audio_toggle: true

${referencesYaml}
typography:
  display:
    family: "${input.typography.displayFont}"
    role: "Hero headlines, section headers, smallcaps metadata"
    epistemic_state: "known"
  body:
    family: "${input.typography.bodyFont}"
    role: "Editorial copy, article body, descriptions"
    epistemic_state: "known"
  monospace:
    family: "${input.typography.monoFont}"
    role: "Bracket hotkeys, figure numbers, telemetry, code snippets"
    epistemic_state: "known"
  scale_ratio: "${input.typography.scaleRatio}"

colors:
  ground: "${input.groundTone}"
  primary_ink: "${input.colorTokens.primary}"
  accent: "${input.colorTokens.accent}"
  border_hairline: "${input.colorTokens.border}"

motion:
  pacing: "${input.motionFeel}"
  reduced_motion: "strict_adherence"

frontend_architecture:
  framework: "${stack.framework}"
  state_management: "${stack.stateManager}"
  forms_and_validation: "${stack.formValidation}"
  styling_system: "${stack.styling}"

anti_patterns_excluded:
  - "generic_purple_gradient_backgrounds"
  - "pointless_lucide_icon_flooding"
  - "universal_scroll_fades"
  - "indiscriminate_glassmorphism"
  - "sub-4.5_contrast_ratios"
`;

    return {
      projectName: input.projectName,
      genomeYaml: yaml,
      recommendation: 'Save this content to design-genome.yaml and reference it as the project truth.'
    };
  } catch (error: any) {
    throw error;
  }
}
