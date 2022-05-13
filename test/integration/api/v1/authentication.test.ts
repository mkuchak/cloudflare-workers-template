import axios, { AxiosInstance } from 'axios'

import { userFactory } from '#/factory'
import { startHttpServer, stopHttpServer } from '#/index'

let api: AxiosInstance

beforeAll(async () => {
  const apiPort = await startHttpServer()
  const baseURL = `http://localhost:${apiPort}/api/v1`

  api = axios.create({
    baseURL,
    validateStatus: () => true,
  })
})

afterAll(async () => {
  await stopHttpServer()
})

describe('/api/v1', () => {
  describe('POST /register', () => {
    it('should create user', async () => {
      const user = userFactory()

      const { status, data } = await api.post('/register', user)

      expect(status).toBe(201)
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: user.email.toLowerCase(),
        }),
      )
    })

    it('should return error when email is already registered', async () => {
      const user = userFactory()
      await api.post('/register', user)
      const { status, data } = await api.post('/register', user)
      expect(status).toBe(409)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'User Already Exists',
        }),
      )
    })

    it('should return error when email is invalid', async () => {
      const user = userFactory({ email: 'johndoe+1@gmail.com' })
      const { status, data } = await api.post('/register', user)
      expect(status).toBe(400)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Email',
        }),
      )
    })

    it('should return error when password is invalid', async () => {
      const user = userFactory({ password: '12345' })
      const { status, data } = await api.post('/register', user)
      expect(status).toBe(400)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Weak Password',
        }),
      )
    })
  })

  describe('POST /authenticate', () => {
    it('should authenticate user', async () => {
      const user = userFactory()
      await api.post('/register', user)

      const { status, data } = await api.post('/authenticate', user)

      expect(status).toBe(201)
      expect(data).toHaveProperty('accessToken')
      expect(data).toHaveProperty('refreshToken')
    })

    it('should return error when email is invalid', async () => {
      const user = userFactory({ email: 'johndoe+1@gmail.com' })
      const { status, data } = await api.post('/authenticate', user)
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Password',
        }),
      )
    })

    it('should return error when password is invalid', async () => {
      const user = userFactory({ password: '12345' })
      const { status, data } = await api.post('/authenticate', user)
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Password',
        }),
      )
    })

    it('should return error when email is not registered', async () => {
      const user = userFactory()
      const { status, data } = await api.post('/authenticate', user)
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Password',
        }),
      )
    })

    it('should return error when password is wrong', async () => {
      const user = userFactory()
      await api.post('/register', user)
      const { status, data } = await api.post('/authenticate', {
        email: user.email.toLowerCase(),
        password: '123456',
      })
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Password',
        }),
      )
    })
  })

  describe('POST /sessions/:refreshToken', () => {
    it('should refresh access token', async () => {
      const user = userFactory()
      await api.post('/register', user)

      const { data } = await api.post('/authenticate', user)

      const { status, data: newData } = await api.post(`/sessions/${data.refreshToken}`)

      expect(status).toBe(201)
      expect(newData).toHaveProperty('accessToken')
      expect(newData).toHaveProperty('refreshToken')
    })

    it('should return error when refresh token is invalid', async () => {
      const user = userFactory()
      await api.post('/register', user)
      await api.post('/authenticate', user)

      const { status, data } = await api.post('/sessions/wrong-refresh-token')

      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Token',
        }),
      )
    })
  })

  describe('GET /sessions', () => {
    it('should return all user sessions', async () => {
      const user = userFactory()
      await api.post('/register', user)

      const { data } = await api.post('/authenticate', user)
      await api.post('/authenticate', user)

      const { status, data: sessions } = await api.get('/sessions', {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      expect(status).toBe(200)
      expect(sessions).toHaveLength(2)
    })

    it('should return error when user is not authenticated', async () => {
      const { status, data } = await api.get('/sessions')
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Not Authorized',
        }),
      )
    })
  })

  describe('DELETE /sessions/:refreshToken/token', () => {
    it('should delete refresh token', async () => {
      const user = userFactory()
      await api.post('/register', user)
      const { data } = await api.post('/authenticate', user)
      const { status } = await api.delete(`/sessions/${data.refreshToken}/token`)
      expect(status).toBe(204)
    })

    it('should return error when refresh token is already invalid', async () => {
      const user = userFactory()
      await api.post('/register', user)
      await api.post('/authenticate', user)
      const { status, data } = await api.delete('/sessions/invalid-refresh-token/token')
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Token',
        }),
      )
    })
  })

  describe('DELETE /sessions/:refreshToken/id', () => {
    it('should delete refresh token', async () => {
      const user = userFactory()
      await api.post('/register', user)
      const { data } = await api.post('/authenticate', user)
      const { data: sessions } = await api.get('/sessions', {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      const { status } = await api.delete(`/sessions/${sessions[0].id}/id`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      expect(status).toBe(204)
    })

    it('should return error when refresh token is already invalid', async () => {
      const user = userFactory()
      await api.post('/register', user)
      const { data } = await api.post('/authenticate', user)
      const { data: sessions } = await api.get('/sessions', {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      await api.delete(`/sessions/${sessions[0].id}/id`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      const { status, data: newData } = await api.delete(`/sessions/${sessions[0].id}/id`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      expect(status).toBe(401)
      expect(newData).toEqual(
        expect.objectContaining({
          error: 'Invalid Token',
        }),
      )
    })

    it('should return error if token does not belong to authenticated user', async () => {
      const firstUser = userFactory()
      const secondUser = userFactory()
      await api.post('/register', firstUser)
      await api.post('/register', secondUser)
      const { data: right } = await api.post('/authenticate', firstUser)
      const { data: wrong } = await api.post('/authenticate', secondUser)
      const { data: sessions } = await api.get('/sessions', {
        headers: {
          Authorization: `Bearer ${right.accessToken}`,
        },
      })
      const { status, data: error } = await api.delete(`/sessions/${sessions[0].id}/id`, {
        headers: {
          Authorization: `Bearer ${wrong.accessToken}`,
        },
      })
      expect(status).toBe(401)
      expect(error).toEqual(
        expect.objectContaining({
          error: 'Invalid Token',
        }),
      )
    })
  })
})
