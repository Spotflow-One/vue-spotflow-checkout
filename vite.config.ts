// import { resolve } from 'node:path'
// import dts from 'vite-plugin-dts'
// import { defineConfig } from 'vite'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     // dts()
//   ],
//    build: {
//     lib: {
//       entry: resolve(__dirname, 'src/index.ts'),
//       formats: ['es', 'cjs'],
//       fileName: (format) => format === 'es' ? 'index.js' : 'index.cjs'
//     },
//     rollupOptions: {
//       external: ['vue', 'nuxt/app'],
//       output: {
//         exports: 'named',
//         //  compact: false
//       }
//     },
//     outDir: 'dist',
//     emptyOutDir: true,
//       // minify: false
//   }
//   //  build: {
//   //   lib: {
//   //     entry: {
//   //       index: resolve(__dirname, 'src/index.ts'),
//   //       plugin: resolve(__dirname, 'src/plugin.ts')
//   //       // Make sure there's no plugin2 here!
//   //     },
//   //     formats: ['es', 'cjs']
//   //   },
//   //   rollupOptions: {
//   //     external: ['vue', 'nuxt/app'],
//   //     output: [
//   //       {
//   //         format: 'es',
//   //         entryFileNames: '[name].js',
//   //         exports: 'named',
//   //           inlineDynamicImports: true  // Force inline
//   //       },
//   //       {
//   //         format: 'cjs',
//   //         entryFileNames: '[name].cjs',
//   //         exports: 'named',
//   //           inlineDynamicImports: true  // Force inline

//   //       }
//   //     ]
//   //   },
//   //   outDir: 'dist',
//   //   emptyOutDir: true
//   // },
//   // build: {
//   //   lib: {
//   //     entry: {
//   //       index: resolve(__dirname, 'src/index.ts'),
//   //       plugin: resolve(__dirname, 'src/plugin.ts')
//   //     },
//   //     name: 'SpotflowVue',
//   //     formats: ['es', 'cjs'],
//   //   },
//   //   rollupOptions: {
//   //     external: ['vue', 'nuxt/app'],
//   //        output: [
//   //       {
//   //         format: 'es',
//   //         entryFileNames: '[name].js',
//   //         chunkFileNames: '[name].js',  // Prevent hashed chunk names
//   //         exports: 'named',
//   //         preserveModules: false
//   //       },
//   //       {
//   //         format: 'cjs',
//   //         entryFileNames: '[name].cjs',
//   //         chunkFileNames: '[name].cjs',  // Prevent hashed chunk names
//   //         exports: 'named',
//   //         preserveModules: false
//   //       }
//   //     ]
//   //   },
//   //   outDir: 'dist',
//   //   emptyOutDir: true
//   // },
//   // resolve: {
//   //   alias: [{ find: '@/', replacement: resolve(__dirname, './src/') }]
//   // }
// })

import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: './tsconfig.build.json',     staticImport: true,
      rollupTypes: true, })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
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
    // minify: false
  }
})
