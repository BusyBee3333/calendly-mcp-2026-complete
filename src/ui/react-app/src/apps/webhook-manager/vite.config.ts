import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/webhook-manager',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/webhook-manager/index.html',
    },
  },
});
