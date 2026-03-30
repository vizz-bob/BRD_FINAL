import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/crm/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['source-map-js', 'source-map'],
  },
})
