import axios, { AxiosInstance } from 'axios'

import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { startHttpServer, stopHttpServer } from '#/index'

const uuid = new ProviderFactory().createUUIDProvider()

let axiosAPIClient: AxiosInstance

beforeAll(async () => {
  const apiPort = await startHttpServer()
  const baseURL = `http://localhost:${apiPort}/api/v1`

  axiosAPIClient = axios.create({
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
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }

      const { status, data } = await axiosAPIClient.post('/register', input)

      expect(status).toBe(201)
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: input.email,
        }),
      )
    })

    it('should return error when email is already registered', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)
      const { status, data } = await axiosAPIClient.post('/register', input)
      expect(status).toBe(409)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'User Already Exists',
        }),
      )
    })

    it('should return error when email is invalid', async () => {
      const input = {
        email: 'johndoe+1@gmail.com',
        password: '12345@Aa',
      }
      const { status, data } = await axiosAPIClient.post('/register', input)
      expect(status).toBe(400)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Email',
        }),
      )
    })

    it('should return error when password is invalid', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345',
      }
      const { status, data } = await axiosAPIClient.post('/register', input)
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
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)

      const { status, data } = await axiosAPIClient.post('/authenticate', input)

      expect(status).toBe(201)
      expect(data).toHaveProperty('accessToken')
      expect(data).toHaveProperty('refreshToken')
    })

    it('should return error when email is invalid', async () => {
      const input = {
        email: 'johndoe+1@gmail.com',
        password: '12345@Aa',
      }
      const { status, data } = await axiosAPIClient.post('/authenticate', input)
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Password',
        }),
      )
    })

    it('should return error when password is invalid', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345',
      }
      const { status, data } = await axiosAPIClient.post('/authenticate', input)
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Password',
        }),
      )
    })

    it('should return error when email is not registered', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      const { status, data } = await axiosAPIClient.post('/authenticate', input)
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Password',
        }),
      )
    })

    it('should return error when password is wrong', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)
      const { status, data } = await axiosAPIClient.post('/authenticate', {
        email: input.email,
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
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)

      const { data } = await axiosAPIClient.post('/authenticate', input)

      const { status, data: newData } = await axiosAPIClient.post(`/sessions/${data.refreshToken}`)

      expect(status).toBe(201)
      expect(newData).toHaveProperty('accessToken')
      expect(newData).toHaveProperty('refreshToken')
    })

    it('should return error when refresh token is invalid', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)
      await axiosAPIClient.post('/authenticate', input)

      const { status, data } = await axiosAPIClient.post('/sessions/wrong-refresh-token')

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
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)

      const { data } = await axiosAPIClient.post('/authenticate', input)
      await axiosAPIClient.post('/authenticate', input)

      const { status, data: sessions } = await axiosAPIClient.get('/sessions', {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      expect(status).toBe(200)
      expect(sessions).toHaveLength(2)
    })

    it('should return error when user is not authenticated', async () => {
      const { status, data } = await axiosAPIClient.get('/sessions')
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
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)
      const { data } = await axiosAPIClient.post('/authenticate', input)
      const { status } = await axiosAPIClient.delete(`/sessions/${data.refreshToken}/token`)
      expect(status).toBe(204)
    })

    it('should return error when refresh token is already invalid', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)
      await axiosAPIClient.post('/authenticate', input)
      const { status, data } = await axiosAPIClient.delete('/sessions/invalid-refresh-token/token')
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
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)
      const { data } = await axiosAPIClient.post('/authenticate', input)
      const { data: sessions } = await axiosAPIClient.get('/sessions', {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      const { status } = await axiosAPIClient.delete(`/sessions/${sessions[0].id}/id`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      expect(status).toBe(204)
    })

    it('should return error when refresh token is already invalid', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', input)
      const { data } = await axiosAPIClient.post('/authenticate', input)
      const { data: sessions } = await axiosAPIClient.get('/sessions', {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      await axiosAPIClient.delete(`/sessions/${sessions[0].id}/id`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      const { status, data: newData } = await axiosAPIClient.delete(`/sessions/${sessions[0].id}/id`, {
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
      const firstInput = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      const secondInput = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/register', firstInput)
      await axiosAPIClient.post('/register', secondInput)
      const { data: right } = await axiosAPIClient.post('/authenticate', firstInput)
      const { data: wrong } = await axiosAPIClient.post('/authenticate', secondInput)
      const { data: sessions } = await axiosAPIClient.get('/sessions', {
        headers: {
          Authorization: `Bearer ${right.accessToken}`,
        },
      })
      const { status, data: error } = await axiosAPIClient.delete(`/sessions/${sessions[0].id}/id`, {
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
