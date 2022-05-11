export interface DeleteRBACInputDTO {
  id: string
  permissions?: {
    id?: string
    label?: string
  }[]
}
