import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
export default {
  input: 'src/index.js',
  output: { file: 'dist/index.cjs.js', format: 'cjs' },
  plugins: [
    commonjs({
      include: /node_modules/
    }),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    }),
    terser({ compress: { drop_console: true, drop_debugger: true } })
  ]
}
