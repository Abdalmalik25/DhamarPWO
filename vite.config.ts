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
        filename: '[path][base].gz',
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
      sourcemap: !isProduction,
      target: 'es2020',
      cssCodeSplit: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) return 'vendor';
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
      reportCompressedSize: false,
      assetsInlineLimit: 4096,
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
