import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/no-show-tracker',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/no-show-tracker/index.html',
    },
  },
});
