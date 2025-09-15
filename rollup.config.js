import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

const external = ['zod'];

const commonConfig = {
  external,
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
  ],
};

const builds = [
  // Main SDK bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    ...commonConfig,
    plugins: [
      ...commonConfig.plugins,
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
      }),
    ],
  },
  
  // Server module
  {
    input: 'src/server/index.ts',
    output: [
      {
        file: 'dist/server/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/server/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    ...commonConfig,
    plugins: [
      ...commonConfig.plugins,
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
      }),
    ],
  },
  
  // Agent module
  {
    input: 'src/agent/index.ts',
    output: [
      {
        file: 'dist/agent/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/agent/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    ...commonConfig,
    plugins: [
      ...commonConfig.plugins,
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
      }),
    ],
  },
  
  // RAG module
  {
    input: 'src/rag/index.ts',
    output: [
      {
        file: 'dist/rag/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/rag/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    ...commonConfig,
    plugins: [
      ...commonConfig.plugins,
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
      }),
    ],
  },
  
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.build.json',
      }),
    ],
  },
  
  // Server type definitions
  {
    input: 'src/server/index.ts',
    output: {
      file: 'dist/server/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.build.json',
      }),
    ],
  },
  
  // Agent type definitions
  {
    input: 'src/agent/index.ts',
    output: {
      file: 'dist/agent/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.build.json',
      }),
    ],
  },
  
  // RAG type definitions
  {
    input: 'src/rag/index.ts',
    output: {
      file: 'dist/rag/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.build.json',
      }),
    ],
  },
];

export default builds;
