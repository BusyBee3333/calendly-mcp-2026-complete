import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/event-calendar',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/event-calendar/index.html',
    },
  },
});
