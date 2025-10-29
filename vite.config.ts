import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    dts({ 
      tsconfigPath: './tsconfig.build.json', 
      staticImport: true, 
      rollupTypes: true,
      insertTypesEntry: true,
      copyDtsFiles: false
    })
  ],
  resolve: {
    alias: {
      '@library': resolve(__dirname, 'lib')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'SpotflowVueCheckout',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.js'
          case 'cjs':
            return 'index.cjs'
          case 'umd':
            return 'index.umd.js'
          default:
            return `index.${format}.js`
        }
      }
    },
    rollupOptions: {
      external: ['vue', 'nuxt/app'],
      output: [
        {
          format: 'es',
          exports: 'named',
          compact: false,
          entryFileNames: 'index.js',
          chunkFileNames: '[name]-[hash].js'
        },
        {
          format: 'cjs',
          exports: 'named',
          compact: false,
          entryFileNames: 'index.cjs'
        },
        {
          format: 'umd',
          name: 'SpotflowVueCheckout',
          globals: {
            vue: 'Vue'
          },
          entryFileNames: 'index.umd.js'
        }
      ]
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500
  },
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version || '0.0.0')
  }
})
