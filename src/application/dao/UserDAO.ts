export interface UserDAO {
  findAll(page?: number, records?: number, order?: string): Promise<any>
}
