import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: { file: pkg.main, format: 'cjs' },
    plugins: [typescript(), resolve(), commonjs(), terser()]
  }
]
