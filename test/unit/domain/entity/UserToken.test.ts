import { UserToken } from '@/domain/entity/UserToken'

describe('UserToken', () => {
  it('should create a new user token', async () => {
    const userToken = new UserToken({
      userId: '12345',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    })

    expect(userToken).toEqual(
      expect.objectContaining({
        userId: '12345',
      }),
    )
    expect(userToken).toHaveProperty('id')
    expect(userToken).toHaveProperty('token')
  })

  it('should create a new user token if no expired date is provided', async () => {
    const userToken = new UserToken({
      userId: '12345',
    })

    expect(userToken).toEqual(
      expect.objectContaining({
        userId: '12345',
      }),
    )
    expect(userToken).toHaveProperty('id')
    expect(userToken).toHaveProperty('token')
  })

  it('should not create a user token with an expired date', async () => {
    expect(
      () =>
        new UserToken({
          id: '12345',
          userId: '12345',
          token: '12345',
          expiresAt: new Date(Date.now() - 1000), // expired
        }),
    ).toThrowError('Invalid Token')
  })
})
