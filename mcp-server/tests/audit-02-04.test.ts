import { handleFetchReference, verifiedFetchCache } from '../src/tools/fetchReference';
import { handleGenerateGenome } from '../src/tools/generateGenome';
import http from 'http';

async function runAcceptanceTest() {
  console.log('=== RUNNING AUDIT-02 & AUDIT-04 ACCEPTANCE CHECKS ===\n');

  // Clear session cache
  verifiedFetchCache.clear();

  // Test Case A: Attempt to generate genome with unfetched reference
  console.log('--- Test Case A: Call generateGenome with unfetched reference (AUDIT-02 Hard Gate) ---');
  let rejectedUnfetched = false;
  try {
    handleGenerateGenome({
      projectName: 'Test App',
      themeMode: 'paper',
      groundTone: '#fbfaf7',
      typography: {
        displayFont: 'Syne',
        bodyFont: 'Newsreader',
        monoFont: 'JetBrains Mono',
        scaleRatio: 'majorThird'
      },
      colorTokens: {
        primary: '#191919',
        accent: '#33ff66',
        border: 'rgba(0,0,0,0.12)'
      },
      references: [
        {
          url: 'https://unfetched-reference.example.com/specimen',
          fetchedAt: new Date().toISOString(),
          renderedContentDetected: true,
          extractedPrinciples: ['Minimalist visual layout'],
          epistemicStatus: 'known'
        }
      ]
    });
  } catch (err: any) {
    rejectedUnfetched = true;
    console.log('Caught expected error:', err.message);
    if (!err.message.includes('has not been fetched via pixasso_fetch_reference')) {
      throw new Error(`Expected unfetched error message, got: ${err.message}`);
    }
  }

  if (!rejectedUnfetched) {
    throw new Error('FAILED: generateGenome silently accepted an unfetched reference URL!');
  }
  console.log('-> Test Case A PASSED: Unfetched reference was rejected by hard gate.\n');

  // Test Case B: Start local server, fetch 1 content-rich page and 1 empty SPA shell
  console.log('--- Test Case B: Generate Genome with 1 fetched reference and 1 skipped reference (AUDIT-04) ---');
  const server = http.createServer((req, res) => {
    if (req.url === '/fetched-rich') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>Stripe Dev Architectural Specimen</title></head>
        <body>
          <h1>Mathematical Harmonic Design</h1>
          <p>Editorial ivory paper backgrounds paired with high-contrast grotesques, hair-line dividers, and real-time canvas synthesizers establish technical precision without decorative bloat. Typography drives layout geometry and fluid responsive boundaries.</p>
        </body>
        </html>
      `);
    } else if (req.url === '/skipped-spa') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>Framer App</title></head>
        <body>
          <div id="__framer-app"></div>
        </body>
        </html>
      `);
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise<void>((resolve) => server.listen(8766, resolve));
  const baseUrl = 'http://localhost:8766';

  try {
    // 1. Fetch the content-rich reference
    const richResult = await handleFetchReference({ url: `${baseUrl}/fetched-rich`, focus: 'full' });
    console.log('Rich ref fetched:', richResult.title, '| renderedContentDetected:', richResult.renderedContentDetected);

    // 2. Fetch the empty SPA reference (which returns renderedContentDetected: false)
    const spaResult = await handleFetchReference({ url: `${baseUrl}/skipped-spa`, focus: 'full' });
    console.log('SPA ref fetched:', spaResult.title, '| renderedContentDetected:', spaResult.renderedContentDetected);

    // 3. Compile genome with both references: one known fetched, one skipped/unavailable SPA
    const genomeOutput = handleGenerateGenome({
      projectName: 'Audit Verified Studio',
      themeMode: 'paper',
      groundTone: '#fbfaf7',
      typography: {
        displayFont: 'Syne',
        bodyFont: 'Newsreader',
        monoFont: 'JetBrains Mono',
        scaleRatio: 'majorThird'
      },
      colorTokens: {
        primary: '#191919',
        accent: '#33ff66',
        border: 'rgba(0,0,0,0.12)'
      },
      references: [
        {
          url: richResult.url,
          fetchedAt: richResult.fetchedAt,
          renderedContentDetected: richResult.renderedContentDetected,
          extractedPrinciples: [
            'Mathematical harmonic design driven by display grotesque headlines',
            'Ivory paper ground tone with subtle hairline divider structures'
          ],
          epistemicStatus: 'known'
        },
        {
          url: spaResult.url,
          fetchedAt: spaResult.fetchedAt,
          renderedContentDetected: spaResult.renderedContentDetected,
          extractedPrinciples: [],
          epistemicStatus: 'unavailable'
        }
      ]
    });

    console.log('\n--- Generated Genome YAML Excerpt (references block) ---');
    const yamlLines = genomeOutput.genomeYaml.split('\n');
    const refStart = yamlLines.findIndex(l => l.startsWith('references:'));
    const refEnd = yamlLines.findIndex((l, i) => i > refStart && l.startsWith('typography:'));
    console.log(yamlLines.slice(refStart, refEnd).join('\n'));

    // Assertions
    if (!genomeOutput.genomeYaml.includes(`epistemic_status: "known"`)) {
      throw new Error('FAILED: Missing epistemic_status: "known" in generated YAML');
    }
    if (!genomeOutput.genomeYaml.includes(`epistemic_status: "unavailable"`)) {
      throw new Error('FAILED: Missing epistemic_status: "unavailable" in generated YAML');
    }
    if (!genomeOutput.genomeYaml.includes(`rendered_content_detected: false`)) {
      throw new Error('FAILED: Missing rendered_content_detected: false in generated YAML');
    }
    if (!genomeOutput.genomeYaml.includes(`rendered_content_detected: true`)) {
      throw new Error('FAILED: Missing rendered_content_detected: true in generated YAML');
    }

    console.log('\n-> Test Case B PASSED: Both fetched reference and skipped SPA reference persisted with accurate epistemicStatus.\n');

    // Test Case C: SPA reference attempting to claim epistemicStatus: "known" without rendered proof
    console.log('--- Test Case C: Refuse "known" status for unrendered SPA shell ---');
    let rejectedBluff = false;
    try {
      handleGenerateGenome({
        projectName: 'Bluff Test',
        themeMode: 'paper',
        groundTone: '#fbfaf7',
        typography: { displayFont: 'Syne', bodyFont: 'Newsreader', monoFont: 'JetBrains Mono', scaleRatio: 'majorThird' },
        colorTokens: { primary: '#191919', accent: '#33ff66', border: 'rgba(0,0,0,0.12)' },
        references: [
          {
            url: spaResult.url,
            fetchedAt: spaResult.fetchedAt,
            renderedContentDetected: false,
            extractedPrinciples: ['Fabricated visual style claims'],
            epistemicStatus: 'known'
          }
        ]
      });
    } catch (e: any) {
      rejectedBluff = true;
      console.log('Caught expected bluff rejection:', e.message);
    }
    if (!rejectedBluff) {
      throw new Error('FAILED: Tool allowed epistemicStatus: "known" on an unrendered SPA shell!');
    }
    console.log('-> Test Case C PASSED: Tool refused fabricated "known" status on empty SPA shell.\n');

    console.log('=== ALL AUDIT-02 & AUDIT-04 ACCEPTANCE CHECKS PASSED SUCCESSFULLY ===');
  } finally {
    server.close();
  }
}

runAcceptanceTest().catch((err) => {
  console.error('Acceptance test failed:', err);
  process.exit(1);
});
