import { spawn } from 'child_process';
import { exec } from 'child_process';
import http from 'http';
import net from 'net';

// Find a free port dynamically
function findFreePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findFreePort(startPort + 1));
    });
  });
}

async function main() {
  console.log('🔍 Finding free port...');
  const port = await findFreePort(8888);
  console.log(`✓ Found free port: ${port}`);

  console.log('🔨 Building project...');
  exec('npm run build', (err, stdout, stderr) => {
    if (err) {
      console.error('Build failed:', stderr);
      process.exit(1);
    }
    console.log('✓ Build completed');

    console.log(`🚀 Starting preview server on http://localhost:${port}`);
    console.log('Press Ctrl+C to stop\n');

    const child = spawn('npx', ['serve', 'dist', '-l', String(port)], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  });
}

main();
