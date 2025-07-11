import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'esm',
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    del({ targets: 'dist/*' }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    // terser(),
  ],
};
