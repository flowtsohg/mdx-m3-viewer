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

/**
 * Get the byte length of a UTF8 string.
 * 
 * @see https://stackoverflow.com/a/23329386
 */
export function byteLengthUtf8(str: string) {
  // returns the byte length of an utf8 string
  var s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
  }
  return s;
}
