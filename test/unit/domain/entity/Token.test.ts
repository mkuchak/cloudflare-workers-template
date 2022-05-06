import { Token } from '@/domain/entity/Token'

describe('Token', () => {
  it('should create a new user token', async () => {
    const token = new Token({
      userId: '12345',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    })

    expect(token).toEqual(
      expect.objectContaining({
        userId: '12345',
      }),
    )
    expect(token).toHaveProperty('id')
    expect(token).toHaveProperty('value')
  })

  it('should create a new user token if no expired date is provided', async () => {
    const token = new Token({
      userId: '12345',
    })

    expect(token).toEqual(
      expect.objectContaining({
        userId: '12345',
      }),
    )
    expect(token).toHaveProperty('id')
    expect(token).toHaveProperty('value')
  })

  it('should not create a user token with an expired date', async () => {
    expect(
      () =>
        new Token({
          id: '12345',
          userId: '12345',
          value: '12345',
          expiresAt: new Date(Date.now() - 1000), // expired
        }),
    ).toThrowError('Invalid Token')
  })
})
