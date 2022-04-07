import { PrismaClient } from '@prisma/client'

function random (min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default {
  async fetch (request: Request) {
    const { method } = request
    const { pathname } = new URL(request.url)

    if (method !== 'GET' && pathname !== '/') {
      return new Response('Not Found')
    }

    const uuid = random(100000, 999999)

    const prisma = new PrismaClient()

    const user = await prisma.user.create({
      data: {
        name: `name-${uuid}`,
        email: `${uuid}@gmail.com`,
        password: `password-${uuid}`,
      },
    })

    const users = await prisma.user.count()

    const data = JSON.stringify({
      message: `Hello, name-${uuid}! :)`,
      user,
      totalUsers: users,
    })

    // return new Response(JSON.stringify(uuid), {
    return new Response(data, {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
