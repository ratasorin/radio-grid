import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import serve from 'rollup-plugin-serve'

export default ({ watch }) => ({
  input: './src/index.ts',
  output: {
    sourcemap: watch,
    format: 'iife',
    file: './public/build/bundle.js',
    name: 'grid',
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript(),
    watch &&
      serve({
        port: 8080,
        contentBase: 'public',
      }),
    watch &&
      livereload({
        watch: 'public',
        usePolling: true,
      }),
    !watch && terser(),
  ],
  watch: {
    clearScreen: false,
    chokidar: {
      usePolling: true,
    },
  },
})
