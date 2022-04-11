export interface ICryptoAdapterOptions {
  saltRounds?: number;
  saltBuffer?: string | ArrayBuffer;
  iterations?: number;
}

export interface CryptoAdapter {
  hash(value: string, options?: ICryptoAdapterOptions): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
