import { Miniflare } from 'miniflare'
import { join } from 'path'

const mf = new Miniflare({
  port: 0,
  modules: true,
  buildCommand: 'NODE_ENV=test npm run build',
  scriptPath: join(__dirname, '..', 'dist', 'index.test.mjs'),
})

let httpServer: any

export const startHttpServer = async () => {
  httpServer = await mf.startServer()

  return httpServer.address().port
}

export const stopHttpServer = async () => {
  httpServer.close()
}
