#!/bin/bash
# Deploy script for PWO Dhamar - Production Deployment
set -e

echo "🚀 Starting deployment for PWO Dhamar..."
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📥 Installing dependencies..."
  pnpm install
fi

# Build the project
echo "📦 Building project..."
pnpm run build

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

# Verify all required files exist (using glob patterns instead of hardcoded hashes)
echo "✅ Checking required files..."
required_files=(
  "dist/index.html"
  "public/robots.txt"
  "public/sitemap.xml"
  "public/manifest.json"
  "public/_redirects"
  "public/.htaccess"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "⚠️  Warning: $file not found"
  fi
done

# Check that at least one CSS and one JS asset exist in dist/assets
css_count=$(find dist/assets -name "*.css" 2>/dev/null | wc -l)
js_count=$(find dist/assets -name "*.js" 2>/dev/null | wc -l)

if [ "$css_count" -eq 0 ]; then
  echo "⚠️  Warning: No CSS files found in dist/assets"
fi

if [ "$js_count" -eq 0 ]; then
  echo "❌ Build failed: No JS files found in dist/assets"
  exit 1
fi

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
