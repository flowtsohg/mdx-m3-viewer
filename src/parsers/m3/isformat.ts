/**
 * Detects if the given object is an M3 source.
 */
export default function isM3(object: any) {
  if (object instanceof ArrayBuffer && object.byteLength > 4) {
    let buffer = new Uint32Array(object, 0, 1);

    // MD34.
    if (buffer[0] === 0x4d443334) {
      return true;
    }
  }

  return false;
}
