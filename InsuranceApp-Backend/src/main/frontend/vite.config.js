import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // aby bol prístupný z externého hosta
    port: 5173,
    proxy: {
      '/api': {          // pozor na lomítko, zvyčajne sa používa '/api'
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    },
    allowedHosts: ['47947dcbe5e4.ngrok-free.app']
  }
})
