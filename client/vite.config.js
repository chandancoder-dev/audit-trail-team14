import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Prefer 5173, but fall back to the next free port (5174, ...) if it's taken.
    port: 5173,
    strictPort: false,
  },
})
