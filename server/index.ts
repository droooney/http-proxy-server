import net from 'node:net';

import { blue, green, red, yellow } from 'colors/safe';

const PORT = Number(process.env.PORT);

const server = net.createServer((socket) => {
  socket.once('data', (data) => {
    const dataString = data.toString();
    const isHttps = data.includes('CONNECT');
    let serverPort: number;
    let serverAddress: string | undefined;

    if (isHttps) {
      serverPort = 443;
      // prettier-ignore
      serverAddress = dataString
        .split('CONNECT')
        .at(1)
        ?.split(' ')
        .at(1)
        ?.split(':')
        .at(0);
    } else {
      serverPort = 80;
      // prettier-ignore
      serverAddress = dataString
        .split('Host: ')
        .at(1)
        ?.split('\n')
        .at(0)
        ?.trim();
    }

    if (!serverAddress) {
      console.log(yellow(`Empty server address: ${dataString}`));

      socket.end();

      return;
    }

    const proxySocket = net.createConnection({
      host: serverAddress,
      port: serverPort,
    });

    proxySocket.on('error', (err) => {
      console.log(red(err.stack ?? err.message));
    });

    if (isHttps) {
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
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
