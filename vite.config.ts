import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [
    react(),
  ],
  root: 'src/frontend',
  build: {
    outDir: '../../dist/frontend',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/frontend'),
      '@/components': path.resolve(__dirname, 'src/frontend/components'),
      '@/hooks': path.resolve(__dirname, 'src/frontend/hooks'),
      '@/utils': path.resolve(__dirname, 'src/frontend/utils'),
      '@/types': path.resolve(__dirname, 'src/frontend/types'),
      '@backend': path.resolve(__dirname, 'src/backend'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});