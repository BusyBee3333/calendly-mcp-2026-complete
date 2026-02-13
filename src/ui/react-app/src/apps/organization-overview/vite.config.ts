import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/organization-overview',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/organization-overview/index.html',
    },
  },
});
