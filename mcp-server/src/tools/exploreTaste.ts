import { z } from 'zod';
import { getTasteGraph } from '../taste/graph';
import { D1DatabaseLike, queryTasteSeeds } from '../taste/db';
import { TasteNode, TasteSeed } from '../taste/types';

export const exploreTasteSchema = z.object({
  query: z.string().optional().describe('Keyword or aesthetic concept to explore (e.g. brutalism, luxury, dark mode, phosphor, editorial, minimal).'),
  movement: z.string().optional().describe('Specific movement filter (e.g. Swiss International, Warm Editorial, Obsidian Precision, CRT Phosphor).'),
  archetype: z.string().optional().describe('Filter by frontend archetype (e.g. SaaS Landing, Developer Docs, WebGL 3D Portfolio, Fintech Dashboard).'),
  includeSwarm: z.boolean().optional().default(true).describe('Whether to query community seeds from the decentralized Taste Swarm alongside foundational movements.'),
  limit: z.number().optional().default(5).describe('Maximum number of taste candidates to return.')
});

export type ExploreTasteInput = z.input<typeof exploreTasteSchema>;

export async function handleExploreTaste(
  input: ExploreTasteInput,
  db?: D1DatabaseLike
) {
  try {
    const validated = exploreTasteSchema.parse(input);
    const { query, movement, archetype, includeSwarm = true, limit = 5 } = validated;

    const graph = getTasteGraph();
    const foundationalNodes: TasteNode[] = graph.search(query, movement);

    let swarmSeeds: TasteSeed[] = [];
    if (includeSwarm) {
      if (db) {
        swarmSeeds = await queryTasteSeeds(db, {
          archetype,
          movement,
          minQuality: 0.7,
          limit
        });
      } else {
        swarmSeeds = graph.getSeeds(archetype, movement, limit);
      }
    }

    const curatedCandidates = foundationalNodes.slice(0, limit).map(node => ({
      id: node.id,
      name: node.name,
      movement: node.movement,
      description: node.description,
      groundTone: node.groundTone,
      typography: {
        display: node.typography.displayFont,
        body: node.typography.bodyFont,
        modularScaleRatio: node.typography.modularScaleRatio,
        tracking: node.typography.tracking
      },
      palette: node.palette,
      layoutGeometry: node.layoutGeometry,
      motionSignature: node.motionSignature,
      uisfx: node.uisfx,
      tags: node.tags,
      source: 'curated-graph' as const
    }));

    const swarmCandidates = swarmSeeds.slice(0, limit).map(seed => ({
      id: seed.id,
      name: `${seed.movement} (${seed.archetype})`,
      movement: seed.movement,
      description: `Community-seeded aesthetic tokens for ${seed.archetype} with quality score ${seed.qualityScore}.`,
      groundTone: seed.paletteTokens.surface,
      typography: {
        display: seed.typographyTokens.displayFont,
        body: seed.typographyTokens.bodyFont,
        modularScaleRatio: seed.typographyTokens.modularScaleRatio,
        tracking: seed.typographyTokens.tracking
      },
      palette: seed.paletteTokens,
      layoutGeometry: seed.layoutTokens.geometryType,
      motionSignature: seed.motionTokens?.physics || 'Standard ease-out',
      uisfx: seed.uisfxTokens,
      qualityScore: seed.qualityScore,
      upvotes: seed.upvotes,
      source: 'taste-swarm' as const
    }));

    return {
      query: query || null,
      movementFilter: movement || null,
      archetypeFilter: archetype || null,
      totalFound: curatedCandidates.length + swarmCandidates.length,
      curatedMovements: curatedCandidates,
      swarmSeeds: swarmCandidates,
      recommendedPairing: curatedCandidates[0] || swarmCandidates[0] || null
    };
  } catch (err: any) {
    return {
      error: 'Failed to explore taste candidates: ' + (err?.message || String(err)),
      curatedMovements: [],
      swarmSeeds: []
    };
  }
}
