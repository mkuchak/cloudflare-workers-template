export interface UserDAO {
  findById(id: string): Promise<any>
  findAllWithPagination(page?: number, records?: number, order?: string): Promise<any>
}
