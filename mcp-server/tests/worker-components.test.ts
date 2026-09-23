import assert from 'node:assert';
import { checkAndIncrementRateLimit } from '../src/rateLimiter';

console.log('=== RUNNING WORKER COMPONENTS & RATE LIMITER TESTS ===\n');

// Mock KVNamespace for testing rate limiting logic in Node.js
class MockKV {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async put(key: string, value: string, _options?: any): Promise<void> {
    this.store.set(key, value);
  }
}

async function runTests() {
  console.log('--- Test 1: Daily Rate Limiter Progression ---');
  const mockKv = new MockKV() as any;
  const user = 'test-designer';
  const maxLimit = 5;

  for (let i = 1; i <= maxLimit; i++) {
    const result = await checkAndIncrementRateLimit(mockKv, user, maxLimit);
    assert.strictEqual(result.allowed, true, `Call ${i} should be allowed`);
    assert.strictEqual(result.currentCount, i, `Count should be ${i}`);
  }
  console.log(`-> Successfully executed ${maxLimit} allowed calls.`);

  console.log('\n--- Test 2: Rate Limit Rejection when Exceeded ---');
  const blockedResult = await checkAndIncrementRateLimit(mockKv, user, maxLimit);
  assert.strictEqual(blockedResult.allowed, false, 'Call beyond max should be blocked');
  assert.strictEqual(blockedResult.currentCount, maxLimit, `Count should remain at ${maxLimit}`);
  assert(blockedResult.resetsAt.length > 0, 'Reset timestamp should be returned');
  console.log(`-> Call ${maxLimit + 1} correctly rejected with reset time ${blockedResult.resetsAt}.`);

  console.log('\n--- Test 3: Separate Users Have Independent Budgets ---');
  const otherUserResult = await checkAndIncrementRateLimit(mockKv, 'another-user', maxLimit);
  assert.strictEqual(otherUserResult.allowed, true, 'Different user should have their own allowance');
  assert.strictEqual(otherUserResult.currentCount, 1, 'Different user count should start at 1');
  console.log('-> Independent user budget isolation confirmed.');

  console.log('\n=== ALL WORKER COMPONENT TESTS PASSED CLEANLY ===');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
