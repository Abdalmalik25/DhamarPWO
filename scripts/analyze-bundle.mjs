// ============================================================
// Bundle Analyzer - تحليل حجم الحزمة
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

console.log('\n📦 Bundle Analysis Report');
console.log('='.repeat(50));

if (!fs.existsSync(distDir)) {
  console.log('❌ dist directory not found. Run "pnpm build" first.');
  process.exit(1);
}

function getDirectorySize(dir) {
  let totalSize = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stat.size;
    }
  }

  return totalSize;
}

function analyzeDirectory(dir, indent = '') {
  const items = fs.readdirSync(dir);
  const sizes = [];

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      const size = getDirectorySize(itemPath);
      sizes.push({ name: item, size, type: 'dir' });
      analyzeDirectory(itemPath, indent + '  ');
    } else {
      const size = stat.size;
      const ext = path.extname(item);
      sizes.push({ name: item, size, type: 'file', ext });
    }
  }

  // ترتيب بالحجم الأكبر أولاً
  sizes.sort((a, b) => b.size - a.size);

  for (const item of sizes) {
    const size = formatBytes(item.size);
    const icon = item.type === 'dir' ? '📁' : getFileIcon(item.ext);
    console.log(`${indent}${icon} ${item.name.padEnd(40)} ${size}`);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(ext) {
  const icons = {
    '.js': '📜',
    '.css': '🎨',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.svg': '🎯',
    '.ico': '🖼️',
    '.woff': '🔤',
    '.woff2': '🔤',
    '.html': '📄',
  };
  return icons[ext] || '📄';
}

console.log('\n📂 Directory Structure:');
console.log('-'.repeat(50));
analyzeDirectory(distDir);

const totalSize = getDirectorySize(distDir);
console.log('\n' + '='.repeat(50));
console.log(`📊 Total Bundle Size: ${formatBytes(totalSize)}`);
console.log('='.repeat(50));

// توصيات الأداء
console.log('\n💡 Performance Tips:');
if (totalSize > 5 * 1024 * 1024) {
  console.log('⚠️  Bundle size is large (>5MB). Consider code splitting.');
}
if (totalSize > 2 * 1024 * 1024) {
  console.log('⚠️  Consider lazy loading non-critical components.');
}
console.log('✅ Use pnpm build to generate optimized production bundle.\n');