import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['html2pdf.js'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          html2pdf: ['html2pdf.js'],
        },
      },
    },
  },
})
