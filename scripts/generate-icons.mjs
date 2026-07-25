import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source logo path
const sourceLogo = join(__dirname, '../public/icons/logo-dhamar.png');
const iconsOutputDir = join(__dirname, '../public/icons');
const screenshotsOutputDir = join(__dirname, '../public/screenshots');

// Icon sizes required by manifest.json
const iconSizes = [
  { size: 48, name: 'icon-48x48.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Screenshot sizes required by manifest.json
const screenshotSizes = [
  { width: 1920, height: 1080, name: 'desktop.png' },
  { width: 390, height: 844, name: 'mobile.png' },
];

async function generateIcons() {
  console.log('🚀 بدء إنشاء الأيقونات...\n');
  
  // Ensure icons output directory exists
  if (!existsSync(iconsOutputDir)) {
    mkdirSync(iconsOutputDir, { recursive: true });
  }

  for (const { size, name } of iconSizes) {
    try {
      const outputPath = join(iconsOutputDir, name);
      
      // Resize with high quality
      await sharp(sourceLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({ 
          quality: 100,
          compressionLevel: 6
        })
        .toFile(outputPath);
      
      console.log(`✓ تم إنشاء ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ خطأ في إنشاء ${name}:`, error.message);
    }
  }

  console.log('\n✅ تم إنشاء جميع الأيقونات بنجاح!');
}

async function generateScreenshots() {
  console.log('\n🚀 بدء إنشاء لقطات الشاشة...\n');
  
  // Ensure screenshots output directory exists
  if (!existsSync(screenshotsOutputDir)) {
    mkdirSync(screenshotsOutputDir, { recursive: true });
  }

  for (const { width, height, name } of screenshotSizes) {
    try {
      const outputPath = join(screenshotsOutputDir, name);
      
      // Create a placeholder screenshot with the logo centered on themed background
      const svgContent = Buffer.from(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#0a192f"/>
          <text x="50%" y="45%" font-family="Tahoma, Arial" font-size="${Math.floor(width/20)}" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
            مكتب الأشغال العامة والطرق
          </text>
          <text x="50%" y="55%" font-family="Tahoma, Arial" font-size="${Math.floor(width/30)}" fill="#1e3a8a" text-anchor="middle" dominant-baseline="middle">
            محافظة ذمار - النسخة 5.0
          </text>
        </svg>
      `);
      
      await sharp(svgContent)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ تم إنشاء ${name} (${width}x${height})`);
    } catch (error) {
      console.error(`❌ خطأ في إنشاء ${name}:`, error.message);
    }
  }

  console.log('\n✅ تم إنشاء جميع لقطات الشاشة بنجاح!');
}

async function main() {
  await generateIcons();
  await generateScreenshots();
  console.log('\n✅✅✅ تم الانتهاء من جميع العمليات!');
}

main().catch(console.error);