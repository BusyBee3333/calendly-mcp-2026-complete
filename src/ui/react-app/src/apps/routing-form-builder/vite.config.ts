import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/routing-form-builder',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/routing-form-builder/index.html',
    },
  },
});
