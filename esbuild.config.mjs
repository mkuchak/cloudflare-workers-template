import 'dotenv/config'

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import NodeModulesPolyfill from '@esbuild-plugins/node-modules-polyfill'
import { build } from 'esbuild'
import alias from 'esbuild-plugin-alias'
import NodeModule from 'module'

const { NodeModulesPolyfillPlugin } = NodeModulesPolyfill

const { createRequire } = NodeModule
const require = createRequire(import.meta.url)

// Prepare environment variables
const define = {}
for (const k in process.env) {
  // Bypass windows errors
  if (k === 'CommonProgramFiles(x86)' || k === 'ProgramFiles(x86)') {
    continue
  }
  define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

const isDev = process.env.NODE_ENV === 'development'

try {
  await build({
    bundle: true,
    minify: !isDev,
    treeShaking: !isDev,
    sourcemap: true,
    format: 'esm',
    target: 'esnext',
    platform: 'browser',
    entryPoints: ['./src/index.ts'],
    outdir: './dist',
    outExtension: { '.js': '.mjs' },
    define,
    plugins: [
      NodeGlobalsPolyfillPlugin({
        process: true,
        buffer: true,
      }),
      NodeModulesPolyfillPlugin(),
      alias({
        '@prisma/client': require.resolve('@prisma/client'),
      }),
    ],
  })
} catch {
  process.exitCode = 1
}
