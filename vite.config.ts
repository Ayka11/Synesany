import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRouter()],
  build: {
    rollupOptions: {
      input: './src/app/page.jsx',
    },
  },
  server: {
    port: 4001,
  },
});
