import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  resolve: {
    alias: {
      html2canvas: path.resolve(
        __dirname,
        "node_modules/html2canvas-pro"
      ),
    },
  },
})