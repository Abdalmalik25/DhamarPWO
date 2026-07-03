import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const srcDir = path.join(root, 'docs');
const destDir = path.join(root, 'public', 'docs');

fs.mkdirSync(path.join(root, 'public'), { recursive: true });

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
for (const file of files) {
  if (file.endsWith('.pdf')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  }
}

console.log(`Copied PDFs from docs to public/docs`);