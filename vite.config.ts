import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://corvus-be-ea11e5b5e66c.herokuapp.com/',
        changeOrigin: true,
      },
    },
  },
})
