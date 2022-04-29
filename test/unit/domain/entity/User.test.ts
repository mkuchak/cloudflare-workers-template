import { User } from '@/domain/entity/User'

describe('User', () => {
  it('should create a new user with a valid email and password', () => {
    const validEmails = ['johndoe@gmail.com', 'john_doe@gmail.com', 'john.doe@gmail.com', 'john-doe@gmail.com', 'johndoe@hotmail.com.br', 'jd@pm.me']
    const validPasswords = ['12345@Aa', 'Abcd1@#$', 'abcD~1234', 'abcD!1234', 'abcD1#234', 'abcD12$34', 'abcD123%4', 'abcD1234^', 'abcD&1234', 'abc*D1234', 'ab(cD1234', 'a)bcD1234', '-abcD1234', 'abcD=1234', 'abc1D+234', 'abc.1D234', 'ab4cD;123', 'bcD,12a34']

    validEmails.forEach((email) => {
      const data = {
        email,
        password: validPasswords[Math.floor(Math.random() * validPasswords.length)],
      }
      const user = new User(data)
      expect(user).toBeInstanceOf(User)
      expect(user).toHaveProperty('id')
      expect(user.email).toBe(data.email)
      expect(user.password).toBe(data.password)
      expect(user).toEqual(expect.objectContaining(data))
    })

    validPasswords.forEach((password) => {
      const data = {
        email: validEmails[Math.floor(Math.random() * validEmails.length)],
        password,
      }
      const user = new User(data)
      expect(user).toBeInstanceOf(User)
      expect(user).toHaveProperty('id')
      expect(user.email).toBe(data.email)
      expect(user.password).toBe(data.password)
      expect(user).toEqual(expect.objectContaining(data))
    })
  })

  it('should throw an error if email is not valid', () => {
    const invalidEmails = ['johndoe+1@gmail.com', 'johndoe@gmailcom', 'johndoegmail.com', 'johndoegmailcom', 'johndoe@', '@gmail.com', '@.com']

    invalidEmails.forEach((email) => {
      expect(
        () =>
          new User({
            id: '123',
            email,
            password: '12345@Aa',
          }),
      ).toThrowError('Invalid Email')
    })
  })

  it('should throw an error if password is not valid', () => {
    const invalidPasswords = ['1234567', '12345Aa', '1234@Aa', '12345@AA', '12345@aa', '!@#$%^&*', 'Abcd1234', 'Abcd!@#$', '123!@#$%^&*', '123!@#$%^&*A', '123!@#$%^&*a', 'password', 'PASSWORD', 'PASSWORD123', 'passworD', '1password2', '1pass@word2', 'p4ssword', 'P@SSWORD']

    invalidPasswords.forEach((password) => {
      expect(
        () =>
          new User({
            email: 'johndoe@gmail.com',
            password,
          }),
      ).toThrowError('Weak Password')
    })
  })

  it('should parse the user name correctly', () => {
    const namesMap = [
      {
        name: undefined,
        expected: {
          firstName: undefined,
          middleName: undefined,
          lastName: undefined,
          nameInitials: undefined,
        },
      },
      {
        name: 'John',
        expected: {
          firstName: 'John',
          middleName: undefined,
          lastName: undefined,
          nameInitials: 'J',
        },
      },
      {
        name: 'John Doe',
        expected: {
          firstName: 'John',
          middleName: undefined,
          lastName: 'Doe',
          nameInitials: 'JD',
        },
      },
      {
        name: 'John Doe Jr.',
        expected: {
          firstName: 'John',
          middleName: 'Doe',
          lastName: 'Jr.',
          nameInitials: 'JJ',
        },
      },
      {
        name: 'John Nhoj Eod Doe',
        expected: {
          firstName: 'John',
          middleName: 'Nhoj Eod',
          lastName: 'Doe',
          nameInitials: 'JD',
        },
      },
    ]

    namesMap.forEach((mapName) => {
      const user = new User({
        email: 'johndoe@gmail.com',
        password: '12345@Aa',
        name: mapName.name,
      })
      expect(user.name).toBe(mapName.name)
      expect(user.firstName).toBe(mapName.expected.firstName)
      expect(user.middleName).toBe(mapName.expected.middleName)
      expect(user.lastName).toBe(mapName.expected.lastName)
      expect(user.nameInitials).toBe(mapName.expected.nameInitials)
    })
  })
})
