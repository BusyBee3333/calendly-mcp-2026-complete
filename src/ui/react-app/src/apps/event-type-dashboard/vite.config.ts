import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/event-type-dashboard',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/event-type-dashboard/index.html',
    },
  },
});
