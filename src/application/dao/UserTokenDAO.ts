export interface UserTokenDAO {
  findByUserId(userId: string): Promise<any>;
}
