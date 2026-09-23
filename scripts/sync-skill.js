#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'skills', 'pixasso');

const targetDirs = [
  path.join(rootDir, 'plugins', 'pixasso', 'skills', 'pixasso'),
  path.join(rootDir, '.agents', 'skills', 'pixasso'),
  path.join(rootDir, '.cursor', 'skills', 'pixasso')
];

const isCheckOnly = process.argv.includes('--check');

function getAllFiles(dir, base = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const relPath = path.join(base, entry.name);
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, relPath));
    } else if (entry.isFile()) {
      results.push(relPath);
    }
  }
  return results;
}

function normalizeContent(buf) {
  // Normalize line endings to LF for byte comparison across OS
  return buf.toString('utf8').replace(/\r\n/g, '\n');
}

function syncOrCheck() {
  const sourceFiles = getAllFiles(sourceDir);
  let driftDetected = false;

  for (const targetDir of targetDirs) {
    const relTarget = path.relative(rootDir, targetDir);

    if (isCheckOnly) {
      const targetFiles = getAllFiles(targetDir);

      // Check missing or extra files
      for (const file of sourceFiles) {
        const srcPath = path.join(sourceDir, file);
        const tgtPath = path.join(targetDir, file);
        if (!fs.existsSync(tgtPath)) {
          console.error(`DRIFT: Missing in ${relTarget}: ${file}`);
          driftDetected = true;
          continue;
        }
        const srcContent = normalizeContent(fs.readFileSync(srcPath));
        const tgtContent = normalizeContent(fs.readFileSync(tgtPath));
        if (srcContent !== tgtContent) {
          console.error(`DRIFT: Content mismatch in ${relTarget}: ${file}`);
          driftDetected = true;
        }
      }

      for (const file of targetFiles) {
        const srcPath = path.join(sourceDir, file);
        if (!fs.existsSync(srcPath)) {
          console.error(`DRIFT: Extra file in ${relTarget}: ${file}`);
          driftDetected = true;
        }
      }
    } else {
      // Sync mode: mirror source to target
      fs.mkdirSync(targetDir, { recursive: true });

      for (const file of sourceFiles) {
        const srcPath = path.join(sourceDir, file);
        const tgtPath = path.join(targetDir, file);
        fs.mkdirSync(path.dirname(tgtPath), { recursive: true });
        fs.copyFileSync(srcPath, tgtPath);
      }

      // Remove obsolete files in target
      const targetFiles = getAllFiles(targetDir);
      for (const file of targetFiles) {
        const srcPath = path.join(sourceDir, file);
        if (!fs.existsSync(srcPath)) {
          fs.unlinkSync(path.join(targetDir, file));
        }
      }

      console.log(`Synced ${sourceFiles.length} files from skills/pixasso to ${relTarget}`);
    }
  }

  if (isCheckOnly && driftDetected) {
    console.error('\nSkill drift detected across mirrors. Run "node scripts/sync-skill.js" to reconcile.');
    process.exit(1);
  } else if (isCheckOnly) {
    console.log('Zero drift confirmed across all skill mirrors.');
  }
}

syncOrCheck();
