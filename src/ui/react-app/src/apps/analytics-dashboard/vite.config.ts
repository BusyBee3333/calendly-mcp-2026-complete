import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/analytics-dashboard',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/analytics-dashboard/index.html',
    },
  },
});
