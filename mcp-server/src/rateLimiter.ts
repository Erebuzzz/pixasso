export interface RateLimitCheckResult {
  allowed: boolean;
  currentCount: number;
  maxAllowed: number;
  resetsAt: string;
}

export interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export async function checkAndIncrementRateLimit(
  kv: KVLike | undefined,
  userId: string,
  maxDaily: number = 200
): Promise<RateLimitCheckResult> {
  const now = new Date();
  const utcDate = now.toISOString().slice(0, 10);
  const resetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const resetsAt = resetDate.toISOString();

  const key = `ratelimit:${userId}:${utcDate}`;

  if (!kv) {
    return {
      allowed: true,
      currentCount: 1,
      maxAllowed: maxDaily,
      resetsAt
    };
  }

  const existing = await kv.get(key);
  const currentCount = existing ? parseInt(existing, 10) : 0;

  if (currentCount >= maxDaily) {
    return {
      allowed: false,
      currentCount,
      maxAllowed: maxDaily,
      resetsAt
    };
  }

  const newCount = currentCount + 1;
  // TTL of 2 days (172800 seconds) so expired keys are automatically pruned
  await kv.put(key, newCount.toString(), { expirationTtl: 172800 });

  return {
    allowed: true,
    currentCount: newCount,
    maxAllowed: maxDaily,
    resetsAt
  };
}
