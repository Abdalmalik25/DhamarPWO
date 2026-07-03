#!/bin/bash
# Deploy script for PWO Dhamar - Production Deployment
set -e

echo "🚀 Starting deployment for PWO Dhamar..."
echo ""

# Build the project
echo "📦 Building project..."
npm run build

# Verify build output
echo "✅ Verifying build..."
if [ ! -d "dist" ]; then
  echo "❌ Build failed: dist directory not found"
  exit 1
fi

if [ ! -f "dist/index.html" ]; then
  echo "❌ Build failed: index.html not found"
  exit 1
fi

# Copy docs to public
echo "📄 Copying documents..."
node scripts/copy-docs.mjs || true

# Verify all required files exist
echo "✅ Checking required files..."
files=(
  "dist/index.html"
  "dist/assets/index-Bd9ecJ6R.css"
  "public/robots.txt"
  "public/sitemap.xml"
  "public/manifest.json"
  "public/_redirects"
  "public/.htaccess"
)

for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "⚠️  Warning: $file not found"
  fi
done

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "Deployment ready. To deploy:"
echo "  1. Upload 'dist' folder to your hosting provider (Vercel/Netlify/etc)"
echo "  2. Or run: npx serve dist -l 4173"
echo ""
echo "📊 Build statistics:"
du -sh dist/ 2>/dev/null || echo "dist folder size: N/A"
echo ""
echo "🔗 Preview: http://localhost:4173/"