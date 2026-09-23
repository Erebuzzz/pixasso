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

    // 3. Call tool: pixasso_search_references
    console.log('3. Testing tools/call (pixasso_search_references)...');
    const searchRes = await sendRequest('tools/call', {
      name: 'pixasso_search_references',
      arguments: { query: 'typography' }
    });
    const parsedText = JSON.parse(searchRes.result.content[0].text);
    console.log('Search found ' + parsedText.totalFound + ' items for "typography".');

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
