import { z } from 'zod';
import { REFERENCE_CATALOGS, TEMPLATE_CATALOGS, readCatalogContent } from '../data/catalogs';

export const searchReferencesSchema = z.object({
  query: z.string().describe('Keywords to search across the design references, templates, and 16 frontend pillars.'),
  category: z.enum(['all', 'reference', 'template']).optional().default('all'),
  tag: z.string().optional().describe('Filter specifically by tag (e.g. typography, motion, a11y, 3d, components).')
});

export type SearchReferencesInput = z.infer<typeof searchReferencesSchema>;

export function handleSearchReferences(input: SearchReferencesInput) {
  try {
    const validated = searchReferencesSchema.parse(input);
    const { query, category = 'all', tag } = validated;
    const q = query.toLowerCase().trim();


    let pool = [
      ...(category === 'template' ? [] : REFERENCE_CATALOGS),
      ...(category === 'reference' ? [] : TEMPLATE_CATALOGS)
    ];

    if (tag) {
      const filterTag = tag.toLowerCase().trim();
      pool = pool.filter(item => item.tags.some(t => t.toLowerCase().includes(filterTag)));
    }

    const results = pool
      .map(item => {
        let score = 0;
        if (item.id.toLowerCase().includes(q)) score += 10;
        if (item.name.toLowerCase().includes(q)) score += 8;
        if (item.description.toLowerCase().includes(q)) score += 5;
        if (item.tags.some(t => t.toLowerCase().includes(q))) score += 6;

        const content = readCatalogContent(item.category === 'reference' ? 'references' : 'templates', item.filename);
        if (content.toLowerCase().includes(q)) {
          score += 3;
        }

        return {
          item,
          score,
          uri: `pixasso://${item.category === 'reference' ? 'references' : 'templates'}/${item.id}`
        };
      })
      .filter(r => (q === '' ? true : r.score > 0))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return {
      query,
      totalFound: results.length,
      results: results.map(r => ({
        id: r.item.id,
        name: r.item.name,
        category: r.item.category,
        description: r.item.description,
        tags: r.item.tags,
        uri: r.uri,
        relevanceScore: r.score
      }))
    };
  } catch (error: any) {
    throw new Error('Failed to search references: ' + error.message);
  }
}
