import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Asegúrate de que este plugin esté correctamente instalado si lo necesitas

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // --- AÑADE O MODIFICA ESTA LÍNEA ---
  base: '/chibireact-frontend/', // Esto es CRUCIAL para que Vite genere las rutas correctas para tus assets en producción
  // ---------------------------------
  server: {
    host: true, // Esto es útil para el desarrollo local en contenedores o máquinas virtuales
    // port: 3000, // No es necesario en producción, DigitalOcean asigna el puerto
    open: false // Opcional: Para evitar que abra automáticamente el navegador en tu máquina local
  },
  // --- OPCIONAL: Configuración de build explícita, aunque 'dist' es el valor por defecto ---
  build: {
    outDir: 'dist', // Asegúrate de que Vite coloque los archivos compilados en la carpeta 'dist'
  }
  // ---------------------------------------------------------------------------------------
})