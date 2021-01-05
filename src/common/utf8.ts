let decoder = new TextDecoder();
let encoder = new TextEncoder();

/**
 * Decode bytes as a UTF8 string.
 */
export function decodeUtf8(buffer: ArrayBuffer | Uint8Array) {
  return decoder.decode(buffer);
}

/**
 * Encode a UTF8 string to bytes.
 */
export function encodeUtf8(utf8: string) {
  return encoder.encode(utf8);
}
