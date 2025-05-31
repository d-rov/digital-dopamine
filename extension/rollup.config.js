import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: {
      'banner': 'src/banner.ts'
    },
    output: {
      dir: 'dist',
      format: 'iife',
      entryFileNames: '[name].js'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json"
      })
    ],
  },
  {
    input: {
      'background': 'src/background.ts',
      'api': 'src/api.ts',
      'config': 'src/config.ts',
      'utils/timeTracker': 'src/utils/timeTracker.ts'
    },
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].js'
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript({
          tsconfig: "./tsconfig.json"
        })
    ],
  }
];