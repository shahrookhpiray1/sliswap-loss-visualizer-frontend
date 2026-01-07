import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/sliswap-loss-visualizer-frontend/',
  build: {
    outDir: 'docs'
  },
  plugins: [react()],
});