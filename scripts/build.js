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

if (!fs.existsSync(tscBin)) {
  console.log('Installing MCP server dependencies...');
  try {
    execSync('npm ci --prefix mcp-server --legacy-peer-deps', { stdio: 'inherit', cwd: root });
  } catch {
    try {
      execSync('npm install --prefix mcp-server --legacy-peer-deps', { stdio: 'inherit', cwd: root });
    } catch (err) {
      console.warn('Could not install mcp-server dependencies:', err.message);
    }
  }
}

if (fs.existsSync(tscBin) || fs.existsSync(path.join(mcpDir, 'node_modules', '.bin', 'tsc'))) {
  console.log('Compiling Pixasso MCP server with local TypeScript...');
  try {
    execSync('npm run build --prefix mcp-server', { stdio: 'inherit', cwd: root });
    console.log('Pixasso MCP server compiled successfully.');
  } catch (error) {
    console.error('Error compiling MCP server:', error.message);
    process.exit(1);
  }
} else {
  console.log('TypeScript compiler not found. Static showcase build complete.');
}
