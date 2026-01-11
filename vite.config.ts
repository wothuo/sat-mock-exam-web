// vite.config.ts
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    // 如果需要代理 API（可选，但你用环境变量切换，可能不需要）
    // proxy: {
    //   '/api': 'http://localhost:8080'
    // }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});