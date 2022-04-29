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
  it('POST /register', async () => {
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

  it('POST /authenticate', async () => {
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

  it('PUT /sessions/:refreshToken', async () => {
    const input = {
      email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
      password: '12345@Aa',
    }
    await axiosAPIClient.post('/account/register', input)

    const { data } = await axiosAPIClient.post('/account/authenticate', input)

    const { status, data: newData } = await axiosAPIClient.put(
      `/account/sessions/${data.refreshToken}`,
    )

    expect(status).toBe(201)
    expect(newData).toHaveProperty('accessToken')
    expect(newData).toHaveProperty('refreshToken')
  })
})
