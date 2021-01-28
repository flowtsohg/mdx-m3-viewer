import { isStringInBytes, isStringInString } from '../../common/searches';

/**
 * Detects if the given object is an MDX source.
 */
export function isMdx(object: any) {
  if (object instanceof ArrayBuffer) {
    let bytes = new Uint8Array(object);

    // MDLX
    if (bytes[0] === 0x4D && bytes[1] === 0x44 && bytes[2] === 0x4C && bytes[3] === 0x58) {
      return true;
    }
  }

  return false;
}

/**
 * Detects if the given object is an MDL source.
 */
export function isMdl(object: any) {
  if (object instanceof ArrayBuffer) {
    let bytes = new Uint8Array(object);

    // Look for FormatVersion in the first 4KB.
    if (isStringInBytes(bytes, 'FormatVersion', 0, 4096)) {
      return true;
    }
  }

  // If the source is a string, look for FormatVersion same as above.
  if (typeof object === 'string' && isStringInString(object, 'FormatVersion', 0, 4096)) {
    return true;
  }

  return false;
}
