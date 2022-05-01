import axios, { AxiosInstance } from 'axios'

import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { startHttpServer, stopHttpServer } from '#/index'

let axiosAPIClient: AxiosInstance
let uuid: NanoidAdapter

beforeAll(async () => {
  const apiPort = await startHttpServer()
  const baseURL = `http://localhost:${apiPort}/api/v1`

  axiosAPIClient = axios.create({
    baseURL,
    validateStatus: () => true,
  })

  uuid = new NanoidAdapter()
})

afterAll(async () => {
  await stopHttpServer()
})

describe('/api/v1/account', () => {
  describe('POST /register', () => {
    it('should create user', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }

      const { status, data } = await axiosAPIClient.post(
        '/account/register',
        input,
      )

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
      await axiosAPIClient.post('/account/register', input)
      const { status, data } = await axiosAPIClient.post(
        '/account/register',
        input,
      )
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
      const { status, data } = await axiosAPIClient.post(
        '/account/register',
        input,
      )
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
      const { status, data } = await axiosAPIClient.post(
        '/account/register',
        input,
      )
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
      await axiosAPIClient.post('/account/register', input)

      const { status, data } = await axiosAPIClient.post(
        '/account/authenticate',
        input,
      )

      expect(status).toBe(201)
      expect(data).toHaveProperty('accessToken')
      expect(data).toHaveProperty('refreshToken')
    })

    it('should return error when email is invalid', async () => {
      const input = {
        email: 'johndoe+1@gmail.com',
        password: '12345@Aa',
      }
      const { status, data } = await axiosAPIClient.post(
        '/account/authenticate',
        input,
      )
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
      const { status, data } = await axiosAPIClient.post(
        '/account/authenticate',
        input,
      )
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
      const { status, data } = await axiosAPIClient.post(
        '/account/authenticate',
        input,
      )
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
      await axiosAPIClient.post('/account/register', input)
      const { status, data } = await axiosAPIClient.post(
        '/account/authenticate',
        {
          email: input.email,
          password: '123456',
        },
      )
      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Password',
        }),
      )
    })
  })

  describe('PUT /sessions/:refreshToken', () => {
    it('should refresh access token', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/account/register', input)

      const { data } = await axiosAPIClient.post(
        '/account/authenticate',
        input,
      )

      const { status, data: newData } = await axiosAPIClient.put(
        `/account/sessions/${data.refreshToken}`,
      )

      expect(status).toBe(201)
      expect(newData).toHaveProperty('accessToken')
      expect(newData).toHaveProperty('refreshToken')
    })

    it('should return error when refresh token is invalid', async () => {
      const input = {
        email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
        password: '12345@Aa',
      }
      await axiosAPIClient.post('/account/register', input)
      await axiosAPIClient.post('/account/authenticate', input)

      const { status, data } = await axiosAPIClient.put(
        '/account/sessions/wrong-refresh-token',
      )

      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Invalid Refresh Token',
        }),
      )
    })
  })
})
