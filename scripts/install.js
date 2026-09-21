#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log('=== Pixasso Multi-Platform Installer ===\n');

// 1. Resolve MCP server binary path
const rootDir = path.resolve(__dirname, '..');
const mcpServerDir = path.join(rootDir, 'mcp-server');
const serverBuildScript = path.join(mcpServerDir, 'build', 'index.js');

if (!fs.existsSync(path.join(mcpServerDir, 'node_modules'))) {
  console.log('Installing MCP server dependencies...');
  try {
    execSync('npm install', { cwd: mcpServerDir, stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to install MCP server dependencies:', e.message);
    process.exit(1);
  }
}

if (!fs.existsSync(serverBuildScript)) {
  console.log('Building TypeScript MCP server...');
  try {
    execSync('npm run build', { cwd: mcpServerDir, stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to compile MCP server:', e.message);
    process.exit(1);
  }
}

const normalizedServerPath = path.resolve(serverBuildScript).replace(/\\/g, '/');
console.log('Pixasso MCP Server Binary:', normalizedServerPath, '\n');

const pixassoMcpConfig = {
  command: 'node',
  args: [normalizedServerPath],
  env: {}
};

function updateJsonConfig(filePath, updater) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let data = {};
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        data = JSON.parse(raw);
      } catch (err) {
        data = {};
      }
    }
    const updated = updater(data);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
    return true;
  } catch (err) {
    console.error('Error updating ' + filePath + ':', err.message);
    return false;
  }
}

const statusReport = [];
const homeDir = os.homedir();

// 2. Configure Antigravity
console.log('Configuring Antigravity...');
const agyConfigs = [
  path.join(homeDir, '.gemini', 'config', 'mcp_config.json'),
  path.join(homeDir, '.gemini', 'antigravity', 'mcp_config.json')
];

let agySuccess = true;
agyConfigs.forEach(cfgPath => {
  const ok = updateJsonConfig(cfgPath, (cfg) => {
    cfg.mcpServers = cfg.mcpServers || {};
    cfg.mcpServers.pixasso = pixassoMcpConfig;
    return cfg;
  });
  if (!ok) agySuccess = false;
});

// Copy plugin to ~/.gemini/config/plugins/pixasso
const agyPluginDest = path.join(homeDir, '.gemini', 'config', 'plugins', 'pixasso');
try {
  fs.cpSync(path.join(rootDir, 'plugins', 'pixasso'), agyPluginDest, { recursive: true, force: true });
  console.log('Installed Antigravity plugin to:', agyPluginDest);
} catch (e) {
  console.warn('Could not copy plugin directory:', e.message);
}

// Sync global skill to ~/.gemini/config/skills/pixasso and ~/.agents/skills/pixasso
const agySkillDest1 = path.join(homeDir, '.gemini', 'config', 'skills', 'pixasso');
const agySkillDest2 = path.join(homeDir, '.agents', 'skills', 'pixasso');
try {
  fs.cpSync(path.join(rootDir, 'skills', 'pixasso'), agySkillDest1, { recursive: true, force: true });
  fs.cpSync(path.join(rootDir, 'skills', 'pixasso'), agySkillDest2, { recursive: true, force: true });
} catch (e) {
  console.warn('Could not copy global skills:', e.message);
}

statusReport.push({ target: 'Antigravity (MCP & Plugin)', status: agySuccess ? 'Configured' : 'Failed' });

// 3. Configure Cursor
console.log('Configuring Cursor...');
const cursorGlobalConfig = path.join(homeDir, '.cursor', 'mcp.json');
const cursorLocalConfig = path.join(rootDir, '.cursor', 'mcp.json');
const cursorSkillGlobal = path.join(homeDir, '.cursor', 'skills', 'pixasso');

const cursorGlobalOk = updateJsonConfig(cursorGlobalConfig, (cfg) => {
  cfg.mcpServers = cfg.mcpServers || {};
  cfg.mcpServers.pixasso = pixassoMcpConfig;
  return cfg;
});

const cursorLocalOk = updateJsonConfig(cursorLocalConfig, (cfg) => {
  cfg.mcpServers = cfg.mcpServers || {};
  cfg.mcpServers.pixasso = pixassoMcpConfig;
  return cfg;
});

try {
  fs.cpSync(path.join(rootDir, 'skills', 'pixasso'), cursorSkillGlobal, { recursive: true, force: true });
} catch (e) {}

statusReport.push({ target: 'Cursor (~/.cursor/mcp.json & local)', status: (cursorGlobalOk && cursorLocalOk) ? 'Configured' : 'Partial' });

// 4. Configure Claude Desktop
console.log('Configuring Claude Desktop...');
let claudeConfigPath = '';
if (process.platform === 'win32') {
  claudeConfigPath = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json');
} else if (process.platform === 'darwin') {
  claudeConfigPath = path.join(homeDir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
} else {
  claudeConfigPath = path.join(homeDir, '.config', 'Claude', 'claude_desktop_config.json');
}

const claudeOk = updateJsonConfig(claudeConfigPath, (cfg) => {
  cfg.mcpServers = cfg.mcpServers || {};
  cfg.mcpServers.pixasso = pixassoMcpConfig;
  return cfg;
});

statusReport.push({ target: 'Claude Desktop (' + path.basename(claudeConfigPath) + ')', status: claudeOk ? 'Configured' : 'Failed' });

// 5. Check Claude Code CLI
console.log('Checking Claude Code CLI...');
let claudeCliStatus = 'Manual command: claude mcp add pixasso node ' + normalizedServerPath;
try {
  const check = execSync('claude --version', { stdio: 'pipe' }).toString();
  if (check) {
    try {
      execSync('claude mcp add pixasso node ' + normalizedServerPath, { stdio: 'pipe' });
      claudeCliStatus = 'Configured via CLI';
    } catch (cmdErr) {
      claudeCliStatus = 'CLI present (Run: claude mcp add pixasso node ' + normalizedServerPath + ')';
    }
  }
} catch (e) {
  // Claude CLI not installed or not in PATH
}
statusReport.push({ target: 'Claude Code CLI', status: claudeCliStatus });

// 6. Check VS Code (Cline / Roo Code)
console.log('Checking VS Code Cline / Roo Code storage...');
const clineSettingsPath = path.join(
  process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'),
  'Code',
  'User',
  'globalStorage',
  'saoudrizwan.claude-dev',
  'settings',
  'cline_mcp_settings.json'
);

if (fs.existsSync(path.dirname(clineSettingsPath))) {
  const clineOk = updateJsonConfig(clineSettingsPath, (cfg) => {
    cfg.mcpServers = cfg.mcpServers || {};
    cfg.mcpServers.pixasso = pixassoMcpConfig;
    return cfg;
  });
  statusReport.push({ target: 'VS Code (Cline)', status: clineOk ? 'Configured' : 'Skipped' });
} else {
  statusReport.push({ target: 'VS Code (Cline)', status: 'Not detected (skipped)' });
}

// 7. Output Final Status Report
console.log('\n=============================================');
console.log('       PIXASSO INSTALLATION REPORT');
console.log('=============================================');
statusReport.forEach(item => {
  const pad = 36 - item.target.length;
  console.log(item.target + ' '.repeat(Math.max(2, pad)) + ': ' + item.status);
});
console.log('=============================================\n');
console.log('Installation completed. Restart or reload your AI editor to activate Pixasso MCP tools and resources.');
