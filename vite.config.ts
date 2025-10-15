import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    dts({ tsconfigPath: './tsconfig.build.json', staticImport: true, rollupTypes: true })
  ],
  resolve: {
    alias: {
      '@library': resolve(__dirname, 'lib')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    rollupOptions: {
      external: ['vue', 'nuxt/app'],
      output: {
        exports: 'named',
        compact: false
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
