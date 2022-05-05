export interface JWT {
  sign(payload: any, secret: string, options?: any): Promise<string>
  verify(token: string, secret: string, options?: any): Promise<boolean>
  decode(token: string): any
}
