import { z } from 'zod';
import { processTasteSeed } from '../taste/seeder';
import { getLocalConsent } from '../taste/consent';
import { D1DatabaseLike } from '../taste/db';

export const seedTasteSchema = z.object({
  archetype: z.string().describe('Frontend archetype (e.g. SaaS Landing, Portfolio, Documentation, E-Commerce, 3D Canvas).'),
  movement: z.string().describe('Aesthetic movement name (e.g. Swiss International, Obsidian Precision, CRT Phosphor, Warm Editorial).'),
  typographyTokens: z.object({
    displayFont: z.string().describe('Display headline font family.'),
    bodyFont: z.string().describe('Body paragraph font family.'),
    accentFont: z.string().optional().describe('Optional accent font family.'),
    modularScaleRatio: z.number().default(1.25).describe('Modular scale ratio (e.g. 1.25 for Major Third, 1.333 for Perfect Fourth).'),
    tracking: z.string().default('-0.02em').describe('Letter spacing value.')
  }).describe('Typography tokens to seed.'),
  paletteTokens: z.object({
    primary: z.string().describe('Primary brand hex color.'),
    secondary: z.string().describe('Secondary hex color.'),
    surface: z.string().describe('Background surface hex color.'),
    accent: z.string().describe('Interactive accent hex color.'),
    muted: z.string().describe('Subtle muted hex color.'),
    border: z.string().describe('Card/panel border hex color.')
  }).describe('Color palette tokens to seed.'),
  layoutTokens: z.object({
    geometryType: z.string().describe('Layout geometry archetype (e.g. Bento Grid, Editorial Columns, Full-bleed Hero).'),
    gridColumns: z.number().optional().describe('Number of grid columns.'),
    bentoLayout: z.boolean().optional().describe('Whether bento box cards are used.'),
    aspectRatio: z.string().optional().describe('Hero aspect ratio.')
  }).describe('Layout structure tokens.'),
  motionTokens: z.object({
    physics: z.string().describe('Motion physics style (e.g. Spring damping, Snappy ease-out).'),
    durationMs: z.number().describe('Base transition duration in milliseconds.'),
    easing: z.string().describe('CSS cubic-bezier curve string.')
  }).optional().describe('Optional motion tokens.'),
  uisfxTokens: z.object({
    frequencies: z.array(z.number()).describe('Web Audio oscillator frequencies in Hz.'),
    oscillator: z.string().describe('Oscillator wave type (sine, triangle, square).'),
    gain: z.number().describe('Gain level between 0.01 and 0.1.'),
    style: z.string().describe('Sensory style description.')
  }).optional().describe('Optional micro-interaction audio cues.'),
  consentGiven: z.boolean().optional().describe('Explicit user consent to anonymously contribute tokens to the public taste swarm.')
});

export type SeedTasteInput = z.input<typeof seedTasteSchema>;

export async function handleSeedTaste(
  input: SeedTasteInput,
  db?: D1DatabaseLike
) {
  try {
    const validated = seedTasteSchema.parse(input);

    // Consent verification gate
    const hasConsent = validated.consentGiven ?? getLocalConsent();
    if (!hasConsent) {
      return {
        status: 'skipped_no_consent',
        message: 'Consent was not granted for public swarm seeding. Design tokens remain private and local to your environment.',
        consentRequirement: 'Set consentGiven=true or configure .pixassorc.json with {"swarmOptIn": true} to seed tokens.',
        seed: null
      };
    }

    const result = await processTasteSeed(
      {
        archetype: validated.archetype,
        movement: validated.movement,
        typographyTokens: validated.typographyTokens,
        paletteTokens: validated.paletteTokens,
        layoutTokens: validated.layoutTokens,
        motionTokens: validated.motionTokens,
        uisfxTokens: validated.uisfxTokens
      },
      db
    );

    return {
      status: 'seeded',
      message: 'Design tokens successfully evaluated and seeded to the Pixasso Taste Swarm.',
      seedId: result.seed.id,
      seedHash: result.seed.seedHash,
      qualityScore: result.seed.qualityScore,
      noveltyScore: result.seed.noveltyScore,
      savedToCloudflareD1: result.savedToD1,
      savedToLocalGraph: result.savedToMemory,
      anonymizedTokens: {
        typography: `${result.seed.typographyTokens.displayFont} / ${result.seed.typographyTokens.bodyFont}`,
        palette: result.seed.paletteTokens,
        geometry: result.seed.layoutTokens.geometryType
      }
    };
  } catch (err: any) {
    return {
      status: 'error',
      message: 'Failed to seed design tokens: ' + (err?.message || String(err)),
      seed: null
    };
  }
}
