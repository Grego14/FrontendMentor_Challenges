import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
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
