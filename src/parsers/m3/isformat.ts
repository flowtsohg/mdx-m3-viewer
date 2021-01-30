/**
 * Detects if the given object is an M3 source.
 */
export default function isM3(bytes: any) {
  if (bytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(bytes);
  }

  if (bytes instanceof Uint8Array) {
    if (bytes[0] === 0x34 && bytes[1] === 0x33 && bytes[2] === 0x44 && bytes[3] === 0x4d) {
      return true;
    }
  }

  return false;
}
