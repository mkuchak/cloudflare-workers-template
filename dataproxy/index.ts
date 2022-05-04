import { PrismaClient } from '@prisma/client'
import express from 'express'
import { createPrismaExpressProxy } from 'prisma-server-dataproxy'

const app = express()
const prisma = new PrismaClient()

createPrismaExpressProxy({
  app,
  prisma,
  middleware: {},
  defaultMiddleware: (_request, _response, next) => next(),
})

const server = app.listen(9000, () => {
  console.info('Prisma local dataproxy listening on port 9000')
})

server.on('error', console.error)
