const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const siteDir = path.join(root, 'site');

// Copy examples to site/examples
const examplesSrc = path.join(root, 'examples');
const examplesDest = path.join(siteDir, 'examples');
if (fs.existsSync(examplesSrc)) {
  fs.cpSync(examplesSrc, examplesDest, { recursive: true });
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
