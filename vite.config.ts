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
    proxy: {
      '/user-account/login': {
        target: 'http://39.97.42.90:8080', // 你的 API 域名
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user-account\/login/, ''), // 可选：去掉 /api 前缀
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});