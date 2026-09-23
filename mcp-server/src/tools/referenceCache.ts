export interface VerifiedFetchEntry {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  contentHash: string;
  renderedContentDetected: boolean;
  charCount: number;
}

// Session-level verification cache to enforce AUDIT-02 hard gate across all transports
export const verifiedFetchCache = new Map<string, VerifiedFetchEntry>();

export function normalizeUrlKey(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    // Normalize protocol, host, and pathname (strip trailing slash)
    const pathname = parsed.pathname.endsWith('/') && parsed.pathname.length > 1
      ? parsed.pathname.slice(0, -1)
      : parsed.pathname;
    return `${parsed.protocol}//${parsed.host}${pathname}`.toLowerCase();
  } catch {
    return rawUrl.trim().toLowerCase();
  }
}

export function isUrlVerifiedInSession(rawUrl: string): boolean {
  const key = normalizeUrlKey(rawUrl);
  return verifiedFetchCache.has(key);
}

export function getVerifiedFetchEntry(rawUrl: string): VerifiedFetchEntry | undefined {
  const key = normalizeUrlKey(rawUrl);
  return verifiedFetchCache.get(key);
}

export function recordVerifiedFetch(entry: VerifiedFetchEntry): void {
  const initialKey = normalizeUrlKey(entry.url);
  const finalKey = normalizeUrlKey(entry.finalUrl);
  verifiedFetchCache.set(initialKey, entry);
  verifiedFetchCache.set(finalKey, entry);
}
