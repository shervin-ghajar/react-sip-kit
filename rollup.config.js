import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import strip from 'rollup-plugin-strip';

// optional: enable if needed

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: false,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    del({ targets: 'dist/*' }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    strip({
      include: ['**/*.ts', '**/*.tsx'],
      functions: ['console.*'],
    }),
    terser(),
  ],
};
