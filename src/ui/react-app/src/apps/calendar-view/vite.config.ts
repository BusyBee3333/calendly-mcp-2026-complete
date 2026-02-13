import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/calendar-view',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/calendar-view/index.html',
    },
  },
});
