import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(), ],
  server: {
    host: true, // Esto le dice a Vite que escuche en todas las IPs disponibles (0.0.0.0)
    // También puedes especificar un puerto si no quieres el predeterminado (5173)
    // port: 3000, 
    open: false // Opcional: Para evitar que abra automáticamente el navegador en tu máquina
  }
})
