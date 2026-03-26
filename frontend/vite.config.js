import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8082',
      '/ws': {
        target: 'ws://localhost:8082',
        ws: true
      },
      '/uploads': 'http://localhost:8082'
    }
  }
})
