import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/availability-manager',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/availability-manager/index.html',
    },
  },
});
