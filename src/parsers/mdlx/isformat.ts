import { isStringInBytes, isStringInString } from '../../common/searches';

/**
 * Detects if the given object is an MDX source.
 */
export function isMdx(bytes: any) {
  if (bytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(bytes);
  }

  if (bytes instanceof Uint8Array) {
    if (bytes[0] === 0x4d && bytes[1] === 0x44 && bytes[2] === 0x4c && bytes[3] === 0x58) {
      return true;
    }
  }

  return false;
}

/**
 * Detects if the given object is an MDL source.
 */
export function isMdl(bytes: any) {
  if (bytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(bytes);
  }

  // Look for FormatVersion in the first 4KB.
  if (bytes instanceof Uint8Array && isStringInBytes(bytes, 'FormatVersion', 0, 4096)) {
    return true;
  }

  // If the source is a string, look for FormatVersion same as above.
  if (typeof bytes === 'string' && isStringInString(bytes, 'FormatVersion', 0, 4096)) {
    return true;
  }

  return false;
}
