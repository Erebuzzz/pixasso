import { REFERENCE_CATALOGS, TEMPLATE_CATALOGS, readCatalogContent } from '../data/catalogs';

export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export function listAllResources(): MCPResource[] {
  const references: MCPResource[] = REFERENCE_CATALOGS.map(item => ({
    uri: `pixasso://references/${item.id}`,
    name: `Reference: ${item.name}`,
    description: item.description,
    mimeType: 'text/markdown'
  }));

  const templates: MCPResource[] = TEMPLATE_CATALOGS.map(item => ({
    uri: `pixasso://templates/${item.id}`,
    name: `Template: ${item.name}`,
    description: item.description,
    mimeType: item.filename.endsWith('.yaml') ? 'text/yaml' : 'text/markdown'
  }));

  return [...references, ...templates];
}

export function readResourceByUri(uri: string): { uri: string; mimeType: string; text: string } | null {
  const refMatch = uri.match(/^pixasso:\/\/references\/([a-zA-Z0-9_-]+)$/);
  if (refMatch) {
    const id = refMatch[1];
    const item = REFERENCE_CATALOGS.find(r => r.id === id);
    if (item) {
      const content = readCatalogContent('references', item.filename);
      return {
        uri,
        mimeType: 'text/markdown',
        text: content
      };
    }
  }

  const tmplMatch = uri.match(/^pixasso:\/\/templates\/([a-zA-Z0-9_-]+)$/);
  if (tmplMatch) {
    const id = tmplMatch[1];
    const item = TEMPLATE_CATALOGS.find(t => t.id === id);
    if (item) {
      const content = readCatalogContent('templates', item.filename);
      return {
        uri,
        mimeType: item.filename.endsWith('.yaml') ? 'text/yaml' : 'text/markdown',
        text: content
      };
    }
  }

  return null;
}
