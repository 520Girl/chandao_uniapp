import type {
  DecryptOptions,
  EncryptOptions,
  SecureEnvelope,
  SecurityRuntimeConfig
} from "@/types/security";

const ENCRYPTION_ALGORITHM = "XOR-BASE64";
const ENVELOPE_VERSION = "1";

// 将 UTF-8 字符串编码为二进制字符串，便于后续按字节处理。
function encodeUtf8ToBinary(str: string): string {
  return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_m, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
}

// 将二进制字符串还原为 UTF-8 文本。
function decodeBinaryToUtf8(binary: string): string {
  const encoded = binary
    .split("")
    .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
    .join("");
  return decodeURIComponent(encoded);
}

// base64 编码，兼容无 btoa 的运行环境。
function base64Encode(binary: string): string {
  if (typeof btoa === "function") {
    return btoa(binary);
  }

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let str = binary;
  let output = "";
  let block = 0;
  let charCode = 0;
  let index = 0;
  let map = chars;

  while (str.charAt(index) || ((map = "="), index % 1)) {
    charCode = str.charCodeAt((index += 3 / 4));
    if (charCode > 0xff) {
      throw new Error("Invalid character for base64 encoding");
    }
    block = (block << 8) | charCode;
    output += map.charAt((63 & (block >> (8 - (index % 1) * 8))) as number);
  }

  return output;
}

// base64 解码，兼容无 atob 的运行环境。
function base64Decode(base64: string): string {
  if (typeof atob === "function") {
    return atob(base64);
  }

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let str = base64.replace(/=+$/, "");
  let output = "";

  if (str.length % 4 === 1) {
    throw new Error("Invalid base64 string");
  }

  let bc = 0;
  let bs = 0;
  let buffer: number;
  let idx = 0;

  for (; (buffer = str.charAt(idx++).charCodeAt(0)); ) {
    buffer = chars.indexOf(String.fromCharCode(buffer));
    if (buffer === -1) continue;
    bs = bc % 4 ? bs * 64 + buffer : buffer;
    if (bc++ % 4) {
      output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
    }
  }

  return output;
}

// 对输入做异或变换，同一 key 下可用于加密与解密。
function xorTransform(input: string, key: string): string {
  if (!key) return input;
  let output = "";
  for (let i = 0; i < input.length; i += 1) {
    output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return output;
}

// 轻量签名校验（FNV 变体），用于检测数据篡改。
function checksum(content: string): string {
  let hash = 2166136261;
  for (let i = 0; i < content.length; i += 1) {
    hash ^= content.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16);
}

// 生成随机 nonce，避免相同 payload 产生完全相同签名串。
function randomNonce(length = 16): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function isSecureEnvelope(value: any): value is SecureEnvelope {
  return !!(
    value &&
    typeof value === "object" &&
    typeof value.payload === "string" &&
    typeof value.nonce === "string" &&
    typeof value.sign === "string" &&
    typeof value.ts === "number"
  );
}

function shouldEncryptByMethod(method: string | undefined, allowed: string[]): boolean {
  if (!method) return true;
  return allowed.includes(method.toUpperCase());
}

/**
 * 判断当前请求是否需要加密。
 * 优先级：force=true > 全局开关 > 方法白名单。
 */
export function shouldEncryptRequest(
  runtimeConfig: SecurityRuntimeConfig,
  options: EncryptOptions = {}
): boolean {
  if (options.force === true) return true;
  if (!runtimeConfig.enableEncryption) return false;
  return shouldEncryptByMethod(options.method, runtimeConfig.encryptMethods);
}

/**
 * 将请求体封装为加密信封结构。
 * 返回值兼容 request 层直接透传到 `uni.request`。
 */
export function encryptPayload(
  data: any,
  runtimeConfig: SecurityRuntimeConfig,
  options: EncryptOptions = {}
): any {
  if (!shouldEncryptRequest(runtimeConfig, options)) {
    return data;
  }

  const source = typeof data === "undefined" ? {} : data;
  const raw = JSON.stringify(source);
  const ts = Date.now();
  const nonce = randomNonce();
  const binary = encodeUtf8ToBinary(raw);
  const cipher = xorTransform(binary, runtimeConfig.secretKey);
  const payload = base64Encode(cipher);
  const sign = checksum(`${payload}|${ts}|${nonce}|${runtimeConfig.secretKey}`);

  const envelope: SecureEnvelope = {
    ver: ENVELOPE_VERSION,
    alg: ENCRYPTION_ALGORITHM,
    ts,
    nonce,
    payload,
    sign
  };

  return {
    encrypted: true,
    data: envelope
  };
}

/**
 * 自动识别并解密响应数据；若非加密结构则原样返回。
 * 解密前会先做签名校验，防止中间链路数据被篡改。
 */
export function decryptPayload(
  maybeEncrypted: any,
  runtimeConfig: SecurityRuntimeConfig,
  options: DecryptOptions = {}
): any {
  if (options.force !== true && !runtimeConfig.enableEncryption) {
    return maybeEncrypted;
  }

  let envelope: SecureEnvelope | null = null;

  if (isSecureEnvelope(maybeEncrypted)) {
    envelope = maybeEncrypted;
  } else if (
    maybeEncrypted &&
    maybeEncrypted.encrypted === true &&
    isSecureEnvelope(maybeEncrypted.data)
  ) {
    envelope = maybeEncrypted.data;
  }

  if (!envelope) {
    return maybeEncrypted;
  }

  const expectedSign = checksum(
    `${envelope.payload}|${envelope.ts}|${envelope.nonce}|${runtimeConfig.secretKey}`
  );

  if (expectedSign !== envelope.sign) {
    throw new Error("响应数据签名校验失败");
  }

  const cipher = base64Decode(envelope.payload);
  const binary = xorTransform(cipher, runtimeConfig.secretKey);
  const plainText = decodeBinaryToUtf8(binary);

  try {
    return JSON.parse(plainText);
  } catch (error) {
    throw new Error("响应数据解密后不是有效 JSON");
  }
}
