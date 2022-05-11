export interface CreateRBACInputDTO {
  id: string
  permissions?: {
    id?: string
    label?: string
  }[]
}
