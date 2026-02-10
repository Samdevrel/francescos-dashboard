import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/tools': {
        target: 'http://localhost:18789',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
