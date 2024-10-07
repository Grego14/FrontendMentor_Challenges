import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: 'lightningcss',
    root: '/FrontendMentor_Challenges/challenges/product-list-with-cart-main/'
  }
})
