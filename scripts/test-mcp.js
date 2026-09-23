const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.resolve(__dirname, '../mcp-server/build/index.js');
console.log('Testing Pixasso MCP Server at:', serverPath);

const proc = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let messageId = 1;
const pendingRequests = new Map();

let buffer = '';
proc.stdout.on('data', (data) => {
  buffer += data.toString('utf8');
  const lines = buffer.split('\n');
  buffer = lines.pop(); // keep partial line

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id && pendingRequests.has(msg.id)) {
        const resolve = pendingRequests.get(msg.id);
        pendingRequests.delete(msg.id);
        resolve(msg);
      }
    } catch (e) {
      // ignore non-json
    }
  }
});

function sendRequest(method, params = {}) {
  return new Promise((resolve) => {
    const id = messageId++;
    pendingRequests.set(id, resolve);
    const req = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };
    proc.stdin.write(JSON.stringify(req) + '\n');
  });
}

async function runTests() {
  try {
    // 1. Initialize
    console.log('1. Testing initialize...');
    const initRes = await sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'pixasso-test-client', version: '1.0.0' }
    });
    console.log('Initialize success! Server:', initRes.result.serverInfo.name);

    // 2. List tools
    console.log('2. Testing tools/list...');
    const toolsRes = await sendRequest('tools/list');
    const toolNames = toolsRes.result.tools.map(t => t.name);
    console.log('Tools found (' + toolNames.length + '):', toolNames.join(', '));
    if (toolNames.length !== 7) throw new Error('Expected 7 tools, got ' + toolNames.length);

    for (const tool of toolsRes.result.tools) {
      if (!tool.annotations) throw new Error('Tool ' + tool.name + ' missing annotations');
      const { readOnlyHint, destructiveHint, idempotentHint, openWorldHint } = tool.annotations;
      if (typeof readOnlyHint !== 'boolean' || typeof destructiveHint !== 'boolean' ||
          typeof idempotentHint !== 'boolean' || typeof openWorldHint !== 'boolean') {
        throw new Error('Tool ' + tool.name + ' has invalid or missing hints in annotations');
      }
    }
    console.log('All 7 tools verified with 4 boolean hints (readOnlyHint, destructiveHint, idempotentHint, openWorldHint).');

    // 3. Call all 7 tools via JSON-RPC protocol
    console.log('3. Testing tools/call for all 7 tools...');

    // 3.1 pixasso_discover_intent
    console.log('   - Calling pixasso_discover_intent...');
    const discoverRes = await sendRequest('tools/call', {
      name: 'pixasso_discover_intent',
      arguments: {
        projectArchetype: 'editorial_landing_page',
        description: 'Design-forward architectural monograph and specimen archive.',
        hasBrandIdentity: false
      }
    });
    const discoverData = JSON.parse(discoverRes.result.content[0].text);
    if (!discoverData.compulsoryPopupQuestions || discoverData.compulsoryPopupQuestions.length === 0) {
      throw new Error('pixasso_discover_intent did not return popup questions');
    }

    // 3.2 pixasso_search_references
    console.log('   - Calling pixasso_search_references...');
    const searchRes = await sendRequest('tools/call', {
      name: 'pixasso_search_references',
      arguments: { query: 'typography' }
    });
    const searchData = JSON.parse(searchRes.result.content[0].text);
    console.log('     Search found ' + searchData.totalFound + ' items for "typography".');

    // 3.3 pixasso_generate_genome
    console.log('   - Calling pixasso_generate_genome...');
    const genomeRes = await sendRequest('tools/call', {
      name: 'pixasso_generate_genome',
      arguments: {
        projectName: 'Studio Alpha',
        themeMode: 'paper',
        groundTone: '#fbfaf7',
        typography: {
          displayFont: 'Syne',
          bodyFont: 'Newsreader',
          monoFont: 'JetBrains Mono'
        },
        colorTokens: {
          primary: '#111111',
          accent: '#2b580c',
          border: 'rgba(0,0,0,0.08)'
        }
      }
    });
    const genomeData = JSON.parse(genomeRes.result.content[0].text);
    if (!genomeData.genomeYaml) throw new Error('pixasso_generate_genome missing genomeYaml');

    // 3.4 pixasso_generate_brain
    console.log('   - Calling pixasso_generate_brain...');
    const brainRes = await sendRequest('tools/call', {
      name: 'pixasso_generate_brain',
      arguments: {
        projectName: 'Studio Alpha',
        decisions: [{ category: 'Theme', choice: 'Paper Ivory', rationale: 'Literary calm' }],
        tasks: [{ id: '1', title: 'Scaffold tokens', role: 'Architect', status: 'completed' }]
      }
    });
    const brainData = JSON.parse(brainRes.result.content[0].text);
    if (!brainData.mermaidDiagram) throw new Error('pixasso_generate_brain missing mermaidDiagram');

    // 3.5 pixasso_audit_design
    console.log('   - Calling pixasso_audit_design...');
    const auditRes = await sendRequest('tools/call', {
      name: 'pixasso_audit_design',
      arguments: {
        componentMarkup: '<button type="button" class="bg-black text-white px-4 py-2">Click</button>'
      }
    });
    const auditData = JSON.parse(auditRes.result.content[0].text);
    if (auditData.status !== 'passed') throw new Error('pixasso_audit_design unexpected audit status');

    // 3.6 pixasso_generate_test_plan
    console.log('   - Calling pixasso_generate_test_plan...');
    const planRes = await sendRequest('tools/call', {
      name: 'pixasso_generate_test_plan',
      arguments: {
        projectName: 'Studio Alpha'
      }
    });
    const planData = JSON.parse(planRes.result.content[0].text);
    if (!planData.matrix || planData.matrix.length === 0) throw new Error('pixasso_generate_test_plan missing matrix');

    // 3.7 pixasso_fetch_reference (with local mock server)
    console.log('   - Calling pixasso_fetch_reference...');
    const mockHttp = require('http').createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!DOCTYPE html><html><head><title>Specimen</title></head><body><h1>Specimen Header</h1><p>Comprehensive editorial typography baseline grid testing content for mock server verification.</p></body></html>');
    });
    await new Promise(r => mockHttp.listen(8769, r));
    try {
      const fetchRes = await sendRequest('tools/call', {
        name: 'pixasso_fetch_reference',
        arguments: {
          url: 'http://localhost:8769/specimen',
          focus: 'full'
        }
      });
      const fetchData = JSON.parse(fetchRes.result.content[0].text);
      if (!fetchData.title) throw new Error('pixasso_fetch_reference missing title in result');
    } finally {
      mockHttp.close();
    }
    console.log('   -> All 7 tools called and verified over stdio JSON-RPC protocol.');

    // 4. List resources
    console.log('4. Testing resources/list...');
    const resRes = await sendRequest('resources/list');
    console.log('Resources found (' + resRes.result.resources.length + '). Sample:', resRes.result.resources[0].uri);

    // 5. List prompts
    console.log('5. Testing prompts/list...');
    const promptsRes = await sendRequest('prompts/list');
    const promptNames = promptsRes.result.prompts.map(p => p.name);
    console.log('Prompts found (' + promptNames.length + '):', promptNames.join(', '));

    console.log('All Pixasso MCP Protocol Tests Passed Cleanly!');
    proc.kill();
    process.exit(0);

  } catch (err) {
    console.error('Test failed:', err);
    proc.kill();
    process.exit(1);
  }
}

setTimeout(runTests, 1000);
