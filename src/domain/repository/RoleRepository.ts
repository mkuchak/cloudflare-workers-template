import { Role } from '../entity/Role'

export interface RoleRepository {
  save(role: Role): Promise<void>
  findById(id: string): Promise<Role>
  findByLabel(label: string): Promise<Role>
}
