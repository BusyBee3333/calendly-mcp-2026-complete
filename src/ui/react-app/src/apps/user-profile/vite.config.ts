import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/user-profile',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/apps/user-profile/index.html',
    },
  },
});
