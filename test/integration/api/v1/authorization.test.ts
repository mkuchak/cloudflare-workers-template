import axios, { AxiosInstance } from 'axios'

import { accessTokenFactory, permissionFactory, roleFactory } from '#/factory'
import { startHttpServer, stopHttpServer } from '#/index'

let api: AxiosInstance
let adminOptions: any
let userOptions: any

beforeAll(async () => {
  const apiPort = await startHttpServer()
  const baseURL = `http://localhost:${apiPort}/api/v1`

  api = axios.create({
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
  describe('GET /roles', () => {
    it('should return an array of roles', async () => {
      const { status, data } = await api.get('/roles', adminOptions)

      expect(status).toBe(200)
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            label: expect.any(String),
          }),
        ]),
      )
    })

    it('should return an error when the user is not authorized', async () => {
      const { status, data } = await api.get('/roles', userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('GET /permissions', () => {
    it('should return an array of permissions', async () => {
      const { status, data } = await api.get('/permissions', adminOptions)

      expect(status).toBe(200)
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            label: expect.any(String),
          }),
        ]),
      )
    })

    it('should return an error when the user is not authorized', async () => {
      const { status, data } = await api.get('/permissions', userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('POST /roles', () => {
    it('should create a new role', async () => {
      const role = roleFactory()
      const { status, data } = await api.post('/roles', role, adminOptions)
      const { status: newStatus, data: newData } = await api.get('/roles', adminOptions)
      const newRole = newData.find((role: any) => role.id === data.id)

      expect(status).toBe(201)
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          label: role.label,
        }),
      )
      expect(newStatus).toBe(200)
      expect(newRole).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...role,
        }),
      )
    })

    it('should return an error when the user is not authorized', async () => {
      const role = roleFactory()
      const { status, data } = await api.post('/roles', role, userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('DELETE /roles/:id', () => {
    it('should delete a role', async () => {
      const role = roleFactory()
      const { data: newRole } = await api.post('/roles', role, adminOptions)

      const { data: newData } = await api.get('/roles', adminOptions)
      const newRoleData = newData.find((role: any) => role.id === newRole.id)

      const { status } = await api.delete(`/roles/${newRole.id}`, adminOptions)

      const { data: newDataAfterDelete } = await api.get('/roles', adminOptions)
      const newRoleDataAfterDelete = newDataAfterDelete.find((role: any) => role.id === newRole.id)

      expect(status).toBe(204)
      expect(newRoleData).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...role,
        }),
      )
      expect(newRoleDataAfterDelete).toBeUndefined()
    })

    it('should return an error when the user is not authorized', async () => {
      const role = roleFactory()
      const { data: newRole } = await api.post('/roles', role, adminOptions)
      const { status, data } = await api.delete(`/roles/${newRole.id}`, userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('POST /permissions', () => {
    it('should create a new permission', async () => {
      const permission = permissionFactory()
      const { status, data } = await api.post('/permissions', permission, adminOptions)
      const { status: newStatus, data: newData } = await api.get('/permissions', adminOptions)
      const newPermission = newData.find((permission: any) => permission.id === data.id)

      expect(status).toBe(201)
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          label: permission.label,
        }),
      )
      expect(newStatus).toBe(200)
      expect(newPermission).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...permission,
        }),
      )
    })

    it('should return an error when the user is not authorized', async () => {
      const permission = permissionFactory()
      const { status, data } = await api.post('/permissions', permission, userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('DELETE /permissions/:id', () => {
    it('should delete a permission', async () => {
      const permission = permissionFactory()
      const { data: newPermission } = await api.post('/permissions', permission, adminOptions)

      const { data: newData } = await api.get('/permissions', adminOptions)
      const newPermissionData = newData.find((permission: any) => permission.id === newPermission.id)

      const { status } = await api.delete(`/permissions/${newPermission.id}`, adminOptions)

      const { data: newDataAfterDelete } = await api.get('/permissions', adminOptions)
      const newPermissionDataAfterDelete = newDataAfterDelete.find(
        (permission: any) => permission.id === newPermission.id,
      )

      expect(status).toBe(204)
      expect(newPermissionData).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...permission,
        }),
      )
      expect(newPermissionDataAfterDelete).toBeUndefined()
    })

    it('should return an error when the user is not authorized', async () => {
      const permission = permissionFactory()
      const { data: newPermission } = await api.post('/permissions', permission, adminOptions)
      const { status, data } = await api.delete(`/permissions/${newPermission.id}`, userOptions)

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('POST /roles/:id/permissions', () => {
    it('should add a permission to a role through label', async () => {
      const role = roleFactory()
      const { data: newRole } = await api.post('/roles', role, adminOptions)
      const permission = permissionFactory()
      const { data: newPermission } = await api.post('/permissions', permission, adminOptions)

      const { status } = await api.post(
        `/roles/${newRole.id}/permissions`,
        [{ label: newPermission.label }],
        adminOptions,
      )

      const { data: newData } = await api.get('/roles', adminOptions)
      const newRoleData = newData.find((role: any) => role.id === newRole.id)
      const newPermissionData = newRoleData.permission.find((permission: any) => permission.id === newPermission.id)

      expect(status).toBe(201)
      expect(newPermissionData).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...permission,
        }),
      )
    })

    it('should add a permission to a role through id', async () => {
      const role = roleFactory()
      const { data: newRole } = await api.post('/roles', role, adminOptions)
      const { data: newPermission } = await api.post('/permissions', permissionFactory(), adminOptions)

      const { status } = await api.post(`/roles/${newRole.id}/permissions`, [{ id: newPermission.id }], adminOptions)

      expect(status).toBe(201)
    })

    it('should add multiple permissions to a role', async () => {
      const role = roleFactory()
      const { data: newRole } = await api.post('/roles', role, adminOptions)
      const { data: firstPermission } = await api.post('/permissions', permissionFactory(), adminOptions)
      const { data: secondPermission } = await api.post('/permissions', permissionFactory(), adminOptions)

      const { status } = await api.post(
        `/roles/${newRole.id}/permissions`,
        [{ id: firstPermission.id }, { label: secondPermission.label }],
        adminOptions,
      )

      expect(status).toBe(201)
    })

    it('should return an error when the user is not authorized', async () => {
      const role = roleFactory()
      const { data: newRole } = await api.post('/roles', role, adminOptions)
      const permission = permissionFactory()
      const { data: newPermission } = await api.post('/permissions', permission, adminOptions)

      const { status, data } = await api.post(
        `/roles/${newRole.id}/permissions`,
        [{ label: newPermission.label }],
        userOptions,
      )

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })

  describe('DELETE /roles/:id/permissions/:permissionId', () => {
    it('should delete a permission from a role', async () => {
      const role = roleFactory()
      const { data: newRole } = await api.post('/roles', role, adminOptions)
      const permission = permissionFactory()
      const { data: newPermission } = await api.post('/permissions', permission, adminOptions)
      await api.post(`/roles/${newRole.id}/permissions`, [{ id: newPermission.id }], adminOptions)

      const { status } = await api.delete(`/roles/${newRole.id}/permissions`, {
        data: [{ id: newPermission.id }],
        ...adminOptions,
      })

      const { data: newData } = await api.get('/roles', adminOptions)
      const newRoleData = newData.find((role: any) => role.id === newRole.id)
      const newPermissionData = newRoleData.permission.find((permission: any) => permission.id === newPermission.id)

      expect(status).toBe(204)
      expect(newPermissionData).toBeUndefined()
    })

    it('should return an error when the user is not authorized', async () => {
      const role = roleFactory()
      const { data: newRole } = await api.post('/roles', role, adminOptions)
      const permission = permissionFactory()
      const { data: newPermission } = await api.post('/permissions', permission, adminOptions)
      await api.post(`/roles/${newRole.id}/permissions`, [{ id: newPermission.id }], adminOptions)

      const { status, data } = await api.delete(`/roles/${newRole.id}/permissions`, {
        data: [{ id: newPermission.id }],
        ...userOptions,
      })

      expect(status).toBe(403)
      expect(data).toEqual(
        expect.objectContaining({
          error: 'Restricted Access',
        }),
      )
    })
  })
})
