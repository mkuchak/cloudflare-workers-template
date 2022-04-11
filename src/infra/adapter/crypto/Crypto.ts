export interface ICryptoOptions {
  saltRounds?: number;
  saltBuffer?: string | ArrayBuffer;
  iterations?: number;
}

export interface Crypto {
  hash(value: string, options?: ICryptoOptions): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
