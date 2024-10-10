import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'build') {
    console.log('serving for production...')
    return {
      plugins: [react()],
      build: {
        cssMinify: 'lightningcss',
        minify: true,
        outDir: 'build',
        root: '/product-list-with-cart-main/'
      }
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
