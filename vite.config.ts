/// <reference types="vite/client" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression2';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const allowedOrigins = new Set(
    (env.VITE_ALLOWED_ORIGINS || '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  );

  const localhostOrigins = new Set([
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:5173',
  ]);

  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      // ضغط Gzip للملفات
      compression({
        algorithms: ['gzip'],
        threshold: 1024,
      }),
      // ضغط Brotli للملفات (أفضل من Gzip)
      compression({
        algorithms: ['brotliCompress'],
        threshold: 1024,
      }),
    ],

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-dom/client',
        'zod',
        'react-hot-toast',
      ],
      force: false,
    },

    server: {
      host: true,
      port: 8080,
      strictPort: false,
      open: false,
      cors: {
        origin: (origin: string | undefined, cb: (err: Error | null, origins: string | boolean) => void) => {
          if (!origin || allowedOrigins.has(origin) || localhostOrigins.has(origin) || origin.endsWith('.vercel.app')) {
            cb(null, true);
          } else {
            cb(null, false);
          }
        },
        credentials: true,
      },
      hmr: {
        overlay: false,
      },
      compress: true,
      warmup: {
        clientFiles: ['./src/main.tsx', './src/App.tsx'],
      },
    },

    preview: {
      host: true,
      port: 8080,
      strictPort: false,
      open: false,
      compress: true,
    },

    build: {
      outDir: 'dist',
      sourcemap: false, // تعطيل في الإنتاج للأمان
      target: 'es2020',
      cssCodeSplit: true,
      minify: 'terser', // تصغير أفضل
      chunkSizeWarningLimit: 500, // KB - تحذير إذا تجاوز 500KB
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
            'vendor-ui': ['lucide-react', 'react-icons'],
            'vendor-maps': ['leaflet', 'react-leaflet'],
            'vendor-utils': ['zod', 'react-hot-to-print'],
          },
          assetFileNames: (assetInfo) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fileName = (assetInfo as any).name || '';
            if (fileName.endsWith('.css')) return 'assets/css/[name]-[hash].css';
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(fileName))
              return 'assets/images/[name]-[hash][extname]';
            if (/\.(woff2?|eot|ttf|otf)$/.test(fileName))
              return 'assets/fonts/[name]-[hash][extname]';
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      assetsInlineLimit: 2048, // تقليل الملفات المضمنة
      copyPublicDir: true,
    },

    css: {
      devSourcemap: !isProduction,
      preprocessorOptions: {
        css: {
          charset: false,
        },
      },
    },

    json: {
      stringify: isProduction,
    },

    worker: {
      format: 'es',
    },

    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
