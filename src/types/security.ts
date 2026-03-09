export interface SecurityRuntimeConfig {
  enableEncryption: boolean;
  secretKey: string;
  encryptMethods: string[];
}

export interface SecureEnvelope {
  ver: string;
  alg: string;
  ts: number;
  nonce: string;
  payload: string;
  sign: string;
}

export interface EncryptOptions {
  method?: string;
  force?: boolean;
}

export interface DecryptOptions {
  force?: boolean;
}
