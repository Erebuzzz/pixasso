const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8085;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/site/index.html';

  let fullPath = path.join(__dirname, '..', reqPath);
  if (!fs.existsSync(fullPath) && reqPath.startsWith('/site/examples/')) {
    fullPath = path.join(__dirname, '..', reqPath.replace('/site/examples/', '/examples/'));
  }
  if (!fs.existsSync(fullPath) && reqPath.startsWith('/examples/assets/')) {
    fullPath = path.join(__dirname, '..', reqPath.replace('/examples/assets/', '/examples/taste-canvas/assets/'));
  }
  if (!fs.existsSync(fullPath) && reqPath.startsWith('/site/examples/assets/')) {
    fullPath = path.join(__dirname, '..', reqPath.replace('/site/examples/assets/', '/examples/taste-canvas/assets/'));
  }

  let targetFile = fullPath;
  if (fs.existsSync(targetFile) && fs.statSync(targetFile).isDirectory()) {
    if (!req.url.split('?')[0].endsWith('/')) {
      const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
      res.writeHead(301, { Location: reqPath + '/' + query });
      res.end();
      return;
    }
    targetFile = path.join(targetFile, 'index.html');
  }

  if (!fs.existsSync(targetFile) || fs.statSync(targetFile).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  const ext = path.extname(targetFile).toLowerCase();
  const mime = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(targetFile).pipe(res);
});

server.listen(PORT, () => {
  console.log('Pixasso showcase server listening on http://localhost:' + PORT);
});
