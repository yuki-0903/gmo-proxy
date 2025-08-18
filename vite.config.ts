import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'gmo-proxy',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['express', 'axios', 'cors', 'dotenv'],
      output: {
        globals: {
          express: 'express',
          axios: 'axios',
          cors: 'cors',
          dotenv: 'dotenv'
        }
      }
    },
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})