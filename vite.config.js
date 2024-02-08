import dts from 'vite-plugin-dts'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'Wares',
      fileName: 'wares'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'event-emitter',
        'immer',
        'lodash.clonedeep'
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'event-emitter': 'EventEmitter',
          immer: 'immer',
          'lodash.clonedeep': 'cloneDeep'
        }
      }
    }
  },
  plugins: [
    dts()
  ]
})
