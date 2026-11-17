import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Single Vite build for the whole MsmeBooks website.
// Every page folder (home, about-us, pricing, ...) is imported from src/pages/*
// and lazy-loaded, so each page only downloads its own code and styles.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
