/**
 * Detects if the given object is a BLP source.
 */
export default function isBlp(bytes: any) {
  if (bytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(bytes);
  }

  if (bytes instanceof Uint8Array) {
    if (bytes[0] === 0x42 && bytes[1] === 0x4c && bytes[2] === 0x50 && bytes[3] === 0x31) {
      return true;
    }
  }

  return false;
}
