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

function promptHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const stdin = process.stdin;
    const onData = (chunk) => {
      // Clean terminal line
    };

    // Mask typing in terminal
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
        // Ctrl+C
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.exit(1);
      } else if (char === '\b' || char === '\x7f') {
        // Backspace
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
    const cmd = isWin ? 'npx.cmd' : 'npx';
    const child = spawn(cmd, ['wrangler', 'secret', 'put', key, '--config', wranglerConfig], {
      stdio: ['pipe', 'inherit', 'inherit']
    });

    child.stdin.write(secretValue + '\n');
    child.stdin.end();

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`wrangler secret put exited with code ${code}`));
      }
    });
  });
}

async function main() {
  console.log('=== Pixasso API Key Ingestion ===\n');
  console.log('Keys are stored locally in mcp-server/.dev.vars and can optionally be deployed to Cloudflare Workers.');
  console.log('Typing is masked for security.\n');

  console.log('1. NVIDIA NIM API Key (Tier 1 Inference)');
  console.log('   Get free trial credits at: https://build.nvidia.com');
  const nvidiaKey = await promptHidden('   Enter NVIDIA_API_KEY (leave empty to skip): ');

  console.log('\n2. OpenRouter API Key (Tier 2 Free Models)');
  console.log('   Create key at: https://openrouter.ai/settings/keys');
  const openrouterKey = await promptHidden('   Enter OPENROUTER_API_KEY (leave empty to skip): ');

  if (!nvidiaKey && !openrouterKey) {
    console.log('\nNo keys entered. Exiting without making changes.');
    process.exit(0);
  }

  // Save to local dev.vars
  if (nvidiaKey) {
    updateDevVars('NVIDIA_API_KEY', nvidiaKey);
    console.log('\n[Saved] NVIDIA_API_KEY saved to mcp-server/.dev.vars');
  }
  if (openrouterKey) {
    updateDevVars('OPENROUTER_API_KEY', openrouterKey);
    console.log('[Saved] OPENROUTER_API_KEY saved to mcp-server/.dev.vars');
  }

  const deploy = await promptText('\nDeploy these secrets to production Cloudflare Worker now? (y/N): ');
  if (deploy.toLowerCase() === 'y' || deploy.toLowerCase() === 'yes') {
    if (nvidiaKey) {
      console.log('Pushing NVIDIA_API_KEY to Cloudflare...');
      try {
        await runWranglerSecretPut('NVIDIA_API_KEY', nvidiaKey);
        console.log('[Cloudflare] NVIDIA_API_KEY stored successfully.');
      } catch (err) {
        console.error('[Cloudflare Error]', err.message);
      }
    }
    if (openrouterKey) {
      console.log('Pushing OPENROUTER_API_KEY to Cloudflare...');
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
