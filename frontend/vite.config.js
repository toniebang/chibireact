// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Frontend en la raíz
  server: {
    host: true,
    proxy: {
      '/api': { // Cuando Vite ve una solicitud que empieza con '/api'
        target: 'http://localhost:8000', // La redirige a tu backend Django local
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // ¡Clave! Elimina '/api' antes de enviarla a Django
      },
      // Puedes añadir más proxies para /admin, /media, /static si los necesitas en desarrollo
    }
  },
  build: {
    outDir: 'dist',
  }
})