export interface Http {
  join(path: string, ...handlers: any): Promise<void>;
  on(method: string, path: string, ...handlers: any): Promise<void>;
  listen?(request: any, ...extra: any): Promise<any>;
}
