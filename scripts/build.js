const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// 1. Prepare static showcase site (copies assets, examples, CNAME into site/)
console.log('Preparing Pixasso static showcase site...');
require('./prepare-site.js');

// 2. Build MCP server if dependencies and compiler are present
const mcpDir = path.join(root, 'mcp-server');
const isWin = process.platform === 'win32';
const tscBin = path.join(mcpDir, 'node_modules', '.bin', isWin ? 'tsc.cmd' : 'tsc');

if (fs.existsSync(tscBin)) {
  console.log('Compiling Pixasso MCP server with local TypeScript...');
  try {
    execSync('npm run build --prefix mcp-server', { stdio: 'inherit', cwd: root });
    console.log('Pixasso MCP server compiled successfully.');
  } catch (error) {
    console.error('Error compiling MCP server:', error.message);
    process.exit(1);
  }
} else {
  // In static hosting environments like Cloudflare Pages or Vercel, mcp-server node_modules
  // are not installed because the host only serves the static website in site/.
  console.log('TypeScript compiler not found in mcp-server/node_modules. Static showcase build complete.');
}
