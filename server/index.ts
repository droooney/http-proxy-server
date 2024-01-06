import http from 'node:http';

import { blue, green } from 'colors/safe';

const PORT = Number(process.env.PORT);

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  res.end('');
});

console.log(blue('Proxy server started'));

server.listen(PORT, '0.0.0.0', () => {
  console.log(green(`Proxy server listening on http://localhost:${PORT}`));
});
