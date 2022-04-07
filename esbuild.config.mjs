import { build } from 'esbuild'

try {
  await build({
    bundle: true,
    // minify: true,
    sourcemap: true,
    format: 'esm',
    target: 'esnext',
    entryPoints: ['./src/index.ts'],
    outdir: './dist',
    outExtension: { '.js': '.mjs' },
  })
} catch {
  process.exitCode = 1
}
