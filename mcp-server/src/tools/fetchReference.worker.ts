import { z } from 'zod';
import { recordVerifiedFetch, VerifiedFetchEntry } from './referenceCache';

export const fetchReferenceSchema = z.object({
  url: z.string().url().describe('Target HTTP or HTTPS URL to fetch and analyze.'),
  focus: z.enum(['full', 'layout', 'typography', 'color', 'motion'])
    .optional()
    .default('full')
    .describe('Analytical focus area.')
});

export type FetchReferenceInput = z.infer<typeof fetchReferenceSchema>;

export interface FetchReferenceResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  contentHash: string;
  renderedContentDetected: boolean;
  bodyCharacterCount: number;
  title: string;
  description: string;
  headings: Array<{ level: string; text: string }>;
  links: string[];
  readableText: string;
  advisoryNotice?: string;
}

export async function handleFetchReferenceWorker(input: FetchReferenceInput): Promise<FetchReferenceResult> {
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
      throw new Error(`Failed to fetch reference URL "${targetUrl}": ${err.message || String(err)}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} (${response.statusText}) when requesting reference: ${targetUrl}`);
    }

    const finalUrl = response.url || targetUrl;
    const fetchedAt = new Date().toISOString();


  let title = '';
  let ogTitle = '';
  let metaDescription = '';
  let ogDescription = '';
  const headings: Array<{ level: string; text: string }> = [];
  const links: string[] = [];
  const textChunks: string[] = [];

  let currentHeadingLevel = '';
  let currentHeadingText = '';
  let currentLinkText = '';

  const rewriter = new HTMLRewriter()
    .on('title', {
      text(text) {
        title += text.text;
      }
    })
    .on('meta[property="og:title"]', {
      element(el) {
        const val = el.getAttribute('content');
        if (val && !ogTitle) ogTitle = val.trim();
      }
    })
    .on('meta[name="description"]', {
      element(el) {
        const val = el.getAttribute('content');
        if (val && !metaDescription) metaDescription = val.trim();
      }
    })
    .on('meta[property="og:description"]', {
      element(el) {
        const val = el.getAttribute('content');
        if (val && !ogDescription) ogDescription = val.trim();
      }
    })
    .on('h1, h2, h3, h4', {
      element(el) {
        currentHeadingLevel = el.tagName.toLowerCase();
        currentHeadingText = '';
      },
      text(text) {
        currentHeadingText += text.text;
        if (text.lastInTextNode) {
          const trimmed = currentHeadingText.replace(/\s+/g, ' ').trim();
          if (trimmed && headings.length < 50) {
            headings.push({ level: currentHeadingLevel, text: trimmed });
          }
          currentHeadingText = '';
        }
      }
    })
    .on('a', {
      element() {
        currentLinkText = '';
      },
      text(text) {
        currentLinkText += text.text;
        if (text.lastInTextNode) {
          const trimmed = currentLinkText.replace(/\s+/g, ' ').trim();
          if (trimmed && trimmed.length > 2 && links.length < 25 && !links.includes(trimmed)) {
            links.push(trimmed);
          }
          currentLinkText = '';
        }
      }
    })
    .on('p, article, section, main, li', {
      text(text) {
        const clean = text.text.replace(/\s+/g, ' ');
        if (clean.trim()) {
          textChunks.push(clean);
        }
      }
    });

  const transformedResponse = rewriter.transform(response);
  await transformedResponse.text();

  const finalTitle = title.trim() || ogTitle || new URL(finalUrl).hostname;
  const finalDescription = metaDescription || ogDescription || '';
  const readableText = textChunks.join(' ').replace(/\s+/g, ' ').trim();
  const bodyLength = readableText.length;
  const renderedContentDetected = bodyLength >= 200;

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(targetUrl + finalUrl + readableText)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);

  const resultEntry: VerifiedFetchEntry = {
    url: targetUrl,
    finalUrl,
    fetchedAt,
    contentHash,
    renderedContentDetected,
    charCount: bodyLength
  };

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
      title: finalTitle,
      description: finalDescription,
      headings,
      links,
      readableText: readableText.slice(0, 4000),
      advisoryNotice
    };
  } catch (error: any) {
    throw new Error('Failed to fetch reference: ' + error.message);
  }
}

