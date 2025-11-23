import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <--- שימו לב: התיקון הוא כאן!

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/SSS/",
})
