const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const siteDir = path.join(root, 'site');

// Sync taste-canvas build from apps/taste-canvas/dist if available
const tasteDist = path.join(root, 'apps', 'taste-canvas', 'dist');
const tasteCanvasDir = path.join(root, 'examples', 'taste-canvas');
if (fs.existsSync(tasteDist)) {
  fs.cpSync(tasteDist, tasteCanvasDir, { recursive: true });
}

// Copy examples to site/examples
const examplesSrc = path.join(root, 'examples');
const examplesDest = path.join(siteDir, 'examples');
if (fs.existsSync(examplesSrc)) {
  fs.cpSync(examplesSrc, examplesDest, { recursive: true });
}

// Safety mirror: copy taste-canvas/assets to site/examples/assets and examples/assets
// Ensures relative ./assets requests resolve cleanly even if trailing slash is omitted
const tasteAssetsSrc = path.join(tasteCanvasDir, 'assets');
if (fs.existsSync(tasteAssetsSrc)) {
  const examplesAssetsDest = path.join(examplesSrc, 'assets');
  const siteExamplesAssetsDest = path.join(examplesDest, 'assets');
  fs.cpSync(tasteAssetsSrc, examplesAssetsDest, { recursive: true });
  fs.cpSync(tasteAssetsSrc, siteExamplesAssetsDest, { recursive: true });
}

// Copy assets to site/assets
const assetsSrc = path.join(root, 'assets');
const assetsDest = path.join(siteDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, assetsDest, { recursive: true });
}

// Copy CNAME to site/CNAME
const cnameSrc = path.join(root, 'CNAME');
const cnameDest = path.join(siteDir, 'CNAME');
if (fs.existsSync(cnameSrc)) {
  fs.copyFileSync(cnameSrc, cnameDest);
}

console.log('Pixasso showcase site prepared successfully for deployment.');
