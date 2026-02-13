import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/invitee-grid',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/invitee-grid/index.html',
    },
  },
});
