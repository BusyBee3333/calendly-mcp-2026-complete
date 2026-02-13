import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/scheduling-link-manager',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/scheduling-link-manager/index.html',
    },
  },
});
