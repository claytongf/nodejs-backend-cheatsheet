// 04 · A raw HTTP server with no framework — what Express builds on top of.
// Run: npx tsx examples/04-http-server/index.ts  then visit http://localhost:4000/health

import http from 'node:http';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Not Found' }));
});

server.listen(4000, () => console.log('Raw HTTP server on http://localhost:4000'));
