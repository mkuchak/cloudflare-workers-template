import axios, { AxiosInstance } from 'axios'

import { User } from '@/domain/entity/User'
import { startHttpServer, stopHttpServer } from '#/index'

let axiosAPIClient: AxiosInstance

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

describe('create user use case', () => {
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

  it('should create user', async () => {
    const email = `john_doe_${random(1000000, 9999999)}@gmail.com`

    const newUser = new User({
      email,
      password: '12345@Aa',
      name: 'John Doe',
    })

    const { status, data } = await axiosAPIClient.post(
      '/account/register',
      newUser,
    )

    console.log(data)

    expect(status).toBe(201)
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email,
      }),
    )
  })
})
