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
      '/api': { // Cuando Vite ve una solicitud que empieza con '/api'
        target: 'http://localhost:8000', // La redirige a tu backend Django local
        changeOrigin: true,
        // *** ¡CAMBIO CRUCIAL AQUÍ! ELIMINAMOS LA REESCRITURA DEL PATH ***
        // Ahora, si llamas a /api/token, el proxy enviará /api/token a Django
        // Esto alineará el comportamiento de desarrollo con producción
      },
      // Puedes añadir un proxy para /admin si accedes al admin desde el mismo dominio de desarrollo
      '/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Si Django sirve staticfiles o mediafiles en desarrollo, también los podrías proxear
      // '/static': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      // },
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