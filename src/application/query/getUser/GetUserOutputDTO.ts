export interface GetUserOutputDTO {
  id?: string
  email: string
  name?: string
  picture?: string
  isEmailVerified?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  role?: any[]
  permission?: any[]
}
