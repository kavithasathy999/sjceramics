import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // The ported vendor stylesheets (bootstrap/jquery-ui era) contain
    // legacy IE hacks like `*zoom:1`. They're harmless in modern browsers
    // but not valid CSS, so we let esbuild/lightningcss recover instead
    // of failing the production build.
    lightningcss: {
      errorRecovery: true,
    },
  },
})
