import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/plugin.ts'),
      name: 'SpotflowNuxtPlugin',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'plugin.js' : 'plugin.cjs'
    },
    rollupOptions: {
      external: ['vue', 'nuxt/app', '@nuxt/kit'],
      output: {
        exports: 'named',
        compact: false,
        globals: {
          'nuxt/app': 'nuxtApp'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: false,
    minify: 'esbuild',
    sourcemap: true,
    target: 'es2020'
  }
})