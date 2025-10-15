import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/plugin.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'plugin.js' : 'plugin.cjs'
    },
    rollupOptions: {
      external: ['vue', 'nuxt/app'],
      output: {
        exports: 'named',
        compact: false
      }
    },
    outDir: 'dist',
    emptyOutDir: false,
    minify: false
  }
})