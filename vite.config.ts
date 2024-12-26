import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@react-pdf/renderer'],
  },
  build: {
    commonjsOptions: {
      include: [/@react-pdf\/renderer/, /node_modules/],
      transformMixedEsModules: true
    },
  },
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    }
  }
});
