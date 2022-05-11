import { Permission } from '../entity/Permission'

export interface PermissionRepository {
  save(permission: Permission): Promise<void>
  findById(id: string): Promise<Permission>
  findByLabel(label: string): Promise<Permission>
  deleteById(id: string): Promise<void>
}
