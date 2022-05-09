export interface UserDAO {
  findAllWithPagination(page?: number, records?: number, order?: string): Promise<any>
}
