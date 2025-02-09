import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig((command) => {
  if (command === 'build') {
    return {
      plugins: [react()],
      build: {
        cssMinify: 'lightningcss',
        minify: true,
        outDir: 'build'
      },
      base: './'
    }
  }

  return {
    plugins: [react()],
    server: {
      open: true
    },
    base: './'
  }
})
