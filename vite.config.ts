import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import * as path from 'path'

export default defineConfig({
  plugins: [
    createVuePlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  define: {
    'process.env': {}
  }
}) 