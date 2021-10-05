const decoder = new TextDecoder();
const encoder = new TextEncoder();

/**
 * Decode bytes as a UTF8 string.
 */
export function decodeUtf8(buffer: ArrayBuffer | Uint8Array): string {
  return decoder.decode(buffer);
}

/**
 * Encode a UTF8 string to bytes.
 */
export function encodeUtf8(utf8: string): Uint8Array {
  return encoder.encode(utf8);
}

/**
 * Get the byte length of a UTF8 string.
 * 
 * @see https://stackoverflow.com/a/23329386
 */
export function byteLengthUtf8(str: string): number {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
  }
  return s;
}

/**
 * Splits the given string into an array of strings.
 * 
 * Each string will have a byte length smaller or equal to chunkBytelength when encoded as UTF8.
 * 
 * @see https://stackoverflow.com/a/18729931
 */
export function splitUtf8ByteLength(str: string, chunkBytelength: number): string[] {
  const chunks = [];
  let pos = 0;
  let bytes = 0;

  for (let i = 0, l = str.length; i < l; i++) {
    const code = str.charCodeAt(i);

    if (code < 0x80) {
      bytes += 1;
    } else if (code < 0x800) {
      bytes += 2;
    } else if (code < 0xd800 || code >= 0xe000) {
      bytes += 3;
    } else {
      i++;
      bytes += 4;
    }

    if (bytes >= chunkBytelength - 3) {
      chunks.push(str.substr(pos, i));

      pos += i;
      bytes = 0;
    }
  }

  if (bytes > 0) {
    chunks.push(str.substr(pos));
  }

  return chunks;
}
