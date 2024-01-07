import net from 'node:net';

import { blue, green, red } from 'colors/safe';

const PORT = Number(process.env.PORT);

const server = net.createServer((socket) => {
  socket.once('data', (data) => {
    const dataString = data.toString();
    const isHttps = data.includes('CONNECT');
    let serverPort;
    let serverAddress;

    if (isHttps) {
      serverPort = 443;
      serverAddress = dataString.split('CONNECT')[1].split(' ')[1].split(':')[0];
    } else {
      serverPort = 80;
      serverAddress = dataString.split('Host: ')[1].split('\n')[0].trim();
    }

    const proxySocket = net.createConnection({
      host: serverAddress,
      port: serverPort,
    });

    proxySocket.on('error', (err) => {
      console.log(red(err.stack ?? err.message));
    });

    if (isHttps) {
      socket.write('HTTP/1.1 200 OK\n\n');
    } else {
      proxySocket.write(data);
    }

    socket.pipe(proxySocket);
    proxySocket.pipe(socket);
  });
});

console.log(blue('Proxy server started'));

server.listen(PORT, '0.0.0.0', () => {
  console.log(green(`Proxy server listening on http://localhost:${PORT}`));
});
