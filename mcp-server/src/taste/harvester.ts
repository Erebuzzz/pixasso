import { D1DatabaseLike, compileSwarmBundle, upsertTasteNode } from './db';
import { getTasteGraph } from './graph';

export interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: any): Promise<void>;
}

export interface HarvesterResult {
  nodesRefreshed: number;
  swarmBundled: number;
  durationMs: number;
}

export async function runTasteHarvester(
  db?: D1DatabaseLike,
  kv?: KVNamespaceLike
): Promise<HarvesterResult> {
  const start = Date.now();
  let nodesRefreshed = 0;
  let swarmBundled = 0;

  try {
    const graph = getTasteGraph();
    const foundationalNodes = graph.getAllNodes();

    // If D1 is provided, sync foundational nodes to ensure D1 has base knowledge
    if (db) {
      for (const node of foundationalNodes) {
        await upsertTasteNode(db, node);
        nodesRefreshed++;
      }

      // Compile top swarm bundle
      const bundle = await compileSwarmBundle(db, 50);
      swarmBundled = bundle.count;

      // If KV is available, cache the compiled swarm bundle for edge distribution
      if (kv) {
        await kv.put('taste:swarm:bundle', JSON.stringify(bundle), {
          expirationTtl: 86400 // 24 hours
        });
      }
    } else {
      nodesRefreshed = foundationalNodes.length;
    }
  } catch (err: any) {
    console.warn('[Harvester] Run encountered an issue:', err?.message || err);
  }

  return {
    nodesRefreshed,
    swarmBundled,
    durationMs: Date.now() - start
  };
}
