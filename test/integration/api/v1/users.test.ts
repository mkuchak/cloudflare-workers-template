import axios, { AxiosInstance } from 'axios'

import { accessTokenFactory, permissionFactory, roleFactory, userFactory } from '#/factory'
import { startHttpServer, stopHttpServer } from '#/index'

let axiosAPIClient: AxiosInstance
let adminOptions: any
let userOptions: any

beforeAll(async () => {
  const apiPort = await startHttpServer()
  const baseURL = `http://localhost:${apiPort}/api/v1`

  axiosAPIClient = axios.create({
    baseURL,
    validateStatus: () => true,
  })

  adminOptions = { headers: { Authorization: `Bearer ${await accessTokenFactory(['admin'])}` } }
  userOptions = { headers: { Authorization: `Bearer ${await accessTokenFactory()}` } }
})

afterAll(async () => {
  await stopHttpServer()
})

describe('/api/v1', () => {
  describe('GET /me', () => {
    it('should return the user data', async () => {
      const user = userFactory()
      await axiosAPIClient.post('/register', user)
      const { data: session } = await axiosAPIClient.post('/authenticate', {
        email: user.email,
        password: user.password,
      })

      const { status, data } = await axiosAPIClient.get('/me', {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })

      expect(status).toBe(200)
      expect(data).toEqual(
        expect.objectContaining({
          email: expect.any(String),
          name: expect.any(String),
          picture: expect.any(String),
          isEmailVerified: expect.any(Boolean),
          roles: expect.any(Array),
          permissions: expect.any(Array),
        }),
      )
    })

    it('should return an error when the user is not authenticated', async () => {
      const { status, data } = await axiosAPIClient.get('/me')

      expect(status).toBe(401)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Not Authorized',
        }),
      )
    })
  })

  describe('GET /users', () => {
    it('should return the users', async () => {
      const user = userFactory()
      await axiosAPIClient.post('/register', user)

      const { status, data } = await axiosAPIClient.get('/users', adminOptions)

      expect(status).toBe(200)
      expect(data).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              email: expect.any(String),
              name: expect.any(String),
              picture: expect.any(String),
              isEmailVerified: expect.any(Boolean),
              isActive: expect.any(Boolean),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              role: expect.any(Array),
              permission: expect.any(Array),
            }),
          ]),
          totalRecords: expect.any(Number),
          totalPages: expect.any(Number),
          currentPage: expect.any(Number),
        }),
      )
    })

    it('should return an error when the user is not authorized', async () => {
      const { status, data } = await axiosAPIClient.get('/users', userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('GET /users/:id', () => {
    it('should return the user', async () => {
      const user = userFactory()
      const { data: userData } = await axiosAPIClient.post('/register', user)

      const { status, data } = await axiosAPIClient.get(`/users/${userData.id}`, adminOptions)

      expect(status).toBe(200)
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          name: expect.any(String),
          picture: expect.any(String),
          isEmailVerified: expect.any(Boolean),
          isActive: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          role: expect.any(Array),
          permission: expect.any(Array),
        }),
      )
    })

    it('should return an error when the user is not authorized', async () => {
      const { status, data } = await axiosAPIClient.get('/users/some-user-id', userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('POST /users/:id/rbac', () => {
    it('should update the user roles', async () => {
      const user = userFactory()
      const { data: userData } = await axiosAPIClient.post('/register', user)

      const role = roleFactory()
      const { data: roleData } = await axiosAPIClient.post('/roles', role, adminOptions)

      const { status } = await axiosAPIClient.post(
        `/users/${userData.id}/rbac`,
        { roles: [{ id: roleData.id }] },
        adminOptions,
      )

      const { data: userDataWithRole } = await axiosAPIClient.get(`/users/${userData.id}`, adminOptions)
      const userRole = userDataWithRole.role.find((r: any) => r.label === roleData.label)

      expect(status).toBe(201)
      expect(userRole).toEqual(
        expect.objectContaining({
          label: expect.any(String),
        }),
      )
    })

    it('should update the user permissions', async () => {
      const user = userFactory()
      const { data: userData } = await axiosAPIClient.post('/register', user)

      const permission = permissionFactory()
      const { data: permissionData } = await axiosAPIClient.post('/permissions', permission, adminOptions)

      const { status } = await axiosAPIClient.post(
        `/users/${userData.id}/rbac`,
        {
          permissions: [{ id: permissionData.id }],
        },
        adminOptions,
      )

      const { data: userDataWithPermission } = await axiosAPIClient.get(`/users/${userData.id}`, adminOptions)
      const userPermission = userDataWithPermission.permission.find((p: any) => p.label === permissionData.label)

      expect(status).toBe(201)
      expect(userPermission).toEqual(
        expect.objectContaining({
          label: expect.any(String),
        }),
      )
    })

    it('should update the user roles and permissions', async () => {
      const user = userFactory()
      const { data: userData } = await axiosAPIClient.post('/register', user)

      const role = roleFactory()
      const permission = permissionFactory()
      await axiosAPIClient.post('/roles', role, adminOptions)
      await axiosAPIClient.post('/permissions', permission, adminOptions)

      const { status } = await axiosAPIClient.post(
        `/users/${userData.id}/rbac`,
        {
          roles: [{ label: role.label }],
          permissions: [{ label: permission.label }],
        },
        adminOptions,
      )

      const { data: userDataWithRoleAndPermission } = await axiosAPIClient.get(`/users/${userData.id}`, adminOptions)
      const userRole = userDataWithRoleAndPermission.role.find((r: any) => r.label === role.label)
      const userPermission = userDataWithRoleAndPermission.permission.find((p: any) => p.label === permission.label)

      expect(status).toBe(201)
      expect(userRole).toEqual(
        expect.objectContaining({
          label: expect.any(String),
        }),
      )
      expect(userPermission).toEqual(
        expect.objectContaining({
          label: expect.any(String),
        }),
      )
    })

    it('should return an error when the user is not authorized', async () => {
      const { status, data } = await axiosAPIClient.post('/users/some-user-id/rbac', {}, userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('DELETE /users/:id/rbac', () => {
    it('should remove the user roles', async () => {
      const user = userFactory()
      const { data: userData } = await axiosAPIClient.post('/register', user)

      const role = roleFactory()
      const { data: roleData } = await axiosAPIClient.post('/roles', role, adminOptions)

      await axiosAPIClient.post(`/users/${userData.id}/rbac`, { roles: [{ id: roleData.id }] }, adminOptions)

      const { status } = await axiosAPIClient.delete(`/users/${userData.id}/rbac`, {
        data: { roles: [{ id: roleData.id }] },
        ...adminOptions,
      })

      const { data: userDataWithRole } = await axiosAPIClient.get(`/users/${userData.id}`, adminOptions)
      const userRole = userDataWithRole.role.find((r: any) => r.label === roleData.label)

      expect(status).toBe(204)
      expect(userRole).toBeUndefined()
    })

    it('should remove the user permissions', async () => {
      const user = userFactory()
      const { data: userData } = await axiosAPIClient.post('/register', user)

      const permission = permissionFactory()
      const { data: permissionData } = await axiosAPIClient.post('/permissions', permission, adminOptions)

      await axiosAPIClient.post(
        `/users/${userData.id}/rbac`,
        { permissions: [{ id: permissionData.id }] },
        adminOptions,
      )

      const { status } = await axiosAPIClient.delete(`/users/${userData.id}/rbac`, {
        data: { permissions: [{ id: permissionData.id }] },
        ...adminOptions,
      })

      const { data: userDataWithPermission } = await axiosAPIClient.get(`/users/${userData.id}`, adminOptions)
      const userPermission = userDataWithPermission.permission.find((p: any) => p.label === permissionData.label)

      expect(status).toBe(204)
      expect(userPermission).toBeUndefined()
    })

    it('should remove the user roles and permissions', async () => {
      const user = userFactory()
      const { data: userData } = await axiosAPIClient.post('/register', user)

      const role = roleFactory()
      const permission = permissionFactory()
      await axiosAPIClient.post('/roles', role, adminOptions)
      await axiosAPIClient.post('/permissions', permission, adminOptions)

      await axiosAPIClient.post(
        `/users/${userData.id}/rbac`,
        {
          roles: [{ label: role.label }],
          permissions: [{ label: permission.label }],
        },
        adminOptions,
      )

      const { status } = await axiosAPIClient.delete(`/users/${userData.id}/rbac`, {
        data: {
          roles: [{ label: role.label }],
          permissions: [{ label: permission.label }],
        },
        ...adminOptions,
      })

      const { data: userDataWithRoleAndPermission } = await axiosAPIClient.get(`/users/${userData.id}`, adminOptions)
      const userRole = userDataWithRoleAndPermission.role.find((r: any) => r.label === role.label)
      const userPermission = userDataWithRoleAndPermission.permission.find((p: any) => p.label === permission.label)

      expect(status).toBe(204)
      expect(userRole).toBeUndefined()
      expect(userPermission).toBeUndefined()
    })

    it('should return an error when the user is not authorized', async () => {
      const { status, data } = await axiosAPIClient.delete('/users/some-user-id/rbac', userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })
})
