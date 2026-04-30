import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },

  /* ============================== */
  /* 🔥 FIX SERVER ISSUE            */
  /* ============================== */

  server: {
    host: "127.0.0.1", // ✅ FORCE IPv4 (fixes EACCES)
    port: 11000,
    strictPort: true,
  }
})
