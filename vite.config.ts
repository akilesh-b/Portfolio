import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Three.js / R3F are split automatically via the dynamic import in OrbStage,
// so they are only downloaded on desktop when a WebGL scene is shown.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1000,
  },
})
