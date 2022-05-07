export interface IHashOptions {
  saltRounds?: number
  saltBuffer?: string | ArrayBuffer
  iterations?: number
}

export interface Hash {
  generate(value: string, options?: IHashOptions): Promise<string>
  compare(value: string, hash: string): Promise<boolean>
}
