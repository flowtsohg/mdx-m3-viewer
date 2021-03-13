import { isStringInBytes } from '../../common/searches';

/**
 * Detects if the given object is a TGA source.
 */
export default function isTga(bytes: any) {
  if (bytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(bytes);
  }

  if (bytes instanceof Uint8Array && isStringInBytes(bytes, 'TRUEVISION-XFILE.\0', bytes.length - 18)) {
    return true;
  }

  return false;
}
