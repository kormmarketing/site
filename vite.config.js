import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', '@react-three/fiber', '@react-three/drei', 'three'],
  },
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
  },
})
