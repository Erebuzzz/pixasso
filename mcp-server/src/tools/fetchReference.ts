import { z } from 'zod';
import crypto from 'crypto';
import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';

export const fetchReferenceSchema = z.object({
  url: z.string().url().describe('Target HTTP or HTTPS URL to fetch and analyze.'),
  focus: z.enum(['full', 'layout', 'typography', 'color', 'motion'])
    .optional()
    .default('full')
    .describe('Analytical focus area.')
});

export type FetchReferenceInput = z.infer<typeof fetchReferenceSchema>;

export {
  VerifiedFetchEntry,
  verifiedFetchCache,
  normalizeUrlKey,
  isUrlVerifiedInSession,
  getVerifiedFetchEntry,
  recordVerifiedFetch
} from './referenceCache';

import { recordVerifiedFetch, VerifiedFetchEntry } from './referenceCache';

export async function handleFetchReference(input: FetchReferenceInput) {
  try {
    const validated = fetchReferenceSchema.parse(input);
    const targetUrl = validated.url.trim();

    let response: Response;
    try {
      response = await fetch(targetUrl, {
        signal: AbortSignal.timeout(12000),
        headers: {
          'User-Agent': 'Pixasso-Reference-Fetcher/1.0 (+https://pixasso.erebuzzz.tech; reference deconstruction engine)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        redirect: 'follow'
      });
    } catch (err: any) {
      if (err.name === 'TimeoutError') {
        throw new Error(`Connection timed out after 12s while fetching reference: ${targetUrl}`);
      }
      throw new Error(`Network failure while fetching reference ${targetUrl}: ${err.message || String(err)}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} (${response.statusText}) when requesting reference: ${targetUrl}`);
    }

    const finalUrl = response.url || targetUrl;
    const html = await response.text();

    if (!html || html.trim().length === 0) {
      throw new Error(`Received empty response body from: ${finalUrl}`);
    }

    const contentHash = crypto.createHash('sha256').update(html).digest('hex').substring(0, 16);
    const fetchedAt = new Date().toISOString();


  // Parse DOM with linkedom
  const { document } = parseHTML(html);

  // 1. Title extraction
  const title = (
    document.querySelector('title')?.textContent?.trim() ||
    document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() ||
    document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')?.trim() ||
    ''
  );

  // 2. Meta description extraction
  const description = (
    document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ||
    document.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() ||
    document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')?.trim() ||
    ''
  );

  // 3. Heading structure in document order (h1 through h4)
  const headingNodes = document.querySelectorAll('h1, h2, h3, h4');
  const headings: Array<{ level: string; text: string }> = [];
  headingNodes.forEach((node: any) => {
    const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length > 0) {
      headings.push({
        level: (node.tagName || '').toLowerCase(),
        text: text.slice(0, 140)
      });
    }
  });

  // 4. Sample visible links
  const linkNodes = document.querySelectorAll('a[href]');
  const seenLinks = new Set<string>();
  const linksSample: string[] = [];
  linkNodes.forEach((a: any) => {
    const linkText = (a.textContent || '').replace(/\s+/g, ' ').trim();
    const href = (a.getAttribute('href') || '').trim();
    if (
      linkText.length > 1 &&
      !href.startsWith('#') &&
      !href.startsWith('javascript:') &&
      !seenLinks.has(linkText)
    ) {
      seenLinks.add(linkText);
      linksSample.push(linkText.slice(0, 60));
    }
  });

  // 5. Readability / text extraction
  let extractedBodyText = '';
  try {
    const reader = new Readability(document as any);
    const parsedArticle = reader.parse();
    if (parsedArticle && parsedArticle.textContent) {
      extractedBodyText = parsedArticle.textContent.replace(/\s+/g, ' ').trim();
    }
  } catch {
    // Fallback if readability parsing throws on non-standard markup
  }

  if (!extractedBodyText) {
    // Secondary fallback: strip script, style, svg, noscript, and get body text
    document.querySelectorAll('script, style, svg, noscript, nav, footer').forEach((el: any) => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    extractedBodyText = (document.body?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  // SPA detection: Under 200 characters of readable body text implies client-rendered shell
  const bodyLength = extractedBodyText.length;
  const renderedContentDetected = bodyLength >= 200;

  const resultEntry: VerifiedFetchEntry = {
    url: targetUrl,
    finalUrl,
    fetchedAt,
    contentHash,
    renderedContentDetected,
    charCount: bodyLength
  };

  // Record into verification cache (both raw and normalized keys)
  recordVerifiedFetch(resultEntry);

  let advisoryNotice: string | undefined;
  if (!renderedContentDetected) {
    advisoryNotice = (
      'Client-rendered single-page application (SPA) detected with under 200 characters of body text. ' +
      'The initial HTTP response contains an empty JavaScript mount container (such as a Framer, Webflow, or React shell). ' +
      'Do NOT fabricate or hallucinate visual, color, or structural claims from the URL or domain name alone. ' +
      'To analyze this site, use an active headless-browser MCP tool (such as chrome-devtools-mcp or browser-use) ' +
      'to inspect the rendered DOM, or ask the user directly for a screenshot or design tokens.'
    );
  }

    return {
      url: targetUrl,
      finalUrl,
      fetchedAt,
      contentHash,
      renderedContentDetected,
      bodyCharacterCount: bodyLength,
      title,
      description,
      headings: headings.slice(0, 30),
      linksSample: linksSample.slice(0, 25),
      extractedTextSample: extractedBodyText.slice(0, 1500),
      focus: input.focus,
      advisoryNotice,
      epistemicStatus: renderedContentDetected ? 'known' : 'unavailable',
      capabilitiesNote: (
        'This tool extracts server-rendered textual and semantic heading content via static HTTP fetch. ' +
        'It cannot evaluate computed CSS, layout geometry, rendered typography styles, or WebGL/canvas scenes. ' +
        'For visual styling, use headless browser tools with rendered DOM inspection or request user screenshots.'
      )
    };
  } catch (error: any) {
    throw new Error('Failed to fetch reference: ' + error.message);
  }
}

