import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Warn only above 1000 kB (keeps CI quiet; real fix is manualChunks below)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached by browsers across navigations
          'vendor-react': ['react', 'react-dom'],
          // Icon library (large but static)
          'vendor-icons': ['lucide-react'],
          // PDF/canvas libraries (heavy, only needed on preview)
          'vendor-pdf': ['jspdf', 'html2canvas'],
        },
      },
    },
  },
});
