import { isStringInBytes } from '../../common/searches';

/**
 * Detects if the given object is a TGA source.
 */
export default function isTga(object: any) {
  if (object instanceof ArrayBuffer) {
    let buffer = new Uint8Array(object);

    if (isStringInBytes(buffer, 'TRUEVISION-XFILE.\0', buffer.length - 18)) {
      return true;
    }
  }

  return false;
}
