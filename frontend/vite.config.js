// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: {
    host: true,
    proxy: {
     
      // Puedes añadir un proxy para /admin si accedes al admin desde el mismo dominio de desarrollo
      // '/admin': {

      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      // },
      // Si Django sirve staticfiles o mediafiles en desarrollo, también los podrías proxear
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // '/media': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      // },
    }
  },
  build: {
    outDir: 'dist',
  }
})