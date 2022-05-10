export interface DeleteUserRBACInputDTO {
  id: string
  roles?: {
    id?: string
    label?: string
  }[]
  permissions?: {
    id?: string
    label?: string
  }[]
}
