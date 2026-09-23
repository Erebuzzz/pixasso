import { env } from 'cloudflare:workers';
import type { AuthRequest, OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import { Hono } from 'hono';
import { Octokit } from 'octokit';
import { fetchUpstreamAuthToken, getUpstreamAuthorizeUrl, GitHubAuthProps } from './utils';
import {
  addApprovedClient,
  bindStateToSession,
  createOAuthState,
  generateCSRFProtection,
  isClientApproved,
  OAuthError,
  renderApprovalDialog,
  validateCSRFToken,
  validateOAuthState
} from './workers-oauth-utils';

export type WorkerEnv = {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  COOKIE_ENCRYPTION_KEY: string;
  OAUTH_KV: KVNamespace;
  OAUTH_PROVIDER: OAuthHelpers;
  PIXASSO_MCP_OBJECT: DurableObjectNamespace;
};

const app = new Hono<{ Bindings: WorkerEnv }>();

app.get('/', (c) => {
  const mcpUrl = new URL('/mcp', c.req.url).href;
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="paper">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Pixasso Remote MCP: Hosted Frontend Engineering & Design Orchestrator</title>
  <link rel="icon" type="image/svg+xml" href="https://pixasso.erebuzzz.tech/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="https://pixasso.erebuzzz.tech/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --font-display: 'Syne', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-serif: 'Newsreader', Georgia, serif;
      --font-mono: 'JetBrains Mono', monospace;

      /* Paper Theme (Default Light) */
      --bg: #fbfaf7;
      --bg-surface: #ffffff;
      --bg-elevated: #f4f2ec;
      --ink-primary: #191919;
      --ink-secondary: #575752;
      --ink-muted: #8c8c82;
      --border: rgba(25, 25, 25, 0.12);
      --border-accent: #191919;
      --accent: #191919;
      --accent-glow: rgba(0, 0, 0, 0.08);
      --dot-grid: rgba(25, 25, 25, 0.07);
      --green: #15803d;
      --green-bg: rgba(21, 128, 61, 0.1);

      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-full: 9999px;
    }

    [data-theme="crt"] {
      --bg: #090d0b;
      --bg-surface: #0d1410;
      --bg-elevated: #131c17;
      --ink-primary: #33ff66;
      --ink-secondary: rgba(51, 255, 102, 0.75);
      --ink-muted: rgba(51, 255, 102, 0.45);
      --border: rgba(51, 255, 102, 0.25);
      --border-accent: #33ff66;
      --accent: #33ff66;
      --accent-glow: rgba(51, 255, 102, 0.25);
      --dot-grid: rgba(51, 255, 102, 0.08);
      --green: #33ff66;
      --green-bg: rgba(51, 255, 102, 0.15);
    }

    [data-theme="amoled"] {
      --bg: #000000;
      --bg-surface: #0a0a0c;
      --bg-elevated: #121216;
      --ink-primary: #ffffff;
      --ink-secondary: #a1a1aa;
      --ink-muted: #52525b;
      --border: rgba(255, 255, 255, 0.12);
      --border-accent: #ffffff;
      --accent: #3b82f6;
      --accent-glow: rgba(59, 130, 246, 0.2);
      --dot-grid: rgba(255, 255, 255, 0.06);
      --green: #10b981;
      --green-bg: rgba(16, 185, 129, 0.15);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      background-image: radial-gradient(circle, var(--dot-grid) 1px, transparent 1px);
      background-size: 24px 24px;
      color: var(--ink-primary);
      font-family: var(--font-display);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    header {
      width: 100%;
      max-width: 1024px;
      padding: 1.5rem 1.5rem 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }

    .brand-title {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
    }

    .brand-tag {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border);
      color: var(--ink-secondary);
      background: var(--bg-elevated);
    }

    .theme-switch {
      display: flex;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      padding: 3px;
      gap: 2px;
    }

    .theme-btn {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      padding: 0.25rem 0.65rem;
      border: none;
      border-radius: var(--radius-full);
      background: transparent;
      color: var(--ink-muted);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .theme-btn.active {
      background: var(--accent);
      color: var(--bg);
      font-weight: 600;
    }

    main {
      width: 100%;
      max-width: 880px;
      padding: 2.5rem 1.5rem 4rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      background: var(--green-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--green);
      letter-spacing: 0.04em;
      width: fit-content;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 8px var(--green);
    }

    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.035em;
      margin: 0.5rem 0 0.25rem;
    }

    .hero-subtitle {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: clamp(1.1rem, 2.2vw, 1.4rem);
      color: var(--ink-secondary);
      line-height: 1.45;
      margin: 0;
    }

    .card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }

    .card-title {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--ink-muted);
      margin: 0 0 1rem;
    }

    .endpoint-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
    }

    .endpoint-url {
      font-family: var(--font-mono);
      font-size: 0.88rem;
      word-break: break-all;
      color: var(--ink-primary);
    }

    .btn {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border);
      background: var(--accent);
      color: var(--bg);
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.15s ease;
    }

    .btn:hover { opacity: 0.9; }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-top: 1.25rem;
    }

    .meta-item {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0.85rem 1rem;
    }

    .meta-label {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      text-transform: uppercase;
      color: var(--ink-muted);
      margin-bottom: 0.25rem;
    }

    .meta-value {
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--ink-primary);
    }

    /* Client Integration Tabs */
    .tab-bar {
      display: flex;
      border-bottom: 1px solid var(--border);
      gap: 0.5rem;
      margin-bottom: 1rem;
      overflow-x: auto;
    }

    .tab-btn {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      padding: 0.5rem 0.85rem;
      border: none;
      background: transparent;
      color: var(--ink-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.15s ease;
    }

    .tab-btn.active {
      color: var(--ink-primary);
      border-bottom-color: var(--accent);
      font-weight: 600;
    }

    .code-block {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      line-height: 1.5;
      overflow-x: auto;
      margin: 0;
      color: var(--ink-primary);
    }

    /* Tools Grid */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.75rem;
    }

    .tool-item {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0.85rem 1rem;
    }

    .tool-name {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--ink-primary);
      margin-bottom: 0.25rem;
    }

    .tool-desc {
      font-size: 0.76rem;
      color: var(--ink-secondary);
      line-height: 1.35;
    }

    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--ink-muted);
    }

    footer a {
      color: var(--ink-primary);
      text-decoration: none;
      font-weight: 600;
    }

    footer a:hover { text-decoration: underline; }

    @media (max-width: 640px) {
      .endpoint-box { flex-direction: column; align-items: stretch; }
      footer { flex-direction: column; gap: 0.75rem; align-items: flex-start; }
    }
  </style>
</head>
<body>
  <header>
    <a href="https://pixasso.erebuzzz.tech" class="brand-group" target="_blank" rel="noopener">
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="currentColor" fill-opacity="0.1"/>
        <path d="M14 14H34V22H14V14Z" fill="currentColor"/>
        <path d="M14 26H26V34H14V26Z" fill="currentColor"/>
        <circle cx="31" cy="30" r="4" fill="currentColor"/>
      </svg>
      <span class="brand-title">PIXASSO</span>
      <span class="brand-tag">Remote MCP</span>
    </a>

    <div class="theme-switch">
      <button class="theme-btn active" onclick="setTheme('paper')">Paper</button>
      <button class="theme-btn" onclick="setTheme('crt')">CRT</button>
      <button class="theme-btn" onclick="setTheme('amoled')">AMOLED</button>
    </div>
  </header>

  <main>
    <div>
      <div class="status-pill">
        <div class="status-dot"></div>
        CLOUDFLARE WORKERS · STREAMABLE HTTP ACTIVE
      </div>
      <h1 class="hero-title">Pixasso Remote MCP</h1>
      <p class="hero-subtitle">Hosted design research, intent discovery, and frontend architecture endpoint.</p>
    </div>

    <!-- Connection Box -->
    <div class="card">
      <div class="card-title">Remote MCP Streamable HTTP Endpoint</div>
      <div class="endpoint-box">
        <code class="endpoint-url" id="endpointUrl">${mcpUrl}</code>
        <button class="btn" id="copyBtn" onclick="copyUrl()">Copy URL</button>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">Protocol</div>
          <div class="meta-value">Streamable HTTP</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Authentication</div>
          <div class="meta-value">GitHub OAuth 2.1</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Scope</div>
          <div class="meta-value">read:user, user:email</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Daily Quota</div>
          <div class="meta-value">500 Calls / User / Day</div>
        </div>
      </div>
    </div>

    <!-- Client Integration Tabs -->
    <div class="card">
      <div class="card-title">Client Configuration Snippets</div>
      <div class="tab-bar">
        <button class="tab-btn active" onclick="showTab('cursor')">Cursor</button>
        <button class="tab-btn" onclick="showTab('claude-desktop')">Claude Desktop</button>
        <button class="tab-btn" onclick="showTab('claude-code')">Claude Code CLI</button>
        <button class="tab-btn" onclick="showTab('antigravity')">Antigravity / Gemini</button>
      </div>

      <div id="tab-cursor">
        <pre class="code-block"><code>// Add to ~/.cursor/mcp.json
{
  "mcpServers": {
    "pixasso-remote": {
      "url": "${mcpUrl}"
    }
  }
}</code></pre>
      </div>

      <div id="tab-claude-desktop" style="display: none;">
        <pre class="code-block"><code>// Add to claude_desktop_config.json
{
  "mcpServers": {
    "pixasso-remote": {
      "url": "${mcpUrl}"
    }
  }
}</code></pre>
      </div>

      <div id="tab-claude-code" style="display: none;">
        <pre class="code-block"><code># Run in terminal
claude mcp add pixasso-remote --transport http ${mcpUrl}</code></pre>
      </div>

      <div id="tab-antigravity" style="display: none;">
        <pre class="code-block"><code>// Add to ~/.gemini/antigravity/mcp_config.json
{
  "mcpServers": {
    "pixasso-remote": {
      "url": "${mcpUrl}"
    }
  }
}</code></pre>
      </div>
    </div>

    <!-- Registered 7 Tools -->
    <div class="card">
      <div class="card-title">Registered Architecture & Design Tools (7)</div>
      <div class="tools-grid">
        <div class="tool-item">
          <div class="tool-name">pixasso_discover_intent</div>
          <div class="tool-desc">Adaptive intent discovery across 16 pillars with interactive modal questions.</div>
        </div>
        <div class="tool-item">
          <div class="tool-name">pixasso_search_references</div>
          <div class="tool-desc">Search 31 deep design catalogs for typography, layouts, and shaders.</div>
        </div>
        <div class="tool-item">
          <div class="tool-name">pixasso_fetch_reference</div>
          <div class="tool-desc">Live streaming HTMLRewriter deconstruction and SPA shell detection.</div>
        </div>
        <div class="tool-item">
          <div class="tool-name">pixasso_generate_genome</div>
          <div class="tool-desc">Design token synthesis with programmatic reference verification gate.</div>
        </div>
        <div class="tool-item">
          <div class="tool-name">pixasso_generate_brain</div>
          <div class="tool-desc">Graphify Mermaid architectural decision graph and dependency Task DAG.</div>
        </div>
        <div class="tool-item">
          <div class="tool-name">pixasso_audit_design</div>
          <div class="tool-desc">5-pillar objective critique scorecard identifying generic AI tropes.</div>
        </div>
        <div class="tool-item">
          <div class="tool-name">pixasso_generate_test_plan</div>
          <div class="tool-desc">Multi-device automated QA matrix across 390px, 768px, and 1440px.</div>
        </div>
      </div>
    </div>

    <footer>
      <div>Pixasso &copy; 2026 Erebuzzz · MIT License</div>
      <div style="display: flex; gap: 1.25rem;">
        <a href="https://pixasso.erebuzzz.tech" target="_blank" rel="noopener">Showcase & Docs &rarr;</a>
        <a href="https://github.com/Erebuzzz/pixasso" target="_blank" rel="noopener">GitHub &rarr;</a>
        <a href="https://www.npmjs.com/package/pixasso-mcp" target="_blank" rel="noopener">npm Package &rarr;</a>
      </div>
    </footer>
  </main>

  <script>
    function setTheme(t) {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('pixasso-theme', t);
      document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === t);
      });
    }

    const savedTheme = localStorage.getItem('pixasso-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }

    function copyUrl() {
      const url = document.getElementById('endpointUrl').textContent;
      navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = originalText; }, 2000);
      });
    }

    function showTab(id) {
      ['cursor', 'claude-desktop', 'claude-code', 'antigravity'].forEach(name => {
        const el = document.getElementById('tab-' + name);
        if (el) el.style.display = (name === id) ? 'block' : 'none';
      });
      document.querySelectorAll('.tab-btn').forEach(btn => {
        const match = btn.textContent.toLowerCase().includes(id.split('-')[0]);
        btn.classList.toggle('active', match);
      });
    }
  </script>
</body>
</html>`;
  return c.html(html);
});

app.get('/favicon.ico', (c) => {
  return c.redirect('https://pixasso.erebuzzz.tech/favicon.png', 302);
});

app.get('/authorize', async (c) => {
  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);
  const { clientId } = oauthReqInfo;
  if (!clientId) {
    return c.text('Invalid request: Missing clientId', 400);
  }

  // Check if client is already approved
  if (await isClientApproved(c.req.raw, clientId, c.env.COOKIE_ENCRYPTION_KEY)) {
    const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);
    const { setCookie: sessionBindingCookie } = await bindStateToSession(stateToken);
    return redirectToGithub(c.req.raw, stateToken, { 'Set-Cookie': sessionBindingCookie }, c.env.GITHUB_CLIENT_ID);
  }

  // Generate CSRF protection for approval form
  const { token: csrfToken, setCookie } = generateCSRFProtection();

  return renderApprovalDialog(c.req.raw, {
    client: await c.env.OAUTH_PROVIDER.lookupClient(clientId),
    csrfToken,
    server: {
      name: 'Pixasso MCP Server',
      description: 'Hosted end-to-end frontend engineering and design orchestrator.',
      logo: 'https://pixasso.erebuzzz.tech/favicon.png'
    },
    setCookie,
    state: { oauthReqInfo }
  });
});

app.post('/authorize', async (c) => {
  try {
    const formData = await c.req.raw.formData();
    validateCSRFToken(formData, c.req.raw);

    const encodedState = formData.get('state');
    if (!encodedState || typeof encodedState !== 'string') {
      return c.text('Missing state in form data', 400);
    }

    let state: { oauthReqInfo?: AuthRequest };
    try {
      state = JSON.parse(atob(encodedState));
    } catch (_e) {
      return c.text('Invalid state data', 400);
    }

    if (!state.oauthReqInfo || !state.oauthReqInfo.clientId) {
      return c.text('Invalid request', 400);
    }

    const approvedClientCookie = await addApprovedClient(
      c.req.raw,
      state.oauthReqInfo.clientId,
      c.env.COOKIE_ENCRYPTION_KEY
    );

    const { stateToken } = await createOAuthState(state.oauthReqInfo, c.env.OAUTH_KV);
    const { setCookie: sessionBindingCookie } = await bindStateToSession(stateToken);

    const headers = new Headers();
    headers.append('Set-Cookie', approvedClientCookie);
    headers.append('Set-Cookie', sessionBindingCookie);

    return redirectToGithub(c.req.raw, stateToken, Object.fromEntries(headers), c.env.GITHUB_CLIENT_ID);
  } catch (error: any) {
    console.error('POST /authorize error:', error);
    if (error instanceof OAuthError) {
      return error.toResponse();
    }
    return c.text(`Internal server error: ${error.message}`, 500);
  }
});

function redirectToGithub(
  request: Request,
  stateToken: string,
  headers: Record<string, string> = {},
  clientId: string
) {
  return new Response(null, {
    headers: {
      ...headers,
      location: getUpstreamAuthorizeUrl({
        client_id: clientId,
        redirect_uri: new URL('/callback', request.url).href,
        scope: 'read:user user:email',
        state: stateToken,
        upstream_url: 'https://github.com/login/oauth/authorize'
      })
    },
    status: 302
  });
}

app.get('/callback', async (c) => {
  let oauthReqInfo: AuthRequest;
  let clearSessionCookie: string;

  try {
    const result = await validateOAuthState(c.req.raw, c.env.OAUTH_KV);
    oauthReqInfo = result.oauthReqInfo;
    clearSessionCookie = result.clearCookie;
  } catch (error: any) {
    if (error instanceof OAuthError) {
      return error.toResponse();
    }
    return c.text('Internal server error during state validation', 500);
  }

  if (!oauthReqInfo.clientId) {
    return c.text('Invalid OAuth request data', 400);
  }

  const [accessToken, errResponse] = await fetchUpstreamAuthToken({
    client_id: c.env.GITHUB_CLIENT_ID,
    client_secret: c.env.GITHUB_CLIENT_SECRET,
    code: c.req.query('code'),
    redirect_uri: new URL('/callback', c.req.url).href,
    upstream_url: 'https://github.com/login/oauth/access_token'
  });
  if (errResponse) return errResponse;

  const octokit = new Octokit({ auth: accessToken });
  const user = await octokit.rest.users.getAuthenticated();
  const login = user.data.login;
  const name = user.data.name || login;
  let email = user.data.email || '';

  if (!email) {
    try {
      const emailsRes = await octokit.rest.users.listEmailsForAuthenticatedUser();
      const primary = emailsRes.data.find(e => e.primary);
      if (primary) email = primary.email;
    } catch {
      email = `${login}@users.noreply.github.com`;
    }
  }

  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    metadata: {
      label: `${name} (@${login})`
    },
    props: {
      accessToken,
      email,
      login,
      name
    } as GitHubAuthProps,
    request: oauthReqInfo,
    scope: oauthReqInfo.scope,
    userId: login
  });

  const headers = new Headers({ Location: redirectTo });
  if (clearSessionCookie) {
    headers.set('Set-Cookie', clearSessionCookie);
  }

  return new Response(null, {
    status: 302,
    headers
  });
});

export { app as GitHubHandler };
