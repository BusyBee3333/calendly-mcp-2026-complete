import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/booking-page-preview',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/booking-page-preview/index.html',
    },
  },
});
