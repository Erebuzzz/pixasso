import assert from 'assert';
import {
  generateCSRFProtection,
  validateCSRFToken,
  createOAuthState,
  bindStateToSession,
  validateOAuthState,
  OAuthError
} from '../src/workers-oauth-utils';

class MockKV {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async put(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

async function runOAuthCsrfTests() {
  console.log('=== RUNNING OAUTH & CSRF SECURITY VERIFICATION ===\n');

  // 1. Verify CSRF Token Generation
  const { token, setCookie } = generateCSRFProtection();
  assert(token.length > 10, 'CSRF token should be non-empty');
  assert(setCookie.includes('__Host-CSRF_TOKEN='), 'Set-Cookie should contain __Host-CSRF_TOKEN');
  assert(setCookie.includes('HttpOnly'), 'Set-Cookie should include HttpOnly');
  assert(setCookie.includes('Secure'), 'Set-Cookie should include Secure');

  // 2. Verify CSRF Token Validation
  const validForm = new FormData();
  validForm.append('csrf_token', token);
  const reqWithCookie = new Request('https://mcp.pixasso.erebuzzz.tech/authorize', {
    method: 'POST',
    headers: {
      Cookie: `__Host-CSRF_TOKEN=${token}`
    }
  });

  const { clearCookie } = validateCSRFToken(validForm, reqWithCookie);
  assert(clearCookie.includes('Max-Age=0'), 'clearCookie should invalidate cookie');
  console.log('Test 1: CSRF token matching and clearing verified');

  // 3. Verify CSRF Mismatch Rejection
  const invalidForm = new FormData();
  invalidForm.append('csrf_token', 'wrong-token');
  assert.throws(
    () => validateCSRFToken(invalidForm, reqWithCookie),
    (err: any) => err instanceof OAuthError && err.code === 'invalid_request' && err.description === 'CSRF token mismatch'
  );
  console.log('Test 2: CSRF token mismatch correctly rejected');

  // 4. Verify Multiple Cookie Tolerance
  const reqWithMultipleCookies = new Request('https://mcp.pixasso.erebuzzz.tech/authorize', {
    method: 'POST',
    headers: {
      Cookie: `__Host-CSRF_TOKEN=stale-token; other_cookie=xyz; __Host-CSRF_TOKEN=${token}`
    }
  });
  const resMulti = validateCSRFToken(validForm, reqWithMultipleCookies);
  assert(resMulti.clearCookie.includes('Max-Age=0'), 'Should find matching token even with multiple cookies');
  console.log('Test 3: Multiple cookie tolerance verified');

  // 5. Verify OAuth State Flow with KV & Session Binding
  const mockKV = new MockKV() as any;
  const oauthReqInfo = {
    clientId: 'test-client-gemini',
    redirectUri: 'http://localhost:8080/callback',
    responseType: 'code',
    scope: ['mcp:read']
  };

  const { stateToken } = await createOAuthState(oauthReqInfo as any, mockKV);
  const { setCookie: sessionCookie } = await bindStateToSession(stateToken);

  const hashMatch = sessionCookie.match(/__Host-CONSENTED_STATE=([^;]+)/);
  assert(hashMatch, 'Session cookie should have hash');
  const sessionHash = hashMatch[1];

  const callbackReq = new Request(`https://mcp.pixasso.erebuzzz.tech/callback?state=${stateToken}`, {
    headers: {
      Cookie: `__Host-CONSENTED_STATE=${sessionHash}`
    }
  });

  const validated = await validateOAuthState(callbackReq, mockKV);
  assert.strictEqual(validated.oauthReqInfo.clientId, 'test-client-gemini', 'State validation should return original request');

  const postDelete = await mockKV.get(`oauth:state:${stateToken}`);
  assert.strictEqual(postDelete, null, 'State should be deleted after one-time use');
  console.log('Test 4: OAuth state one-time consumption and session binding verified');

  // 6. Verify State Tampering Rejection
  await mockKV.put(`oauth:state:${stateToken}`, JSON.stringify(oauthReqInfo));
  const tamperedCallbackReq = new Request(`https://mcp.pixasso.erebuzzz.tech/callback?state=${stateToken}`, {
    headers: {
      Cookie: `__Host-CONSENTED_STATE=tampered_hash`
    }
  });

  await assert.rejects(
    async () => validateOAuthState(tamperedCallbackReq, mockKV),
    (err: any) => err instanceof OAuthError && err.description.includes('State token does not match session')
  );
  console.log('Test 5: Tampered session hash correctly rejected');

  console.log('\n=== ALL OAUTH & CSRF SECURITY TESTS PASSED ===');
}

runOAuthCsrfTests().catch((err) => {
  console.error('Test failure:', err);
  process.exit(1);
});
