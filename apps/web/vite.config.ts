import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@ui': path.resolve(__dirname, './src/shared/components/ui'),
      '@lib': path.resolve(__dirname, './src/shared/lib'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
    },
  },
});
