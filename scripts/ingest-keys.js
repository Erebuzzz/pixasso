#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const devVarsPath = path.join(rootDir, 'mcp-server', '.dev.vars');
const wranglerConfig = path.join(rootDir, 'mcp-server', 'wrangler.jsonc');
const localWranglerCli = path.join(rootDir, 'mcp-server', 'node_modules', 'wrangler', 'wrangler-dist', 'cli.js');

function getExistingDevVar(key) {
  if (!fs.existsSync(devVarsPath)) return null;
  const content = fs.readFileSync(devVarsPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    if (line.startsWith(`${key}=`)) {
      const val = line.substring(key.length + 1).trim();
      return val || null;
    }
  }
  return null;
}

function promptHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    process.stdout.write(query);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    let input = '';
    const listener = (buffer) => {
      const char = buffer.toString('utf8');
      if (char === '\n' || char === '\r' || char === '\u0004') {
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.stdin.removeListener('data', listener);
        process.stdout.write('\n');
        rl.close();
        resolve(input.trim());
      } else if (char === '\u0003') {
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.exit(1);
      } else if (char === '\b' || char === '\x7f') {
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        input += char;
        process.stdout.write('*');
      }
    };

    process.stdin.on('data', listener);
  });
}

function promptText(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

function updateDevVars(key, value) {
  let content = '';
  if (fs.existsSync(devVarsPath)) {
    content = fs.readFileSync(devVarsPath, 'utf8');
  }

  const lines = content.split(/\r?\n/);
  let updated = false;
  const newLines = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      updated = true;
      return `${key}=${value}`;
    }
    return line;
  });

  if (!updated) {
    if (newLines.length > 0 && newLines[newLines.length - 1] !== '') {
      newLines.push('');
    }
    newLines.push(`${key}=${value}`);
  }

  fs.writeFileSync(devVarsPath, newLines.join('\n').trim() + '\n', 'utf8');
}

function runWranglerSecretPut(key, secretValue) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';
    let child;

    if (fs.existsSync(localWranglerCli)) {
      child = spawn(
        process.execPath,
        [localWranglerCli, 'secret', 'put', key, '--config', wranglerConfig],
        { stdio: ['pipe', 'inherit', 'inherit'] }
      );
    } else {
      const cmd = isWin ? 'npx.cmd' : 'npx';
      child = spawn(
        cmd,
        ['wrangler', 'secret', 'put', key, '--config', wranglerConfig],
        {
          stdio: ['pipe', 'inherit', 'inherit'],
          shell: isWin
        }
      );
    }

    child.stdin.write(secretValue + '\n');
    child.stdin.end();

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`wrangler secret put exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('=== Pixasso API Key Ingestion ===\n');
  console.log('Keys are stored locally in mcp-server/.dev.vars and can optionally be deployed to Cloudflare Workers.');
  console.log('Typing is masked for security.\n');

  const existingNvidia = getExistingDevVar('NVIDIA_API_KEY');
  const existingOpenRouter = getExistingDevVar('OPENROUTER_API_KEY');

  console.log('1. NVIDIA NIM API Key (Tier 1 Inference)');
  console.log('   Get free trial credits at: https://build.nvidia.com');
  const nvidiaPrompt = existingNvidia
    ? '   Enter NVIDIA_API_KEY (leave blank to keep existing from .dev.vars): '
    : '   Enter NVIDIA_API_KEY (leave empty to skip): ';
  let nvidiaKey = await promptHidden(nvidiaPrompt);
  if (!nvidiaKey && existingNvidia) {
    nvidiaKey = existingNvidia;
    console.log('   -> Using existing NVIDIA_API_KEY from .dev.vars');
  }

  console.log('\n2. OpenRouter API Key (Tier 2 Free Models)');
  console.log('   Create key at: https://openrouter.ai/settings/keys');
  const openrouterPrompt = existingOpenRouter
    ? '   Enter OPENROUTER_API_KEY (leave blank to keep existing from .dev.vars): '
    : '   Enter OPENROUTER_API_KEY (leave empty to skip): ';
  let openrouterKey = await promptHidden(openrouterPrompt);
  if (!openrouterKey && existingOpenRouter) {
    openrouterKey = existingOpenRouter;
    console.log('   -> Using existing OPENROUTER_API_KEY from .dev.vars');
  }

  if (!nvidiaKey && !openrouterKey) {
    console.log('\nNo keys entered or found. Exiting without making changes.');
    process.exit(0);
  }

  // Save to local dev.vars if updated
  if (nvidiaKey && nvidiaKey !== existingNvidia) {
    updateDevVars('NVIDIA_API_KEY', nvidiaKey);
    console.log('\n[Saved] NVIDIA_API_KEY saved to mcp-server/.dev.vars');
  }
  if (openrouterKey && openrouterKey !== existingOpenRouter) {
    updateDevVars('OPENROUTER_API_KEY', openrouterKey);
    console.log('[Saved] OPENROUTER_API_KEY saved to mcp-server/.dev.vars');
  }

  const deploy = await promptText('\nDeploy these secrets to production Cloudflare Worker now? (y/N): ');
  if (deploy.toLowerCase() === 'y' || deploy.toLowerCase() === 'yes') {
    if (nvidiaKey) {
      console.log('\nPushing NVIDIA_API_KEY to Cloudflare...');
      try {
        await runWranglerSecretPut('NVIDIA_API_KEY', nvidiaKey);
        console.log('[Cloudflare] NVIDIA_API_KEY stored successfully.');
      } catch (err) {
        console.error('[Cloudflare Error]', err.message);
      }
    }
    if (openrouterKey) {
      console.log('\nPushing OPENROUTER_API_KEY to Cloudflare...');
      try {
        await runWranglerSecretPut('OPENROUTER_API_KEY', openrouterKey);
        console.log('[Cloudflare] OPENROUTER_API_KEY stored successfully.');
      } catch (err) {
        console.error('[Cloudflare Error]', err.message);
      }
    }
  } else {
    console.log('\nTo deploy later to Cloudflare Workers, run:');
    if (nvidiaKey) console.log('  npx wrangler secret put NVIDIA_API_KEY --config mcp-server/wrangler.jsonc');
    if (openrouterKey) console.log('  npx wrangler secret put OPENROUTER_API_KEY --config mcp-server/wrangler.jsonc');
  }

  console.log('\nKey ingestion complete.');
}

main().catch((err) => {
  console.error('Error during key ingestion:', err);
  process.exit(1);
});
