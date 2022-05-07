export interface Http {
  join(...handlers: any[]): Promise<void>
  on(method: any, path: any, ...handlers: any[]): Promise<void>
  listen?(request: any, ...extra: any): Promise<any>
}
