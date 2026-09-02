const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/run') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const { code, language, input } = JSON.parse(body);

        let cmd = 'node';
        let args = ['-e', code];

        if (language === 'python') {
          cmd = 'python3';
          args = ['-c', code];
        }

        const proc = spawn(cmd, args, {
          timeout: 2000,
          maxBuffer: 1024 * 1024
        });

        let stdout = '';
        let stderr = '';

        if (input) {
          proc.stdin.write(input);
          proc.stdin.end();
        }

        proc.stdout.on('data', d => { stdout += d.toString(); });
        proc.stderr.on('data', d => { stderr += d.toString(); });

        proc.on('close', (codeStatus) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            exitCode: codeStatus,
            stdout,
            stderr
          }));
        });
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Judge sandbox health: OK');
  }
});

server.listen(PORT, () => {
  console.log(`Sandbox Judge running on port ${PORT}`);
});
