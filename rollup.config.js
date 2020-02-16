import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const input = 'src/tiny-context.tsx';
const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
const noDeclarationFiles = { compilerOptions: { declaration: false } };

export default [
  // CommonJS
  {
    input,
    output: { file: 'lib/tiny-context.js', format: 'cjs', indent: false },
    external,
    plugins: [typescript({ tsconfigOverride: noDeclarationFiles })]
  },
  // ES
  {
    input,
    output: { file: 'es/tiny-context.js', format: 'es', indent: false },
    external,
    plugins: [typescript({ tsconfigOverride: noDeclarationFiles })]
  },
  // ES for Browsers
  {
    input,
    output: { file: 'es/tiny-context.mjs', format: 'es', indent: false },
    external,
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  },
  // UMD Development
  {
    input,
    output: {
      file: 'umd/tiny-context.js',
      format: 'umd',
      name: 'tiny-context',
      indent: false,
      globals: { react: 'React' }
    },
    external,
    plugins: [typescript({ tsconfigOverride: noDeclarationFiles })]
  },
  // UMD Production
  {
    input,
    output: {
      file: 'umd/tiny-context.min.js',
      format: 'umd',
      name: 'tiny-context',
      indent: false,
      globals: { react: 'React' }
    },
    external,
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
];
