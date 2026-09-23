import http from 'http';
import { handleFetchReference } from '../src/tools/fetchReference';

async function runAcceptanceTest() {
  console.log('=== RUNNING AUDIT-01 ACCEPTANCE CHECKS ===\n');

  // Start a local test server for 100% deterministic assertions
  const server = http.createServer((req, res) => {
    if (req.url === '/blog-page') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Archival Typography Specimen</title>
          <meta name="description" content="A comprehensive analysis of editorial typography and grotesque pairings.">
        </head>
        <body>
          <header><h1>Editorial Craft and Ground Tones</h1></header>
          <main>
            <h2>Harmonic Proportions</h2>
            <p>Editorial design establishes narrative clarity by creating mathematical harmony between display typography and readable serif body copy. We explore how hairlines, baseline grids, and modular scales elevate modern client interfaces without relying on generic purple gradients or AI clichés.</p>
            <h3>Modular Hierarchy</h3>
            <p>When type geometry dictates the layout rhythm, components naturally align with architectural poise and responsive balance across fluid viewports.</p>
            <a href="/examples">View specimens</a>
          </main>
        </body>
        </html>
      `);
    } else if (req.url === '/spa-shell') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      // Typical Framer / Webflow / Vite empty shell
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Modern App Studio</title>
          <meta name="description" content="Interactive 3D Experience">
          <script defer src="/assets/index-38291a.js"></script>
        </head>
        <body>
          <div id="__next"></div>
        </body>
        </html>
      `);
    } else if (req.url === '/broken-404') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise<void>((resolve) => server.listen(8765, resolve));
  const baseUrl = 'http://localhost:8765';

  try {
    // 1. Content-Rich Static Page
    console.log('--- Case 1: Plain HTML / Content-rich page ---');
    const res1 = await handleFetchReference({ url: `${baseUrl}/blog-page`, focus: 'full' });
    console.log('Title:', res1.title);
    console.log('Rendered Content Detected:', res1.renderedContentDetected);
    console.log('Character Count:', res1.bodyCharacterCount);
    console.log('Headings:', res1.headings);
    console.log('Links:', res1.linksSample);
    if (!res1.renderedContentDetected || res1.bodyCharacterCount < 200) {
      throw new Error(`Case 1 failed: Expected renderedContentDetected: true, got ${res1.renderedContentDetected}`);
    }
    console.log('-> Case 1 PASSED: Real content, headings, and description extracted.\n');

    // 2. Heavy Client-Rendered SPA Shell
    console.log('--- Case 2: Client-Rendered SPA Shell ---');
    const res2 = await handleFetchReference({ url: `${baseUrl}/spa-shell`, focus: 'full' });
    console.log('Title:', res2.title);
    console.log('Rendered Content Detected:', res2.renderedContentDetected);
    console.log('Character Count:', res2.bodyCharacterCount);
    console.log('Advisory Notice Present:', Boolean(res2.advisoryNotice));
    console.log('Epistemic Status:', res2.epistemicStatus);
    if (res2.renderedContentDetected !== false || res2.epistemicStatus !== 'unavailable') {
      throw new Error(`Case 2 failed: Expected renderedContentDetected: false, got ${res2.renderedContentDetected}`);
    }
    console.log('-> Case 2 PASSED: Correctly identified SPA shell without fabricating content.\n');

    // 3. Broken / 404 URL
    console.log('--- Case 3: Broken / 404 URL ---');
    let threw404 = false;
    try {
      await handleFetchReference({ url: `${baseUrl}/broken-404`, focus: 'full' });
    } catch (e: any) {
      threw404 = true;
      console.log('Caught expected error message:', e.message);
      if (!e.message.includes('404')) {
        throw new Error(`Case 3 failed: Expected HTTP 404 in error message, got: ${e.message}`);
      }
    }
    if (!threw404) {
      throw new Error('Case 3 failed: Expected 404 fetch to throw an error');
    }
    console.log('-> Case 3 PASSED: Clean HTTP error thrown.\n');

    console.log('=== ALL AUDIT-01 ACCEPTANCE CHECKS PASSED SUCCESSFULLY ===');
  } finally {
    server.close();
  }
}

runAcceptanceTest().catch((err) => {
  console.error('Acceptance test failed:', err);
  process.exit(1);
});
